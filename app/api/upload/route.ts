import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log('=== Upload endpoint called ===')
  
  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'Nenhum arquivo foi enviado' }, { status: 400 })
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size)

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse Excel file
    let data
    try {
      const workbook = xlsx.read(buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      console.log('Excel parsed successfully. Rows:', data.length)
    } catch (parseError) {
      console.error('Excel parse error:', parseError)
      return NextResponse.json({ 
        error: 'Erro ao ler arquivo Excel. Verifique se o arquivo está correto.' 
      }, { status: 400 })
    }
    
    if (!data || data.length < 3) {
      return NextResponse.json({ 
        error: 'A planilha deve ter pelo menos 3 linhas de dados' 
      }, { status: 400 })
    }

    // Find or create admin user - REQUIRED for session
    let userId: string
    try {
      // Try to find existing admin user
      const adminUser = await prisma.users.findFirst({
        where: { 
          email: 'admin@example.com' 
        }
      })
      
      if (adminUser) {
        userId = adminUser.id
        console.log('Using existing admin user:', userId)
      } else {
        // Create admin user if doesn't exist
        const newUser = await prisma.users.create({
          data: {
            email: 'admin@example.com',
            name: 'Admin User',
            password_hash: 'temp'
          }
        })
        userId = newUser.id
        console.log('Created new admin user:', userId)
      }
    } catch (userError) {
      console.error('User error:', userError)
      // Try one more time with a different email
      try {
        const timestamp = Date.now()
        const fallbackUser = await prisma.users.create({
          data: {
            email: `admin_${timestamp}@example.com`,
            name: 'Admin User',
            password_hash: 'temp'
          }
        })
        userId = fallbackUser.id
        console.log('Created fallback user:', userId)
      } catch (fallbackError) {
        console.error('Fallback user creation failed:', fallbackError)
        return NextResponse.json({ 
          error: 'Não foi possível criar usuário para sessão' 
        }, { status: 500 })
      }
    }

    // Create upload session - REQUIRED for codes
    let session: any
    try {
      session = await prisma.uploadSession.create({
        data: {
          user_id: userId,
          filename: file.name,
          file_size: file.size,
          totalCodes: 0,
          processed_codes: 0,
          status: 'processing'
        }
      })
      console.log('Session created:', session.id)
    } catch (sessionError) {
      console.error('Session creation failed:', sessionError)
      return NextResponse.json({ 
        error: 'Não foi possível criar sessão de upload',
        details: sessionError instanceof Error ? sessionError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Process codes
    const codes = []
    let successCount = 0
    let errorCount = 0
    
    console.log('Processing codes from row 3...')
    
    for (let i = 2; i < Math.min(data.length, 1000); i++) { // Limit to 1000 rows for safety
      const row = data[i] as any[]
      const columnA = row[0]?.toString()?.trim() || ''
      const columnD = row[3]?.toString()?.trim() || ''

      if (columnA || columnD) {
        const combinedCode = `${columnA} - ${columnD}`
        
        try {
          const codeData = {
            sessionId: session.id,  // Always required
            columnAValue: columnA || null,
            columnDValue: columnD || null,
            combinedCode,
            rowNumber: i + 1,
            status: 'available'
          }
          
          const code = await prisma.code.create({ data: codeData })
          codes.push(code)
          successCount++
          
          if (successCount % 10 === 0) {
            console.log(`Processed ${successCount} codes...`)
          }
        } catch (codeError) {
          console.error(`Failed to create code at row ${i + 1}:`, codeError)
          errorCount++
        }
      }
    }

    console.log(`Upload complete: ${successCount} success, ${errorCount} errors`)

    // Update session with final counts
    try {
      await prisma.uploadSession.update({
        where: { id: session.id },
        data: {
          totalCodes: data.length - 2,
          processed_codes: successCount,
          status: 'completed'
        }
      })
      console.log('Session updated successfully')
    } catch (updateError) {
      console.error('Session update failed:', updateError)
      // Non-critical error, continue
    }

    return NextResponse.json({
      success: true,
      session_id: session.id,
      codes_created: successCount,
      errors: errorCount,
      message: `Upload concluído: ${successCount} códigos criados${errorCount > 0 ? `, ${errorCount} erros` : ''}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Erro ao processar arquivo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}