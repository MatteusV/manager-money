'use server'

import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

interface AuthenticateProps {
  email: string
  password: string
}

export async function authenticate(data: AuthenticateProps) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    }
  })

  if(!user) {
    return {error: 'Email ou senha errados.'}
  }

  const passwordHash = await compare(data.password, user.password)

  if(!passwordHash) {
    return {error: 'Email ou senha errados.'}
  }

  const cookiesStore = await cookies()

  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))

    cookiesStore.set('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7D
      httpOnly: true,
      path: '/'
    })

  return { user }
} 