'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTransaction({ userId }: { userId: string }) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    cacheStrategy: {
      tags: ['transactions'],
      ttl: 60 * 60 * 60 * 1, // 1 hour
    },
  })

  return { transactions }
}
