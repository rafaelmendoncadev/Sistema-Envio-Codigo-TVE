
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('=== GET /api/codes called ===')
  
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')

    console.log('Parameters:', { sessionId, page, limit, status })

    const where: any = {}
    
    if (sessionId) {
      where.sessionId = sessionId
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    console.log('Query where clause:', JSON.stringify(where))

    let codes: any[] = []
    let total = 0

    try {
      // First, test database connection
      console.log('Testing database connection...')
      const testCount = await prisma.code.count()
      console.log(`Database connected. Total codes in database: ${testCount}`)
      
      // Now fetch with filters
      console.log('Fetching codes with filters...')
      codes = await prisma.code.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      })

      total = await prisma.code.count({ where })
      
      console.log(`Query result: Found ${codes.length} codes matching filters, total matching: ${total}`)
      
      // Log first code if exists for debugging
      if (codes.length > 0) {
        console.log('Sample code:', {
          id: codes[0].id,
          status: codes[0].status,
          sessionId: codes[0].sessionId,
          combinedCode: codes[0].combinedCode?.substring(0, 20) + '...'
        })
      }
    } catch (dbError) {
      console.error('Database error in GET /api/codes:', dbError)
      console.error('Error details:', {
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      // Em caso de erro, retornar array vazio ao invés de falhar
      codes = []
      total = 0
    }

    const response = {
      codes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
    
    console.log('Sending response with', codes.length, 'codes')
    return NextResponse.json(response)

  } catch (error) {
    console.error('Unexpected error in GET /api/codes:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Retornar resposta válida mesmo em caso de erro
    return NextResponse.json({
      codes: [],
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        pages: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
