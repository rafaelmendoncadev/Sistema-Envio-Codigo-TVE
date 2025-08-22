'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSidebarContext } from '../contexts/sidebar-context'
import { cn } from '../lib/utils'
import { Home, Settings, History, Archive, Menu, X, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'

const navigation = [
  { name: 'Principal', href: '/', icon: Home },
  { name: 'Arquivo', href: '/arquivo', icon: Archive },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
  { name: 'Histórico', href: '/historico', icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const { isCollapsed, toggleSidebar } = useSidebarContext()

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    setUserName(localStorage.getItem('userName') || 'Usuário')
    setUserEmail(localStorage.getItem('userEmail') || '')
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    toast.success('Logout realizado com sucesso!')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">CR</span>
              </div>
              <h1 className="text-sm font-semibold text-gray-900">
                Códigos de Recarga
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="border-t bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                {/* User Info and Logout - Mobile */}
                <div className="border-t mt-2 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{userName}</span>
                    </div>
                    <span className="text-xs">{userEmail}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex fixed left-0 top-0 h-full bg-white border-r shadow-sm z-40 flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={cn(
            'flex items-center space-x-2 transition-opacity duration-200',
            isCollapsed ? 'opacity-0' : 'opacity-100'
          )}>
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">CR</span>
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-semibold text-gray-900">
                Códigos de Recarga
              </h1>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 group',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600',
                    isCollapsed ? 'justify-center' : ''
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <span className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* User Info and Logout - Desktop */}
          <div className="border-t p-4">
            <div className={cn(
              "mb-3 transition-opacity duration-200",
              isCollapsed ? "hidden" : "block"
            )}>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <User className="h-4 w-4" />
                <span className="font-medium truncate">{userName}</span>
              </div>
              <span className="text-xs text-gray-500 truncate block">{userEmail}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 group relative",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && (
                <span className="ml-2">Sair</span>
              )}
              {isCollapsed && (
                <span className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Sair
                </span>
              )}
            </Button>
          </div>
        </nav>
      </aside>
    </>
  )
}