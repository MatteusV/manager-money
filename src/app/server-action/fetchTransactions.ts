'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTransaction({ userId }: { userId: string }) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
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
  })

  return { transactions }
}
