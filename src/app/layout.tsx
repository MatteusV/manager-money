import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

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
    <html lang="en">
      <body className="antialiased text-base">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster theme="system" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
