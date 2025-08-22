import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Temporarily return empty settings (auth not implemented)
    return NextResponse.json({
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      useSsl: true
    })

  } catch (error) {
    console.error('Get Email settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, useSsl } = await request.json()

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      return NextResponse.json({ 
        error: 'Todos os campos SMTP são obrigatórios' 
      }, { status: 400 })
    }

    // Temporarily skip saving (auth not implemented)
    console.log('Email settings update skipped (auth not implemented)')

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save Email settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}