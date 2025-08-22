import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// Use uma chave secreta segura em produção (coloque no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email e senha são obrigatórios' 
      }, { status: 400 })
    }

    // Buscar usuário no banco
    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      // Criar usuário padrão se for o admin (primeira vez)
      if (email === 'admin@example.com' && password === 'admin123') {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = await prisma.users.create({
          data: {
            email,
            name: 'Admin User',
            password_hash: hashedPassword
          }
        })

        // Gerar token JWT
        const token = jwt.sign(
          { userId: newUser.id, email: newUser.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        )

        return NextResponse.json({
          success: true,
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
          }
        })
      }

      return NextResponse.json({ 
        error: 'Credenciais inválidas' 
      }, { status: 401 })
    }

    // Verificar senha
    let isValid = false
    
    // Para o usuário admin temporário, aceitar tanto a senha hash quanto admin123
    if (user.email === 'admin@example.com' && user.password_hash === 'temporary_hash' && password === 'admin123') {
      // Atualizar para senha hash adequada
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.users.update({
        where: { id: user.id },
        data: { password_hash: hashedPassword }
      })
      isValid = true
    } else {
      // Verificação normal com bcrypt
      isValid = await bcrypt.compare(password, user.password_hash)
    }

    if (!isValid) {
      return NextResponse.json({ 
        error: 'Credenciais inválidas' 
      }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}