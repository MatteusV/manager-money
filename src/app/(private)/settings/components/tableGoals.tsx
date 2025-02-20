'use client'

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import type { Goal } from '@prisma/client'
import { DialogUpdateGoal } from './dialogUpdateGoal'
import { DialogDeleteGoal } from './dialogDeleteGoal'

interface TableCategoriesProps {
  goals: Goal[]
  updateGoal: (data: {
    goalId: string
    name?: string
    targetAmount?: number
  }) => void
  deleteGoal: (goalId: string) => void
}
export function TableGoals({
  goals,
  updateGoal,
  deleteGoal,
}: TableCategoriesProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Meta</TableHead>
          <TableHead>Valor acomulado</TableHead>
          <TableHead>Progresso</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-auto">
        {goals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100

          return (
            <TableRow key={goal.id}>
              <TableCell>{goal.name}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(goal.targetAmount)}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(goal.savedAmount)}
              </TableCell>
              <TableCell>{progress}%</TableCell>

              <TableCell>
                <DialogUpdateGoal
                  goal={goal}
                  updateGoal={updateGoal}
                  key={goal.id}
                />

                <DialogDeleteGoal
                  goalId={goal.id}
                  handleDeleteGoal={deleteGoal}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
