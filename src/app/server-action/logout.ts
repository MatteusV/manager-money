'use server'

import { cookies } from 'next/headers'

export async function logout() {
  const cookiesStore = await cookies()

  cookiesStore.delete('token')
}
