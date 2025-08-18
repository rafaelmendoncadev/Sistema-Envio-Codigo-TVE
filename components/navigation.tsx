
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { Home, Settings, History } from 'lucide-react'

const navigation = [
  { name: 'Principal', href: '/', icon: Home },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
  { name: 'Histórico', href: '/historico', icon: History },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">CR</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Códigos de Recarga
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
