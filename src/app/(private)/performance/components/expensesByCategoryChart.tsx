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
  const expensesByCategory = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce(
      (acc, t) => {
        const category = t.category.name || 'Outros'
        acc[category] = (acc[category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Despesas por Categoria',
      },
    },
  }

  return <Pie data={data} options={options} />
}
