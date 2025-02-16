'use server'
import webPush from 'web-push'
import { prisma } from '@/lib/prisma'
import { getUserToken } from './getUserToken'
import { getStartAndEndOfWeek } from '@/utils/getStartAndEndOfWeek'

webPush.setVapidDetails(
  'mailto:varlesse04@gmail.com', // Corrigido para "mailto:"
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!,
)

export async function sendWeeklyNotifications() {
  try {
    const subscriptions = await prisma.pushSubscription.findMany()
    const weeklySpending = await getWeeklySpending()

    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }

      const payload = JSON.stringify({
        title: 'Resumo Semanal de Gastos',
        body: `Você gastou R$${weeklySpending} esta semana.`,
        icon: '/icon.png',
      })

      try {
        await webPush.sendNotification(pushSubscription, payload)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.warn(
            `Inscrição inválida/expirada. Removendo: ${sub.endpoint}`,
          )
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          })
        } else {
          console.error('Erro ao enviar notificação:', error)
        }
      }
    }

    return { success: true, message: 'Notificações enviadas com sucesso!' }
  } catch (error) {
    console.error('Erro ao enviar notificações:', error)
    return { success: false, message: 'Falha ao enviar notificações' }
  }
}

async function getWeeklySpending(): Promise<number> {
  const { tokenDecoded } = await getUserToken()
  if (!tokenDecoded) {
    throw new Error('Token inválido')
  }

  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek()

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: tokenDecoded.id,
      type: 'EXPENSE',
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
  })

  const totalSpending = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )

  return totalSpending
}
