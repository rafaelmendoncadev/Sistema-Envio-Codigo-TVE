
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { code_ids } = await request.json()

    if (!code_ids || !Array.isArray(code_ids) || code_ids.length === 0) {
      return NextResponse.json({ 
        error: 'Lista de IDs de códigos é obrigatória' 
      }, { status: 400 })
    }

    // Update codes status to archived
    const result = await prisma.code.updateMany({
      where: { 
        id: { in: code_ids } 
      },
      data: {
        status: 'archived',
        archivedAt: new Date(),
      },
    })

    console.log(`Archived ${result.count} codes`)

    return NextResponse.json({
      success: true,
      archived_count: result.count,
    })

  } catch (error) {
    console.error('Archive codes error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
