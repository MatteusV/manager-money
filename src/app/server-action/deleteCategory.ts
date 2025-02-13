'use server'

import { prisma } from '@/lib/prisma'

export async function deleteCategory({ id }: { id: string }) {
  await prisma.category.delete({
    where: {
      id,
    },
  })
}
