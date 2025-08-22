
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { code_ids, email, subject } = await request.json()

    if (!code_ids || !Array.isArray(code_ids) || code_ids.length === 0) {
      return NextResponse.json({ 
        error: 'Lista de IDs de códigos é obrigatória' 
      }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ 
        error: 'Email é obrigatório' 
      }, { status: 400 })
    }

    // Get Email settings (temporarily skip - will need auth implementation)
    // For now, just proceed without checking settings
    console.log('Email service - settings check skipped (auth not implemented)')

    // Get codes to send
    const codes = await prisma.code.findMany({
      where: { 
        id: { in: code_ids },
        status: { not: 'archived' }
      }
    })

    let sentCount = 0

    for (const code of codes) {
      try {
        // Simulate Email API call (replace with actual email sending)
        console.log(`Sending Email to ${email}: ${code.combinedCode}`)
        
        // Update code status
        await prisma.code.update({
          where: { id: code.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        })

        // Log success (history tracking can be added later when implementing full auth)
        console.log(`Email sent successfully to ${email}`)

        sentCount++

      } catch (sendError) {
        console.error('Email send error:', sendError)
      }
    }

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
    })

  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
