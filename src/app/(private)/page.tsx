import { Suspense } from 'react'
import { fetchTransaction } from "../server-action/fetchTransactions"
import { FinanceControlClient } from '@/components/financeControl'
import { getUserToken } from '../server-action/getUserToken'

export default async function Page() {
  const { tokenDecoded } = await getUserToken()
  const { transactions } = await fetchTransaction({ userId: tokenDecoded?.id! })

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FinanceControlClient initialTransactions={transactions} userId={tokenDecoded?.id!} />
    </Suspense>
  )
}