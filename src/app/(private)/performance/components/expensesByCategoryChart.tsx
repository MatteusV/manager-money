/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Transaction } from '@/@types/transactions-with-category'

ChartJS.register(ArcElement, Tooltip, Legend)

type ExpensesByCategoryChartProps = {
  transactions: Transaction[]
}

export const ExpensesByCategoryChart: React.FC<
  ExpensesByCategoryChartProps
> = ({ transactions }) => {
  // 🔎 Calcula o saldo líquido (despesas - receitas) por categoria
  const expensesByCategory = transactions.reduce(
    (acc, transaction) => {
      const category = transaction.category?.name || 'Outros'
      const amount = transaction.amount

      // Se for uma despesa, adicione; se for receita, subtraia
      acc[category] =
        (acc[category] || 0) +
        (transaction.type === 'EXPENSE' ? amount : -amount)
      return acc
    },
    {} as Record<string, number>,
  )

  // 🔄 Remove categorias com valor ≤ 0 (sem saldo de despesa)
  const filteredCategories = Object.entries(expensesByCategory).filter(
    ([, value]) => value > 0,
  )

  const data = {
    labels: filteredCategories.map(([category]) => category),
    datasets: [
      {
        data: filteredCategories.map(([, value]) => value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const totalExpenses = filteredCategories.reduce(
    (acc, [, value]) => acc + value,
    0,
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Despesas Líquidas por Categoria',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.raw as number
            const percentage = ((value / totalExpenses) * 100).toFixed(2) + '%'
            return `${label}: R$ ${value.toLocaleString('pt-BR')} (${percentage})`
          },
        },
      },
    },
  }

  return <Pie data={data} options={options} />
}
