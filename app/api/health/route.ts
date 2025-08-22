import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('=== Health check endpoint called ===')
  
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      connected: false,
      error: null,
      counts: {}
    }
  }

  try {
    // Test database connection
    console.log('Testing database connection...')
    
    // Count users
    try {
      const userCount = await prisma.users.count()
      diagnostics.database.counts.users = userCount
      console.log(`Users count: ${userCount}`)
    } catch (e) {
      console.error('Error counting users:', e)
      diagnostics.database.counts.users = 'error'
    }

    // Count upload sessions
    try {
      const sessionCount = await prisma.uploadSession.count()
      diagnostics.database.counts.uploadSessions = sessionCount
      console.log(`Upload sessions count: ${sessionCount}`)
    } catch (e) {
      console.error('Error counting sessions:', e)
      diagnostics.database.counts.uploadSessions = 'error'
    }

    // Count codes
    try {
      const codeCount = await prisma.code.count()
      diagnostics.database.counts.codes = codeCount
      console.log(`Codes count: ${codeCount}`)
      
      // Count by status
      const availableCount = await prisma.code.count({ where: { status: 'available' } })
      const sentCount = await prisma.code.count({ where: { status: 'sent' } })
      const archivedCount = await prisma.code.count({ where: { status: 'archived' } })
      
      diagnostics.database.counts.codesByStatus = {
        available: availableCount,
        sent: sentCount,
        archived: archivedCount
      }
      console.log('Codes by status:', diagnostics.database.counts.codesByStatus)
    } catch (e) {
      console.error('Error counting codes:', e)
      diagnostics.database.counts.codes = 'error'
    }

    // Get sample data
    try {
      const sampleCode = await prisma.code.findFirst({
        where: { status: 'available' },
        orderBy: { createdAt: 'desc' }
      })
      
      if (sampleCode) {
        diagnostics.database.sampleCode = {
          id: sampleCode.id,
          status: sampleCode.status,
          sessionId: sampleCode.sessionId,
          createdAt: sampleCode.createdAt,
          hasColumnA: !!sampleCode.columnAValue,
          hasColumnD: !!sampleCode.columnDValue
        }
      } else {
        diagnostics.database.sampleCode = 'No available codes found'
      }
    } catch (e) {
      console.error('Error getting sample code:', e)
      diagnostics.database.sampleCode = 'error'
    }

    diagnostics.database.connected = true
    console.log('Database diagnostics complete:', diagnostics)

  } catch (error) {
    console.error('Database connection error:', error)
    diagnostics.database.connected = false
    diagnostics.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json(diagnostics)
}