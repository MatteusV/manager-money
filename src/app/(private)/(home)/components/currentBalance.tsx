import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CurrentBalanceProps {
  balance: number
}

export function CurrentBalance({ balance }: CurrentBalanceProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Saldo Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-bold ${
            balance >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          R$ {balance.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}
