'use server'

import { prisma } from '@/lib/prisma'

export async function deleteGoal({ id }: { id: string }) {
  try {
    await prisma.goal.delete({
      where: {
        id,
      },
    })

    return { success: true }
  } catch (error) {
    console.log('Erro ao deletar a meta', error)
    if (error) {
      return { error }
    }
  }
}
