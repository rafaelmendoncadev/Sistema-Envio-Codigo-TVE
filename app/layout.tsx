
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '../components/theme-provider'
import { Sidebar } from '../components/sidebar'
import { MainContent } from '../components/main-content'
import { SidebarProvider } from '../contexts/sidebar-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Códigos de Recarga',
  description: 'Sistema web para extração e gerenciamento de códigos de recarga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
            <Toaster position="top-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
