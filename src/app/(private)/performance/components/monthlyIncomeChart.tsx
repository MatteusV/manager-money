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
  const calculateMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {}

    const dates = transactions.map((t) => t.date)
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    eachMonthOfInterval({
      start: startOfMonth(minDate),
      end: endOfMonth(maxDate),
    }).forEach((date) => {
      const monthKey = format(date, 'yyyy-MM')
      monthlyData[monthKey] = { income: 0, expense: 0 }
    })

    transactions.forEach((transaction) => {
      const date = transaction.date
      const monthKey = format(date, 'yyyy-MM')

      if (transaction.type === 'INCOME') {
        monthlyData[monthKey].income += transaction.amount
      } else {
        monthlyData[monthKey].expense += transaction.amount
      }
    })

    return monthlyData
  }

  const monthlyData = calculateMonthlyData()
  const labels = Object.keys(monthlyData).sort()
  const incomes = labels.map((label) => monthlyData[label].income)
  const expenses = labels.map((label) => monthlyData[label].expense)

  const chartData = {
    labels: labels.map((label) =>
      format(parseISO(`${label}-01`), 'MMM yyyy', { locale: ptBR }),
    ),
    datasets: [
      {
        label: 'Receita Mensal',
        data: incomes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Gastos Mensais',
        data: expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
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
        text: 'Receita e Gastos Mensais',
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
