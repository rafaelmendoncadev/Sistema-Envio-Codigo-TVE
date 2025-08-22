
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')

    console.log('GET /api/codes - params:', { sessionId, page, limit, status })

    const where: any = {}
    
    if (sessionId) {
      where.sessionId = sessionId
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    let codes: any[] = []
    let total = 0

    try {
      codes = await prisma.code.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      })

      total = await prisma.code.count({ where })
      
      console.log(`Found ${codes.length} codes, total: ${total}`)
    } catch (dbError) {
      console.error('Database error in GET /api/codes:', dbError)
      // Em caso de erro, retornar array vazio ao invés de falhar
      codes = []
      total = 0
    }

    return NextResponse.json({
      codes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get codes error:', error)
    // Retornar resposta válida mesmo em caso de erro
    return NextResponse.json({
      codes: [],
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        pages: 0,
      },
    })
  }
}
