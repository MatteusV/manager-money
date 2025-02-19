import { Suspense } from 'react'
import { fetchTransaction } from '../../server-action/fetchTransactions'
import { FinanceControlClient } from '@/app/(private)/(home)/components/financeControl'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import { fetchCategory } from '@/app/server-action/fetchCategory'
import { Fallback } from './components/fallback'
import { fetchGoals } from '@/app/server-action/fetchGoals'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { transactions } = await fetchTransaction({ userId: tokenDecoded.id })
  const { categories } = await fetchCategory({ userId: tokenDecoded.id })
  const { goals } = await fetchGoals({ userId: tokenDecoded.id })

  return (
    <Suspense fallback={<Fallback />}>
      <FinanceControlClient
        initialCategories={categories}
        initialGoals={goals}
        initialTransactions={transactions}
        userId={tokenDecoded.id}
      />
    </Suspense>
  )
}
