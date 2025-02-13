import { Suspense } from 'react'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import { SettingsControlClient } from './components/settingsControlClient'
import { fetchCategory } from '@/app/server-action/fetchCategory'

export default async function SettingsPage() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { categories } = await fetchCategory({ userId: tokenDecoded.id })

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SettingsControlClient categories={categories} userId={tokenDecoded.id} />
    </Suspense>
  )
}
