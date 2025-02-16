import { Suspense } from 'react'
import { fetchTransaction } from '../../server-action/fetchTransactions'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import PerformanceControlClient from './components/peformanceControlClient'
import { Fallback } from '../(home)/components/fallback'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { transactions } = await fetchTransaction({ userId: tokenDecoded.id })
  return (
    <Suspense fallback={<Fallback />}>
      <PerformanceControlClient transactions={transactions} />
    </Suspense>
  )
}
