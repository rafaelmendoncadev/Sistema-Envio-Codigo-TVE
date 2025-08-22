
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [totalCodes, sentCodes, archivedCodes, totalSessions] = await Promise.all([
      prisma.code.count(),
      prisma.code.count({ where: { status: 'sent' } }),
      prisma.code.count({ where: { status: 'archived' } }),
      prisma.uploadSession.count(),
    ])

    return NextResponse.json({
      totalCodes,
      sentCodes,
      archivedCodes,
      totalSessions,
    })

  } catch (error) {
    console.error('Get statistics error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
