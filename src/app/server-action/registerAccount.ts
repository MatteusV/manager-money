'use server'

import { prisma } from '@/lib/prisma'
import { signJwt } from '@/utils/signJwt'
import { hash } from 'bcryptjs'
import { cookies } from 'next/headers'

interface RegisterAccountProps {
  email: string
  name: string
  password: string
}

export async function registerAccount(data: RegisterAccountProps) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: data.email.toLocaleLowerCase(),
    },
  })

  if (userAlreadyExists) {
    return { error: 'Email já foi utilizado' }
  }

  const passwordHash = await hash(data.password, 6)

  const user = await prisma.user.create({
    data: {
      email: data.email.toLocaleLowerCase(),
      password: passwordHash,
      name: data.name,
    },
  })

  const { token } = await signJwt({ email: user.email, id: user.id })

  const cookiesStore = await cookies()

  cookiesStore.set('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7D
    httpOnly: true,
    path: '/',
  })

  return { user, token }
}
