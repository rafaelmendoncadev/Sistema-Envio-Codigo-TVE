
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export const dynamic = 'force-dynamic'

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

export async function POST(request: NextRequest) {
  try {
    const { code_ids } = await request.json()

    if (!code_ids || !Array.isArray(code_ids) || code_ids.length === 0) {
      return NextResponse.json({
        error: 'Lista de IDs de códigos é obrigatória'
      }, { status: 400 })
    }

    // Get default user for history tracking
    const user = await getDefaultUser()
    if (!user) {
      return NextResponse.json({
        error: 'Usuário não encontrado'
      }, { status: 404 })
    }

    // Update codes status to available
    const result = await prisma.code.updateMany({
      where: {
        id: { in: code_ids }
      },
      data: {
        status: 'available',
        archivedAt: null,
      },
    })

    // Create history entries for unarchived codes
    for (let i = 0; i < code_ids.length; i++) {
      await prisma.send_history.create({
        data: {
          user_id: user.id,
          action_type: 'unarchive',
          codes_count: 1,
          status: 'success',
        },
      })
    }

    console.log(`Unarchived ${result.count} codes`)

    return NextResponse.json({
      success: true,
      unarchived_count: result.count,
    })

  } catch (error) {
    console.error('Unarchive codes error:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
