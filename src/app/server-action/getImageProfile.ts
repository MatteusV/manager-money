'use server'

import { prisma } from '@/lib/prisma'

export async function getImageProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      imageUrl: true,
    },
  })

  return { imageUrl: user?.imageUrl }
}
