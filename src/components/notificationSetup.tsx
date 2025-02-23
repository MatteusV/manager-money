'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function PushNotificationManager() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('Service Worker registrado:', reg)
          setRegistration(reg)

          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              console.log('Usuário já inscrito:', sub)
              setIsSubscribed(true)
              setShowModal(false)
            }
          })
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
        setShowModal(false)
        toast('Inscrição realizada!', {
          description: 'Você receberá notificações push.',
        })
      } catch (err) {
        console.error('Falha na inscrição:', err)
        toast('Erro', {
          description: 'Não foi possível inscrever para notificações.',
        })
      }
    } else {
      // Se o usuário negar a permissão, ocultamos o modal
      setShowModal(false)
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

  if (showModal && !isSubscribed && registration) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Ativar Notificações</h2>
          <p className="mb-6">
            Para ficar por dentro das atualizações, ative as notificações push.
          </p>
          <button
            onClick={handleSubscribe}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ativar
          </button>
        </div>
      </div>
    )
  }

  return null
}
