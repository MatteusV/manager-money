'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function newTransaction(
  data: Prisma.TransactionUncheckedCreateInput,
) {
  const userExists = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  })

  if (!userExists) {
    return { error: 'Usuário não foi encontrado' }
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      date: data.date,
      userId: data.userId,
      categoryId: data.categoryId ? data.categoryId : null,
      goalId: data.goalId ? data.goalId : null,
    },
    include: {
      category: true,
      goal: !!data.goalId,
    },
  })

  if (data.goalId) {
    await updateGoalSavedAmount(data.goalId, data.amount, data.type)
  }

  await prisma.$disconnect()
  return { transaction }
}

async function updateGoalSavedAmount(
  goalId: string,
  amount: number,
  type: 'INCOME' | 'EXPENSE',
) {
  const operation =
    type === 'INCOME' ? { increment: amount } : { decrement: amount }

  await prisma.goal.update({
    where: { id: goalId },
    data: { savedAmount: operation },
  })

  await prisma.$disconnect()
}
