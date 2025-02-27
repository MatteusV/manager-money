'use server'

import { prisma } from '@/lib/prisma'
import { getUserToken } from './getUserToken'

export async function getImageProfile() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    return { error: 'Token invalid' }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: tokenDecoded.id,
    },
    select: {
      imageUrl: true,
    },
  })
  await prisma.$disconnect()

  return { imageUrl: user?.imageUrl }
}
