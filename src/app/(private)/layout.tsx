import type { Metadata } from 'next'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Manager Money',
  description: 'Um site para te ajudar a controlar as finanças',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/init-cron`, {
    next: {
      tags: ['init-cron'],
      revalidate: 60 * 60 * 1, // 1 hour
    },
    cache: 'force-cache',
  }).catch((error) => {
    console.error('Erro ao iniciar cron job:', error)
  })

  return (
    <div className="antialiased text-base">
      <Header />
      {children}
    </div>
  )
}
