'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  registerServiceWorker,
  getPushSubscription,
  subscribeUser,
} from '@/utils/pushNotifications'

export function PushNotificationManager() {
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

  useEffect(() => {
    if (
      !isSubscribed &&
      registration &&
      Notification.permission !== 'granted'
    ) {
      toast('Ativar Notificações', {
        description: 'Clique para ativar notificações push',
        duration: Infinity,
        action: {
          label: 'Ativar',
          onClick: () => handleSubscribe(),
        },
        position: 'top-right',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribed, registration])

  return null
}
