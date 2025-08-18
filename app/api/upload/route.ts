
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

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

    // Create upload session
    const session = await prisma.uploadSession.create({
      data: {
        filename: file.name,
        totalCodes: 0,
        validCodes: 0,
      },
    })

    // Extract codes starting from row 3 (index 2)
    const codes = []
    let validCodesCount = 0

    for (let i = 2; i < data.length; i++) {
      const row = data[i] as any[]
      const columnAValue = row[0]?.toString()?.trim() || ''
      const columnDValue = row[3]?.toString()?.trim() || ''

      if (columnAValue || columnDValue) {
        const combinedCode = `${columnAValue} - ${columnDValue}`
        
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
      }
    }

    // Update session with counts
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: {
        totalCodes: data.length - 2, // Subtract header rows
        validCodes: validCodesCount,
      },
    })

    return NextResponse.json({
      session_id: session.id,
      codes,
      total_count: validCodesCount,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor ao processar arquivo' 
    }, { status: 500 })
  }
}
