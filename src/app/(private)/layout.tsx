import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { PushNotificationManager } from '@/components/notificationSetup'

export const metadata: Metadata = {
  title: 'Manager Money',
  description: 'Um site para te ajudar a controlar as finanças',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="antialiased text-base">
      <PushNotificationManager />
      <Header />
      {children}
    </div>
  )
}
