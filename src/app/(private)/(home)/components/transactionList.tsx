import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '../app/(private)/(home)/components/financeControl'

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-96 px-5">
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
                      className="py-2 flex justify-between"
                    >
                      <span>{transaction.description}</span>
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
