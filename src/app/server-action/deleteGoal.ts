'use server'

import { prisma } from '@/lib/prisma'

export async function deleteGoal({ id }: { id: string }) {
  try {
    await Promise.all([
      prisma.goal.delete({
        where: {
          id,
        },
      }),
      prisma.$accelerate.invalidate({
        tags: ['goals'],
      }),
    ])
    return { success: true }
  } catch (error) {
    console.log('Erro ao deletar a meta', error)
    if (error) {
      return { error }
    }
  }
}
