import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { RegisterServiceWorker } from '@/components/registerServiceWorker'

export const metadata: Metadata = {
  title: 'Manager Money',
  description: 'Um site para controlar as finanças',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased text-base">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <RegisterServiceWorker />
          <Toaster theme="system" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
