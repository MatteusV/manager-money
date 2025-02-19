import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Goal } from '@prisma/client'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

interface DialogUpdateGoalProps {
  goal: Goal
  updateGoal: (data: {
    goalId: string
    name?: string
    targetAmount?: number
  }) => void
}

export function DialogUpdateGoal({ updateGoal, goal }: DialogUpdateGoalProps) {
  const [newGoalName, setNewGoalName] = useState<string | null>(null)
  const [newGoalTargetAmount, setNewGoalTargetAmount] = useState<number | null>(
    null,
  )
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              defaultValue={goal.name}
              onChange={(e) => setNewGoalName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Valor da meta
            </Label>
            <Input
              id="targetAmount"
              defaultValue={goal.targetAmount}
              onChange={(e) => setNewGoalTargetAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogClose asChild>
          <Button
            onClick={() =>
              updateGoal({
                goalId: goal.id,
                name: newGoalName ?? undefined,
                targetAmount: newGoalTargetAmount ?? undefined,
              })
            }
          >
            Salvar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
