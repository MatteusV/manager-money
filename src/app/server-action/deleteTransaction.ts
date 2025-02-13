'use server'

import { prisma } from '@/lib/prisma'

export async function deleteTransaction({ id }: { id: string }) {
  await prisma.transaction.delete({
    where: {
      id,
    },
  })
}
