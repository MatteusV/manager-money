import { Suspense } from 'react'
import { fetchTransaction } from '../../server-action/fetchTransactions'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import PerformanceControlClient from './components/peformanceControlClient'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { transactions } = await fetchTransaction({ userId: tokenDecoded.id })
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PerformanceControlClient transactions={transactions} />
    </Suspense>
  )
}
