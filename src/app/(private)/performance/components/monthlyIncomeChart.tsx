import type React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/@types/transactions-with-category'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type MonthlyIncomeChartProps = {
  transactions: Transaction[]
}

export const MonthlyIncomeChart: React.FC<MonthlyIncomeChartProps> = ({
  transactions,
}) => {
  const calculateMonthlyIncome = () => {
    const monthlyIncome: { [key: string]: number } = {}

    const dates = transactions.map((t) => t.date)
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    eachMonthOfInterval({
      start: startOfMonth(minDate),
      end: endOfMonth(maxDate),
    }).forEach((date) => {
      const monthKey = format(date, 'yyyy-MM')
      monthlyIncome[monthKey] = 0
    })

    transactions
      .filter((t) => t.type === 'INCOME')
      .forEach((transaction) => {
        const date = transaction.date
        const monthKey = format(date, 'yyyy-MM')
        monthlyIncome[monthKey] =
          (monthlyIncome[monthKey] || 0) + transaction.amount
      })

    return monthlyIncome
  }

  const monthlyIncome = calculateMonthlyIncome()
  const labels = Object.keys(monthlyIncome).sort()
  const data = labels.map((label) => monthlyIncome[label])

  const chartData = {
    labels: labels.map((label) =>
      format(parseISO(`${label}-01`), 'MMM yyyy', { locale: ptBR }),
    ),
    datasets: [
      {
        label: 'Receita Mensal',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Receita Mensal',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => {
            const numericValue =
              typeof tickValue === 'number' ? tickValue : Number(tickValue)
            return `R$ ${numericValue.toFixed(2)}`
          },
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
