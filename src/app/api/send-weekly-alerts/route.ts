import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import webpush from 'web-push'
import type { Alert } from '@/@types/alert'

webpush.setVapidDetails(
  'mailto:seu-email@exemplo.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

async function getUserData(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: {
        not: null,
      },
    },
    include: {
      category: true,
    },
  })

  const spentByCategory = transactions.reduce(
    (acc, t) => {
      const categoryName = t.category!.name
      acc[categoryName] = (acc[categoryName] || 0) + t.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryBudgets = transactions.reduce(
    (acc, t) => {
      const categoryName = t.category!.name
      if (!acc[categoryName]) {
        acc[categoryName] = t.category!.budget
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return { transactions, spentByCategory, categoryBudgets }
}

function generateNotificationPayload(alerts: Alert[]): string {
  const title = 'Resumo Semanal de Alertas Financeiros'
  const body = alerts
    .map((alert) => `${alert.category}: ${alert.message}`)
    .join('\n')
  return JSON.stringify({ title, body })
}

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      PushSubscription: true,
    },
  })
  for (const user of users) {
    const { spentByCategory, categoryBudgets } = await getUserData(user.id)
    const alerts: Alert[] = []

    for (const category in spentByCategory) {
      const totalSpent = spentByCategory[category]
      const budgetLimit = categoryBudgets[category]

      if (budgetLimit > 0) {
        const percentage = (totalSpent / budgetLimit) * 100

        if (percentage >= 80) {
          alerts.push({
            category,
            message: `Você atingiu ${percentage.toFixed(0)}% do orçamento para ${category}.`,
            recommendation: `Considere reduzir os gastos em ${category} ou rever seu orçamento.`,
          })
        }
      }
    }

    if (alerts.length > 0 && user.PushSubscription.length > 0) {
      const payload = generateNotificationPayload(alerts)
      for (const subscription of user.PushSubscription) {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        }
        try {
          await webpush.sendNotification(pushSubscription, payload)
        } catch (error) {
          console.error(
            `Erro ao enviar push notification para ${user.email}:`,
            error,
          )
        }
      }
    }
  }

  return NextResponse.json({
    message: 'Notificações semanais enviadas com sucesso',
  })
}
