'use server'

import { prisma } from '@/lib/prisma'

export async function deleteTransaction({ id }: { id: string }) {
  try {
    await Promise.all([
      prisma.transaction.delete({
        where: {
          id,
        },
      }),
      prisma.$accelerate.invalidate({
        tags: ['transactions', 'goals'],
      }),
    ])
  } catch (error) {
    if (error) {
      return { error }
    }
  }
}
