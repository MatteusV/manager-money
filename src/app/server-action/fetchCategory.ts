'use server'

import { prisma } from '@/lib/prisma'

interface FetchCategoryProps {
  userId: string
}

export async function fetchCategory({ userId }: FetchCategoryProps) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  })

  await prisma.$disconnect()

  return { categories }
}
