'use server'

import { prisma } from '@/lib/prisma'

export async function fetchGoals({ userId }: { userId: string }) {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
    },
  })

  return { goals: goals || [] }
}
