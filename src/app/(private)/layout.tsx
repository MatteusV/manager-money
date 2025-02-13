import type { Metadata } from 'next'
import { Header } from '@/components/header'

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
    <div className="antialiased text-base">
      <Header />
      {children}
    </div>
  )
}
