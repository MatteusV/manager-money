'use client'

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Goal } from '@prisma/client'
import { DialogUpdateGoal } from './dialogUpdateGoal'
import { DialogDeleteGoal } from './dialogDeleteGoal'
import { TrendingUp } from 'lucide-react'

interface TableGoalsProps {
  goals: Goal[]
  updateGoal: (data: {
    goalId: string
    name?: string
    targetAmount?: number
  }) => void
  deleteGoal: (goalId: string) => void
}

export function TableGoals({ goals, updateGoal, deleteGoal }: TableGoalsProps) {
  return (
    <>
      {/* Desktop Table */}
      <Table className="max-md:hidden">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Meta</TableHead>
            <TableHead>Valor acumulado</TableHead>
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
                <TableCell>{progress.toFixed(1)}%</TableCell>
                <TableCell className="flex gap-2">
                  <DialogUpdateGoal
                    goal={goal}
                    updateGoal={updateGoal}
                    key={`update-${goal.id}`}
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

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {goals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100
          const progressColor =
            progress < 30
              ? 'bg-rose-500'
              : progress < 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'

          return (
            <Card key={goal.id} className="overflow-hidden border-0 shadow-lg">
              <div className={`h-2 w-full ${progressColor}`} />
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {goal.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-muted/30 p-3">
                      <div className="text-xs font-medium text-muted-foreground">
                        Meta
                      </div>
                      <div className="mt-1 text-lg font-bold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(goal.targetAmount)}
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3">
                      <div className="text-xs font-medium text-muted-foreground">
                        Acumulado
                      </div>
                      <div className="mt-1 text-lg font-bold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(goal.savedAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm font-bold">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2.5" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <DialogUpdateGoal
                      goal={goal}
                      updateGoal={updateGoal}
                      key={`mobile-update-${goal.id}`}
                    />
                    <DialogDeleteGoal
                      goalId={goal.id}
                      handleDeleteGoal={deleteGoal}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
