'use server'

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface CreateNewCategory {
  data: Prisma.CategoryUncheckedCreateInput
}

export async function createNewCategory({ data }: CreateNewCategory) {
  const category = await prisma.category.create({
    data,
  })

  return { category }
}
