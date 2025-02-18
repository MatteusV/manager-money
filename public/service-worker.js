// /public/service-worker.js

self.addEventListener('push', (event) => {
  let data
  try {
    data = event.data?.json()
  } catch {
    console.warn('Payload inválido recebido:', event.data?.text())
    data = {
      title: 'Manager Money',
      body: 'Você recebeu uma nova notificação!',
      icon: '/icon.png',
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    }),
  )
})

/* eslint-disable no-undef */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const urlToOpen = '/'

      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})
