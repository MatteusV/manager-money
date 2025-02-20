'use server'

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface CreateNewGoalProps {
  data: Prisma.GoalUncheckedCreateInput
}

export async function createNewGoal({ data }: CreateNewGoalProps) {
  const goal = await prisma.goal.create({
    data,
  })

  if (!goal) {
    return {
      error: 'Failed to create goal',
    }
  }

  prisma.$accelerate.invalidate({
    tags: ['goals'],
  })

  return {
    goal,
  }
}
