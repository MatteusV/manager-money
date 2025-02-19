import { Suspense } from 'react'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import { SettingsControlClient } from './components/settingsControlClient'
import { fetchCategory } from '@/app/server-action/fetchCategory'
import { Fallback } from '../(home)/components/fallback'
import { fetchGoals } from '@/app/server-action/fetchGoals'

export default async function SettingsPage() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { categories } = await fetchCategory({ userId: tokenDecoded.id })
  const { goals } = await fetchGoals({ userId: tokenDecoded.id })

  return (
    <Suspense fallback={<Fallback />}>
      <SettingsControlClient
        goals={goals}
        categories={categories}
        userId={tokenDecoded.id}
      />
    </Suspense>
  )
}
