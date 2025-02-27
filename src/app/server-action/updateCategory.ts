'use server'

import { prisma } from '@/lib/prisma'
import type { $Enums } from '@prisma/client'

interface UpdateCategoryProps {
  categoryId: string
  data: { name?: string; type?: $Enums.TransactionType; budget?: number }
}

export async function updateCategory({
  categoryId,
  data,
}: UpdateCategoryProps) {
  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: data.name,
      type: data.type,
      budget: data.budget,
    },
  })

  await prisma.$disconnect()
}
