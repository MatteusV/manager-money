/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/@types/transactions-with-category'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

type CashFlowChartProps = {
  transactions: Transaction[]
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  transactions,
}) => {
  const calculateDailyBalances = () => {
    if (transactions.length === 0) {
      return {
        labels: [],
        balances: [],
        incomes: [],
        expenses: [],
      }
    }

    const dailyBalances: { [key: string]: number } = {}
    const dailyIncomes: { [key: string]: number } = {}
    const dailyExpenses: { [key: string]: number } = {}
    let runningBalance = 0

    const dates = transactions.map((t) => t.date)
    const minDate = startOfDay(
      new Date(Math.min(...dates.map((d) => d.getTime()))),
    )
    const maxDate = endOfDay(
      new Date(Math.max(...dates.map((d) => d.getTime()))),
    )

    const allDays = eachDayOfInterval({ start: minDate, end: maxDate })

    // Inicializa receitas e despesas diárias como 0
    allDays.forEach((date) => {
      const dateKey = format(date, 'yyyy-MM-dd')
      dailyIncomes[dateKey] = 0
      dailyExpenses[dateKey] = 0
    })

    // Ordena as transações por data
    transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Processa as transações e atualiza receitas, despesas e saldo
    allDays.forEach((date) => {
      const dateKey = format(date, 'yyyy-MM-dd')

      const transactionsForDate = transactions.filter(
        (transaction) => format(transaction.date, 'yyyy-MM-dd') === dateKey,
      )

      transactionsForDate.forEach((transaction) => {
        const amount = transaction.amount

        if (transaction.type === 'INCOME') {
          runningBalance += amount
          dailyIncomes[dateKey] += amount
        }

        if (transaction.type === 'EXPENSE') {
          runningBalance -= amount
          dailyExpenses[dateKey] += amount
        }
      })

      dailyBalances[dateKey] = runningBalance // Atualiza saldo após processar todas as transações do dia
    })

    const labels = Object.keys(dailyBalances).sort()
    const balances = labels.map((label) => dailyBalances[label])
    const incomes = labels.map((label) => dailyIncomes[label])
    const expenses = labels.map((label) => dailyExpenses[label])

    return { labels, balances, incomes, expenses }
  }

  const { labels, balances, incomes, expenses } = calculateDailyBalances()

  const chartData = {
    labels: labels.map((label) =>
      format(parseISO(label), 'dd/MM', { locale: ptBR }),
    ),
    datasets: [
      {
        label: 'Saldo',
        data: balances,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Entradas',
        data: incomes,
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Saídas',
        data: expenses,
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
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
        text: 'Fluxo de Caixa',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Valor (R$)',
        },
        ticks: {
          callback: function (tickValue: any) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(tickValue)) // ✅ Converte para número
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  }

  return (
    <div className="w-full h-max">
      <Line data={chartData} options={options} />
    </div>
  )
}
