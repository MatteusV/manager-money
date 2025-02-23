'use server'

import { prisma } from '@/lib/prisma'

export async function deleteTransaction({ id }: { id: string }) {
  try {
    await prisma.transaction.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    if (error) {
      return { error }
    }
  }
}
