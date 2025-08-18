
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const actionType = searchParams.get('action_type')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (actionType && actionType !== 'all') {
      where.actionType = actionType
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const history = await prisma.historyItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        code: {
          select: {
            combinedCode: true,
          },
        },
      },
    })

    const total = await prisma.historyItem.count({ where })

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
