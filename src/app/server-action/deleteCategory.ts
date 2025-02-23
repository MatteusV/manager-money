'use server'

import { prisma } from '@/lib/prisma'

interface DeleteCategoryProps {
  id: string
  tranferTo: string | null
}

export async function deleteCategory({ id, tranferTo }: DeleteCategoryProps) {
  if (tranferTo) {
    await prisma.transaction.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: tranferTo,
      },
    })
  }

  await prisma.category.delete({
    where: {
      id,
    },
  })
}
