import { Suspense } from 'react'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import PerformanceControlClient from './components/peformanceControlClient'
import { Fallback } from '../../../components/fallback'
import { fetchTransactionsWithCategory } from '@/app/server-action/fetchTransactionsWithCategory'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { transactions } = await fetchTransactionsWithCategory({
    userId: tokenDecoded.id,
  })
  return (
    <Suspense fallback={<Fallback />}>
      <PerformanceControlClient transactions={transactions} />
    </Suspense>
  )
}
