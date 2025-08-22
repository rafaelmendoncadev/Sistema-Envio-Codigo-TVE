import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// ID fixo do usuário admin que já existe no banco
const ADMIN_USER_ID = '2a456663-74f2-4703-be1c-ab3aa0bf09ba'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo foi enviado' }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Apenas arquivos Excel (.xlsx, .xls) são aceitos' 
      }, { status: 400 })
    }

    console.log('Processing file:', file.name, 'Size:', file.size)

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse Excel file
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON starting from row 3 (index 2)
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
    
    if (!data || data.length < 3) {
      return NextResponse.json({ 
        error: 'A planilha deve ter pelo menos 3 linhas de dados' 
      }, { status: 400 })
    }

    console.log('Excel data rows:', data.length)

    // Create upload session with fixed admin user ID
    let session
    try {
      session = await prisma.uploadSession.create({
        data: {
          user_id: ADMIN_USER_ID,
          filename: file.name,
          file_size: file.size,
          totalCodes: 0,
          processed_codes: 0,
          status: 'processing',
        },
      })
      console.log('Session created:', session.id)
    } catch (sessionError) {
      console.error('Session creation error:', sessionError)
      
      // Try to get or create admin user if ID doesn't work
      try {
        let adminUser = await prisma.users.findUnique({
          where: { email: 'admin@example.com' }
        })
        
        if (!adminUser) {
          adminUser = await prisma.users.create({
            data: {
              email: 'admin@example.com',
              name: 'Admin User',
              password_hash: 'admin123_temp'
            }
          })
        }
        
        // Retry with found/created user
        session = await prisma.uploadSession.create({
          data: {
            user_id: adminUser.id,
            filename: file.name,
            file_size: file.size,
            totalCodes: 0,
            processed_codes: 0,
            status: 'processing',
          },
        })
      } catch (retryError) {
        console.error('Retry failed:', retryError)
        return NextResponse.json({ 
          error: 'Erro ao criar sessão de upload' 
        }, { status: 500 })
      }
    }

    // Extract codes starting from row 3 (index 2)
    const codes = []
    let validCodesCount = 0
    let errorCount = 0

    for (let i = 2; i < data.length; i++) {
      const row = data[i] as any[]
      const columnAValue = row[0]?.toString()?.trim() || ''
      const columnDValue = row[3]?.toString()?.trim() || ''

      if (columnAValue || columnDValue) {
        const combinedCode = `${columnAValue} - ${columnDValue}`
        
        try {
          const code = await prisma.code.create({
            data: {
              sessionId: session.id,
              columnAValue: columnAValue || null,
              columnDValue: columnDValue || null,
              combinedCode,
              rowNumber: i + 1,
              status: 'available',
            },
          })

          codes.push(code)
          validCodesCount++
        } catch (codeError) {
          console.error(`Error creating code at row ${i + 1}:`, codeError)
          errorCount++
        }
      }
    }

    console.log(`Processed: ${validCodesCount} codes created, ${errorCount} errors`)

    // Update session with counts
    try {
      await prisma.uploadSession.update({
        where: { id: session.id },
        data: {
          totalCodes: data.length - 2,
          processed_codes: validCodesCount,
          status: 'completed',
        },
      })
    } catch (updateError) {
      console.error('Session update error:', updateError)
      // Continue even if update fails
    }

    // Trigger event to update UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('codesUpdated'))
    }

    return NextResponse.json({
      session_id: session.id,
      codes,
      total_count: validCodesCount,
      message: `Upload concluído: ${validCodesCount} códigos processados`
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    return NextResponse.json({ 
      error: 'Erro ao processar arquivo. Tente novamente.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}