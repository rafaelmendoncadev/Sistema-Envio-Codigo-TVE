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
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt for:', email)

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email e senha são obrigatórios' 
      }, { status: 400 })
    }

    // Buscar usuário no banco
    let user = null
    try {
      user = await prisma.users.findUnique({
        where: { email }
      })
    } catch (dbError) {
      console.error('Database error finding user:', dbError)
    }

    if (!user) {
      // Criar usuário padrão se for o admin (primeira vez)
      if (email === 'admin@example.com' && password === 'admin123') {
        console.log('Creating default admin user...')
        
        try {
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

          console.log('Admin user created successfully')

          return NextResponse.json({
            success: true,
            token,
            user: {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name
            }
          })
        } catch (createError) {
          console.error('Error creating admin user:', createError)
          return NextResponse.json({ 
            error: 'Erro ao criar usuário admin' 
          }, { status: 500 })
        }
      }

      return NextResponse.json({ 
        error: 'Credenciais inválidas' 
      }, { status: 401 })
    }

    // Verificar senha
    let isValid = false
    
    try {
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
    } catch (passwordError) {
      console.error('Password verification error:', passwordError)
      return NextResponse.json({ 
        error: 'Erro ao verificar senha' 
      }, { status: 500 })
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

    console.log('Login successful for:', email)

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
    console.error('Login error details:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}