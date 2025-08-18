
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const settings = await prisma.apiSetting.findUnique({
      where: { serviceType: 'whatsapp' }
    })

    if (!settings) {
      return NextResponse.json({
        accessToken: '',
        phoneNumberId: '',
        webhookUrl: ''
      })
    }

    // Decrypt config (simplified for demo - use proper encryption in production)
    const config = JSON.parse(settings.encryptedConfig)
    
    return NextResponse.json({
      ...config,
      lastTested: settings.lastTested,
    })

  } catch (error) {
    console.error('Get WhatsApp settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, phoneNumberId, webhookUrl } = await request.json()

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ 
        error: 'Access Token e Phone Number ID são obrigatórios' 
      }, { status: 400 })
    }

    // Encrypt config (simplified for demo - use proper encryption in production)
    const encryptedConfig = JSON.stringify({
      accessToken,
      phoneNumberId,
      webhookUrl
    })

    await prisma.apiSetting.upsert({
      where: { serviceType: 'whatsapp' },
      update: {
        encryptedConfig,
        updatedAt: new Date(),
      },
      create: {
        serviceType: 'whatsapp',
        encryptedConfig,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save WhatsApp settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
