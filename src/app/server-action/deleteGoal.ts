'use server'

import { prisma } from '@/lib/prisma'

export async function deleteGoal({ id }: { id: string }) {
  try {
    await prisma.$transaction([
      prisma.goal.delete({
        where: {
          id,
        },
      }),
      prisma.transaction.deleteMany({
        where: {
          goalId: id,
        },
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
