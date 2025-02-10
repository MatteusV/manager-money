'use client'

import { useMemo, useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from '@/hooks/use-toast'
import type { $Enums } from '@prisma/client'
import { newTransaction } from '@/app/server-action/newTransaction'

export interface Transaction {
  description: string
  amount: number
  userId: string
  id: string
  date: Date
  type: $Enums.TransactionType
}

interface FinanceControlClientProps {
  initialTransactions: Transaction[]
  userId: string
}

export function FinanceControlClient({
  initialTransactions,
  userId,
}: FinanceControlClientProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const currentMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const transactionsByMonth = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const month = new Intl.DateTimeFormat('pt-BR', {
          month: 'long',
          year: 'numeric',
        }).format(transaction.date)

        if (!acc[month]) {
          acc[month] = { transactions: [], balance: 0 }
        }

        acc[month].transactions.push(transaction)

        acc[month].balance +=
          transaction.type === 'INCOME'
            ? transaction.amount
            : -transaction.amount

        return acc
      },
      {} as Record<string, { transactions: Transaction[]; balance: number }>,
    )
  }, [transactions])

  const currentBalance = transactionsByMonth[currentMonth]?.balance || 0

  async function addTransaction(type: 'income' | 'expense') {
    if (description && amount) {
      const transaction: Omit<Transaction, 'id' | 'userId'> = {
        date: new Date(),
        description,
        amount: Number.parseFloat(amount),
        type: type === 'income' ? 'INCOME' : 'EXPENSE',
      }

      const { transaction: transactionDb, error } = await newTransaction({
        ...transaction,
        userId: userId!,
      })

      if (error) {
        return toast({
          title: 'Erro ao criar uma nova transação!',
          description: error,
        })
      }

      if (transactionDb) {
        setTransactions([...transactions, transactionDb])
        setDescription('')
        setAmount('')
      }
    }
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Controle Financeiro</h1>
        <ThemeToggle />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-2">
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => addTransaction('income')} className="flex-1">
              <PlusCircle className="mr-2 h-4 w-4" /> Entrada
            </Button>
            <Button
              onClick={() => addTransaction('expense')}
              variant="destructive"
              className="flex-1"
            >
              <MinusCircle className="mr-2 h-4 w-4" /> Saída
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 Card do saldo do mês atual */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            R$ {currentBalance.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(transactionsByMonth).map(
              ([month, { transactions, balance }]) => (
                <div key={month} className="mb-4">
                  <h2 className="text-xl font-bold mt-4 mb-2">{month}</h2>

                  {month !== currentMonth && (
                    <p
                      className={`font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
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
    </div>
  )
}
