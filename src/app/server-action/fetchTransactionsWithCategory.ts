'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTransactionsWithCategory({
  userId,
}: {
  userId: string
}) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: {
        not: null,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    cacheStrategy: {
      tags: ['transactionsWithCategory'],
      ttl: 60 * 60 * 60 * 1, // 1 hour
    },
  })

  return { transactions }
}
