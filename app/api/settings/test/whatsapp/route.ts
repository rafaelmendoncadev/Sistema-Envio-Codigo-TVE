
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { accessToken, phoneNumberId } = await request.json()

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ 
        error: 'Access Token e Phone Number ID são obrigatórios' 
      }, { status: 400 })
    }

    // Simulate WhatsApp API test (replace with actual API test)
    console.log('Testing WhatsApp connection with:', { accessToken, phoneNumberId })
    
    // Update last tested timestamp
    await prisma.apiSetting.updateMany({
      where: { serviceType: 'whatsapp' },
      data: { lastTested: new Date() },
    })

    // Simulate successful test
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Test WhatsApp error:', error)
    return NextResponse.json({ 
      error: 'Erro ao testar conexão WhatsApp' 
    }, { status: 500 })
  }
}
