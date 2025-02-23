import { getUserToken } from '@/app/server-action/getUserToken'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    return NextResponse.json(
      { message: 'Usuário não autenticado' },
      { status: 401 },
    )
  }

  const { endpoint, keys } = body

  await prisma.pushSubscription.create({
    data: {
      userId: tokenDecoded.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  })

  return NextResponse.json({ success: true })
}
