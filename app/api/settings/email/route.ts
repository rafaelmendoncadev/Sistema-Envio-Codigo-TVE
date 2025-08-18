
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const settings = await prisma.apiSetting.findUnique({
      where: { serviceType: 'email' }
    })

    if (!settings) {
      return NextResponse.json({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        useSsl: true
      })
    }

    // Decrypt config (simplified for demo - use proper encryption in production)
    const config = JSON.parse(settings.encryptedConfig)
    
    return NextResponse.json({
      ...config,
      lastTested: settings.lastTested,
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

    // Encrypt config (simplified for demo - use proper encryption in production)
    const encryptedConfig = JSON.stringify({
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      useSsl
    })

    await prisma.apiSetting.upsert({
      where: { serviceType: 'email' },
      update: {
        encryptedConfig,
        updatedAt: new Date(),
      },
      create: {
        serviceType: 'email',
        encryptedConfig,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save Email settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
