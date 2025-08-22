
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// Temporary default user - in production this should come from auth
const DEFAULT_USER_EMAIL = 'admin@example.com'

async function getDefaultUser() {
  try {
    const user = await prisma.users.findUnique({
      where: { email: DEFAULT_USER_EMAIL }
    })
    return user
  } catch (error) {
    console.error('Error getting default user:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const actionType = searchParams.get('action_type')
    const status = searchParams.get('status')

    // Get default user for filtering
    const user = await getDefaultUser()
    if (!user) {
      return NextResponse.json({
        history: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      })
    }

    const where: any = {
      user_id: user.id
    }
    
    if (actionType && actionType !== 'all') {
      where.action_type = actionType
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const history = await prisma.send_history.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.send_history.count({ where })

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
