'use client'

import { useState } from 'react'
import type { Category, Prisma } from '@prisma/client'
import { TransactionForm } from './transactionForm'
import { CurrentBalance } from './currentBalance'
import { newTransaction } from '@/app/server-action/newTransaction'
import { toast } from '@/hooks/use-toast'
import { TransactionsList } from './transactionList'
import type { Transaction } from '@/@types/transactions-with-category'

interface FinanceControlClientProps {
  initialTransactions: Transaction[]
  userId: string
  initialCategories: Category[]
}

export function FinanceControlClient({
  initialTransactions,
  userId,
  initialCategories,
}: FinanceControlClientProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const currentMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const transactionsByMonth = transactions.reduce(
    (acc, transaction) => {
      const month = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(transaction.date))

      if (!acc[month]) {
        acc[month] = {
          transactions: [],
          balance: 0,
        }
      }

      acc[month].transactions.push(transaction)
      acc[month].balance +=
        transaction.type === 'INCOME' ? transaction.amount : -transaction.amount

      return acc
    },
    {} as Record<string, { transactions: Transaction[]; balance: number }>,
  )

  const currentBalance = transactionsByMonth[currentMonth]?.balance || 0

  async function addTransaction(type: 'income' | 'expense') {
    if (description && amount) {
      const transaction: Prisma.TransactionUncheckedCreateInput = {
        date: new Date(),
        description,
        amount: Number.parseFloat(amount),
        type: type === 'income' ? 'INCOME' : 'EXPENSE',
        categoryId,
        userId,
      }

      const { transaction: transactionDb, error } =
        await newTransaction(transaction)

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

  const categories = initialCategories.map((c) => ({ id: c.id, name: c.name }))
  return (
    <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Controle Financeiro</h1>
      </div>

      <TransactionForm
        description={description}
        amount={amount}
        categories={categories}
        onCategoryChange={setCategoryId}
        onDescriptionChange={setDescription}
        onAmountChange={setAmount}
        onAddTransaction={addTransaction}
      />

      <CurrentBalance balance={currentBalance} />

      <TransactionsList
        transactionsByMonth={transactionsByMonth}
        currentMonth={currentMonth}
      />
    </div>
  )
}
