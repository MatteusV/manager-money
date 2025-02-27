'use server'

import { prisma } from '@/lib/prisma'

export async function deleteTransaction({ id }: { id: string }) {
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } })

    if (!transaction) {
      return { error: 'Não encontramos nenhuma transação com esse ID' }
    }

    if (transaction.goalId) {
      switch (transaction.type) {
        case 'INCOME':
          await prisma.goal.update({
            where: {
              id: transaction.goalId,
            },
            data: {
              savedAmount: {
                decrement: transaction.amount,
              },
            },
          })
          break

        case 'EXPENSE':
          await prisma.goal.update({
            where: {
              id: transaction.goalId,
            },
            data: {
              savedAmount: {
                increment: transaction.amount,
              },
            },
          })
          break

        default:
          return { error: 'Tipo de transação não suportado' }
      }
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    return { error }
  } finally {
    await prisma.$disconnect()
  }
}
