'use client'

import { deleteTransaction } from '@/app/server-action/deleteTransaction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Dayjs from 'dayjs'
import type { Transaction } from '@prisma/client'
import { toast } from 'sonner'

interface TransactionsListProps {
  transactionsByMonth: Record<
    string,
    { transactions: Transaction[]; balance: number }
  >
  currentMonth: string
}

export function TransactionsList({
  transactionsByMonth,
  currentMonth,
}: TransactionsListProps) {
  const router = useRouter()

  async function handleDeleteTransaction(transactionId: string) {
    const result = await deleteTransaction({ id: transactionId })
    if (result && result.error) {
      toast.error('Erro ao deletar a transação')
    } else {
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <ul className="divide-y divide-gray-200 overflow-y-auto dark:divide-gray-700 h-96 px-5">
          {Object.entries(transactionsByMonth).map(
            ([month, { transactions, balance }]) => (
              <div key={month} className="mb-4">
                <h2 className="text-xl font-bold mt-4 mb-2">{month}</h2>

                {month !== currentMonth && (
                  <p
                    className={`font-bold ${
                      balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    Saldo Final: R$ {balance.toFixed(2)}
                  </p>
                )}

                {[...transactions]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((transaction) => (
                    <li
                      key={transaction.id}
                      className="py-2 flex justify-between overflow-y-auto"
                    >
                      <div className="space-x-2">
                        <Button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          variant={'link'}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {transaction.description}
                            </TooltipTrigger>
                            <TooltipContent className="bg-background text-foreground p-2 border border-foreground rounded-xl">
                              <p>
                                {Dayjs(transaction.date).format('DD/MM/YYYY')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span
                        className={
                          transaction.type === 'INCOME'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'} R${' '}
                        {transaction.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
              </div>
            ),
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
