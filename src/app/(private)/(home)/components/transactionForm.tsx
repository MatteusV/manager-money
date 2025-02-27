import { PlusCircle, MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TransactionFormProps {
  description: string
  amount: string
  categories: { name: string; id: string }[]
  goals: { name: string; id: string }[]
  onDescriptionChange: (value: string) => void
  onAmountChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onGoalChange: (value: string) => void
  onAddTransaction: (type: 'income' | 'expense') => void
}

export function TransactionForm({
  description,
  amount,
  categories,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onAddTransaction,
  goals,
  onGoalChange,
}: TransactionFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Adicionar Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>
        <div className="flex justify-between max-md:flex-col gap-2 mb-4 mt-4">
          {categories.length > 0 && (
            <Select onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full flex-1">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {goals.length > 0 && (
            <Select onValueChange={onGoalChange}>
              <SelectTrigger className="w-full flex-1">
                <SelectValue placeholder="Selecione a meta" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onAddTransaction('income')} className="flex-1">
            <PlusCircle className="mr-2 h-4 w-4" /> Entrada
          </Button>
          <Button
            onClick={() => onAddTransaction('expense')}
            variant="destructive"
            className="flex-1"
          >
            <MinusCircle className="mr-2 h-4 w-4" /> Saída
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
