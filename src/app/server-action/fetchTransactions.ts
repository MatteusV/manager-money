'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTransaction({ userId }: { userId: string }) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
  })
  await prisma.$disconnect()

  return { transactions }
}
