import { Suspense } from 'react'
import { fetchTransaction } from '../../server-action/fetchTransactions'
import { FinanceControlClient } from '@/app/(private)/(home)/components/financeControl'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import { fetchCategory } from '@/app/server-action/fetchCategory'
import { Fallback } from '../../../components/fallback'
import { fetchGoals } from '@/app/server-action/fetchGoals'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const [transactionsResult, categoriesResult, goalsResult] = await Promise.all(
    [
      fetchTransaction({ userId: tokenDecoded.id }),
      fetchCategory({ userId: tokenDecoded.id }),
      fetchGoals({ userId: tokenDecoded.id }),
    ],
  )

  const { transactions } = transactionsResult
  const { categories } = categoriesResult
  const { goals } = goalsResult

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
