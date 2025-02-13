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
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  })

  return { transaction }
}
