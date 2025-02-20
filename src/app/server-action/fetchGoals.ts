'use server'

import { prisma } from '@/lib/prisma'

export async function fetchGoals({ userId }: { userId: string }) {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
    },
    cacheStrategy: {
      tags: ['goals'],
      ttl: 60 * 60 * 5, // 5 minutes
    },
  })

  return { goals: goals || [] }
}
