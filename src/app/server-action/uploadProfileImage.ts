// app/actions/uploadProfileImage.ts
'use server'

import { prisma } from '@/lib/prisma'
import { put, del } from '@vercel/blob'
import sharp from 'sharp'
import { getUserToken } from './getUserToken'

export async function uploadProfileImage(data: FormData) {
  const file = data.get('profileImage') as File
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    throw new Error('Usuário não autenticado')
  }

  if (!file) {
    throw new Error('Nenhum arquivo encontrado')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: tokenDecoded.id,
    },
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  if (user.imageUrl) {
    await del(user.imageUrl)
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const optimezImageBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
      })
      .jpeg({ quality: 70 })
      .toBuffer()

    const path = `profile-images/${file.name}`

    const blob = await put(path, optimezImageBuffer, {
      access: 'public',
    })

    await prisma.user.update({
      where: {
        id: tokenDecoded.id,
      },
      data: {
        imageUrl: blob.url,
        imagePath: blob.pathname,
      },
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error)
    throw new Error('Erro ao enviar a imagem para o servidor')
  } finally {
    await prisma.$disconnect()
  }
}
