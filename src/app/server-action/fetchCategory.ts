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
    cacheStrategy: {
      tags: ['categories'],
      ttl: 60 * 60 * 60 * 1, // 1 hour
    },
  })

  return { categories }
}
