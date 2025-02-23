'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function PushNotificationManager() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('Service Worker registrado:', reg)
          setRegistration(reg)
        })
        .catch((err) =>
          console.error('Falha ao registrar o Service Worker:', err),
        )
    }
  }, [])

  async function handleSubscribe() {
    if (!registration) return
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Permissão para notificações concedida.')
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          ),
        })
        console.log('Usuário inscrito:', subscription)
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })
        setIsSubscribed(true)
        toast('Inscrição realizada!', {
          description: 'Você receberá notificações do sistema.',
        })
      } catch (err) {
        console.error('Falha na inscrição:', err)
        toast('Erro', {
          description: 'Não foi possível inscrever para notificações.',
        })
      }
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  useEffect(() => {
    if (!isSubscribed && registration) {
      toast('Ativar Notificações', {
        description: 'Clique para ativar notificações push',
        duration: Infinity,
        closeButton: true,
        action: {
          label: 'Ativar',
          onClick: () => handleSubscribe(),
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribed, registration])

  return null
}
