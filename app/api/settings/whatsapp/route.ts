import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Temporarily return empty settings (auth not implemented)
    return NextResponse.json({
      accessToken: '',
      phoneNumberId: '',
      webhookUrl: ''
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

    // Temporarily skip saving (auth not implemented)
    console.log('WhatsApp settings update skipped (auth not implemented)')

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save WhatsApp settings error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}