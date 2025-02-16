'use client'
import { savePushSubscription } from '@/app/server-action/registerPushSubscription'
import { useEffect } from 'react'

export function NotificationSetup() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          navigator.serviceWorker.ready.then(async (registration) => {
            try {
              const subscription =
                await registration.pushManager.getSubscription()
              if (!subscription) {
                const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                const convertedPublicKey = urlBase64ToUint8Array(publicKey)

                const newSubscription =
                  await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedPublicKey,
                  })

                const newSubscriptionJson = newSubscription.toJSON()
                const result = await savePushSubscription({
                  subscription: newSubscriptionJson,
                })

                if (!result.success) {
                  console.error('Falha ao inscrever o usuário:', result.error)
                }
              } else {
                console.log('Usuário já inscrito para notificações.')
              }
            } catch (error) {
              console.error('Erro ao inscrever o usuário:', error)
            }
          })
        }
      })
    } else {
      console.warn(
        'Service Workers ou PushManager não são suportados neste navegador.',
      )
    }
  }, [])

  return null
}

// Função para converter a chave pública
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
