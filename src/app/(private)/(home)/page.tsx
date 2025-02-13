import { Suspense } from 'react'
import { fetchTransaction } from '../../server-action/fetchTransactions'
import { FinanceControlClient } from '@/app/(private)/(home)/components/financeControl'
import { getUserToken } from '../../server-action/getUserToken'
import { redirect } from 'next/navigation'
import { fetchCategory } from '@/app/server-action/fetchCategory'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()

  if (!tokenDecoded) {
    redirect('/auth')
  }

  const { transactions } = await fetchTransaction({ userId: tokenDecoded.id })
  const { categories } = await fetchCategory({ userId: tokenDecoded.id })

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FinanceControlClient
        initialCategories={categories}
        initialTransactions={transactions}
        userId={tokenDecoded.id}
      />
    </Suspense>
  )
}
