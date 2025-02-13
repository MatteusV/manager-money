'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CashFlowChart } from './cashFlowChart'
import { ExpensesByCategoryChart } from './expensesByCategoryChart'
import { MonthlyIncomeChart } from './monthlyIncomeChart'
import type { Transaction } from '@/@types/transactions-with-category'

interface PerformanceControlClientProps {
  transactions: Transaction[]
}

export default function PerformanceControlClient({
  transactions,
}: PerformanceControlClientProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Performance Financeira</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="max-md:hidden">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart transactions={transactions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesByCategoryChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyIncomeChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
