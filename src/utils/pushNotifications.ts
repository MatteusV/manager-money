export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service Worker registrado:', reg)
      return reg
    } catch (error) {
      console.error('Falha ao registrar o Service Worker:', error)
      return null
    }
  } else {
    console.error('Service workers ou Push API não são suportados.')
    return null
  }
}

export async function getPushSubscription(
  reg: ServiceWorkerRegistration,
): Promise<PushSubscription | null> {
  try {
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      console.log('Usuário já inscrito:', sub)
      return sub
    }
    return null
  } catch (error) {
    console.error('Erro ao obter a inscrição de push:', error)
    return null
  }
}

export async function subscribeUser(
  reg: ServiceWorkerRegistration,
): Promise<PushSubscription | null> {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.error('Permissão para notificações não foi concedida:', permission)
    return null
  }
  try {
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    })
    console.log('Usuário inscrito:', subscription)
    return subscription
  } catch (error) {
    console.error('Falha ao inscrever o usuário para notificações:', error)
    return null
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
