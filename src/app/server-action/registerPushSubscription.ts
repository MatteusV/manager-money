'use server'

import { prisma } from '@/lib/prisma'
import { getUserToken } from './getUserToken'

interface SavePushSubscriptionProps {
  subscription: PushSubscriptionJSON
}

export async function savePushSubscription({
  subscription,
}: SavePushSubscriptionProps) {
  if (
    !subscription.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return { error: 'Invalid subscription' }
  }

  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    return { error: 'Token invalido!' }
  }

  try {
    await prisma.pushSubscription.create({
      data: {
        userId: tokenDecoded.id,
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    })

    return { success: true, message: 'Subscription saved!' }
  } catch (error) {
    console.error('Error saving subscription:', error)
    return {
      success: false,
      message: 'Failed to save subscription',
      errorDetails: (error as Error).message,
    }
  }
}
