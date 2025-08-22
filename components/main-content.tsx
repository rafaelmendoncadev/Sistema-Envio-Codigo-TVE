'use client'

import { useSidebarContext } from '../contexts/sidebar-context'

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarContext()
  
  return (
    <main className={`transition-all duration-300 ease-in-out ${
      isCollapsed ? 'md:ml-16' : 'md:ml-64'
    }`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </div>
    </main>
  )
}