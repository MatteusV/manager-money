import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import webpush from 'web-push'
import type { Alert } from '@/@types/alert'
import type { PushSubscription, User } from '@prisma/client'

interface UserWithPushSubscription extends User {
  PushSubscription: PushSubscription[]
}

webpush.setVapidDetails(
  'mailto:seu-email@exemplo.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

async function getUserData(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: { not: null },
    },
    include: { category: true },
  })

  const spentByCategory: Record<string, number> = {}
  const categoryBudgets: Record<string, number> = {}

  for (const t of transactions) {
    const categoryName = t.category!.name
    spentByCategory[categoryName] =
      (spentByCategory[categoryName] || 0) + t.amount
    if (!categoryBudgets[categoryName]) {
      categoryBudgets[categoryName] = t.category!.budget
    }
  }

  return { spentByCategory, categoryBudgets }
}

function generateNotificationPayload(alerts: Alert[]): string {
  return JSON.stringify({
    title: 'Resumo Semanal de Alertas Financeiros',
    body: alerts
      .map((alert) => `${alert.category}: ${alert.message}`)
      .join('\n'),
  })
}

async function processUserNotifications(user: UserWithPushSubscription) {
  try {
    const { spentByCategory, categoryBudgets } = await getUserData(user.id)
    const alerts: Alert[] = []

    for (const category in spentByCategory) {
      const totalSpent = spentByCategory[category]
      const budgetLimit = categoryBudgets[category]

      if (budgetLimit > 0 && (totalSpent / budgetLimit) * 100 >= 80) {
        alerts.push({
          category,
          message: `Você atingiu ${((totalSpent / budgetLimit) * 100).toFixed(0)}% do orçamento para ${category}.`,
          recommendation: `Considere reduzir os gastos em ${category} ou rever seu orçamento.`,
        })
      }
    }

    if (alerts.length > 0 && user.PushSubscription.length > 0) {
      const payload = generateNotificationPayload(alerts)

      await Promise.all(
        user.PushSubscription.map(async (subscription: PushSubscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: { p256dh: subscription.p256dh, auth: subscription.auth },
              },
              payload,
            )
          } catch (error) {
            console.error(
              `Erro ao enviar push notification para ${user.email}:`,
              error,
            )
          }
        }),
      )
    }
  } catch (error) {
    console.error(`Erro ao processar notificações para ${user.email}:`, error)
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { PushSubscription: true },
    })

    // Executa todas as notificações em paralelo
    await Promise.all(users.map((user) => processUserNotifications(user)))

    return NextResponse.json({
      message: 'Notificações semanais enviadas com sucesso',
    })
  } catch (error) {
    console.error('Erro ao processar notificações:', error)
    return NextResponse.json(
      { message: 'Erro ao processar notificações' },
      { status: 500 },
    )
  }
}
