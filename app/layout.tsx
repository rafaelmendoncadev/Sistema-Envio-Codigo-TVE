
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '../components/theme-provider'
import { Navigation } from '../components/navigation'

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
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navigation />
            <main className="container mx-auto max-w-7xl px-4 py-8">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
