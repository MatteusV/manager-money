'use client'

import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import {
  getPushSubscription,
  registerServiceWorker,
  subscribeUser,
} from '@/utils/pushNotifications'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function NotificationButtonMobile() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    async function initPush() {
      const reg = await registerServiceWorker()
      if (reg) {
        setRegistration(reg)
        const sub = await getPushSubscription(reg)
        if (sub) {
          setIsSubscribed(true)
        }
      }
    }
    initPush()
  }, [])

  async function handleSubscribe() {
    if (!registration) return
    const subscription = await subscribeUser(registration)
    if (subscription) {
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })
        setIsSubscribed(true)
        toast('Inscrição realizada!', {
          description: 'Você receberá notificações push.',
        })
      } catch (error) {
        console.error('Erro ao enviar inscrição para o backend:', error)
        toast('Erro', {
          description: 'Não foi possível inscrever para notificações.',
        })
      }
    }
  }

  if (registration && isSubscribed && Notification.permission === 'granted') {
    return null
  }

  return (
    <Button
      onClick={handleSubscribe}
      variant="outline"
      size={'icon'}
      className="md:hidden"
    >
      <Bell className="size-5" />
    </Button>
  )
}
