import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lista de rotas públicas que não precisam de autenticação
  const publicPaths = [
    '/login',
    '/api/auth/login',
    '/api/auth/verify'
  ]

  // Permitir acesso a rotas públicas
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Permitir acesso a arquivos estáticos e recursos do Next.js
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') // arquivos com extensão
  ) {
    return NextResponse.next()
  }

  // Por enquanto, permitir todas as requisições
  // Em produção, implementar verificação completa de JWT
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}