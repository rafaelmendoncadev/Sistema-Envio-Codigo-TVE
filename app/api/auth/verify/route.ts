import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Token não fornecido' 
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    try {
      // Decodificar token simples
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Verificar se tem os campos necessários
      if (decoded.userId && decoded.email) {
        return NextResponse.json({
          valid: true,
          userId: decoded.userId,
          email: decoded.email
        })
      }
      
      return NextResponse.json({ 
        error: 'Token inválido' 
      }, { status: 401 })
      
    } catch (decodeError) {
      return NextResponse.json({ 
        error: 'Token inválido ou expirado' 
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}