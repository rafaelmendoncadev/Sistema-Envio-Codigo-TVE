
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// Temporary default user ID - in production this should come from auth
const DEFAULT_USER_EMAIL = 'admin@example.com'

async function getOrCreateDefaultUser() {
  try {
    // Try to find existing user
    let user = await prisma.users.findUnique({
      where: { email: DEFAULT_USER_EMAIL }
    })

    // If not found, create a default user
    if (!user) {
      console.log('Creating default admin user for upload...')
      user = await prisma.users.create({
        data: {
          email: DEFAULT_USER_EMAIL,
          name: 'Admin User',
          password_hash: 'admin123_temp', // Temporário
        }
      })
      console.log('Admin user created:', user.id)
    }

    return user
  } catch (error) {
    console.error('Error getting/creating default user:', error)
    throw new Error('Unable to get or create user for upload')
  }
}

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

    // Get or create default user
    let user
    try {
      user = await getOrCreateDefaultUser()
      console.log('User for upload:', user.id, user.email)
    } catch (userError) {
      console.error('Failed to get/create user:', userError)
      return NextResponse.json({ 
        error: 'Erro ao preparar usuário para upload' 
      }, { status: 500 })
    }

    // Create upload session
    let session
    try {
      session = await prisma.uploadSession.create({
        data: {
          user_id: user.id,
          filename: file.name,
          file_size: file.size,
          totalCodes: 0,
          processed_codes: 0,
          status: 'processing',
        },
      })
      console.log('Upload session created:', session.id)
    } catch (sessionError) {
      console.error('Failed to create upload session:', sessionError)
      return NextResponse.json({ 
        error: 'Erro ao criar sessão de upload. Verifique se o usuário está configurado corretamente.' 
      }, { status: 500 })
    }

    // Extract codes starting from row 3 (index 2)
    const codes = []
    let validCodesCount = 0

    console.log(`Processing ${data.length - 2} potential codes...`)

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
              rowNumber: i + 1, // +1 because Excel rows are 1-indexed
              status: 'available',
            },
          })

          codes.push(code)
          validCodesCount++
        } catch (codeError) {
          console.error(`Failed to create code at row ${i + 1}:`, codeError)
          // Continue processing other codes even if one fails
        }
      }
    }

    console.log(`Created ${validCodesCount} codes successfully`)

    // Update session with counts
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: {
        totalCodes: data.length - 2, // Subtract header rows
        processed_codes: validCodesCount,
        status: 'completed',
      },
    })

    return NextResponse.json({
      session_id: session.id,
      codes,
      total_count: validCodesCount,
    })

  } catch (error) {
    console.error('Upload error details:', error)
    
    // Retornar mensagem de erro mais específica
    let errorMessage = 'Erro ao processar arquivo'
    
    if (error instanceof Error) {
      if (error.message.includes('user')) {
        errorMessage = 'Erro ao identificar usuário. Faça login novamente.'
      } else if (error.message.includes('session')) {
        errorMessage = 'Erro ao criar sessão de upload.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
