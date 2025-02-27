'use server'

import { prisma } from '@/lib/prisma'

interface UpdateGoalProps {
  data: {
    goalId: string
    name?: string
    targetAmount?: number
  }
}

export async function updateGoal({ data }: UpdateGoalProps) {
  await prisma.goal.update({
    where: {
      id: data.goalId,
    },
    data: {
      name: data.name,
      targetAmount: data.targetAmount,
    },
  })

  await prisma.$disconnect()
}
