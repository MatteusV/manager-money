'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Goal } from '@prisma/client'
import { TableGoals } from './tableGoals'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { createNewGoal } from '@/app/server-action/createNewGoal'
import { useRouter } from 'next/navigation'
import { deleteGoal } from '@/app/server-action/deleteGoal'
import { updateGoal } from '@/app/server-action/updateGoal'

interface CardGoalsProps {
  goals: Goal[]
  userId: string
}

export function CardGoals({ goals, userId }: CardGoalsProps) {
  const [nameGoal, setNameGoal] = useState('')
  const [valueGoal, setValueGoal] = useState(0)

  const router = useRouter()

  async function addNewGoal() {
    if (!nameGoal || !valueGoal) {
      toast.error('Preencha os campos corretamente.')
      return
    }

    const { error } = await createNewGoal({
      data: {
        name: nameGoal,
        targetAmount: valueGoal,
        userId,
      },
    })

    if (error) {
      toast.error(error)
      return
    }

    router.refresh()
  }

  async function handleDeleteGoal(goalId: string) {
    await deleteGoal({ id: goalId })

    router.refresh()
  }

  async function handleUpdateGoal(data: {
    goalId: string
    name?: string
    targetAmount?: number
  }) {
    await updateGoal({ data })

    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex max-md:flex-col gap-4 mb-4">
          <div className="flex md:flex-1 gap-4">
            <Input
              onChange={(e) => setNameGoal(e.target.value)}
              placeholder="Nome da meta"
              className="max-md:flex-1"
            />
            <Input
              onChange={(e) => setValueGoal(Number(e.target.value))}
              type="number"
              placeholder="Valor da meta"
              className="max-md:flex-1"
            />
          </div>

          <Button onClick={addNewGoal}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
        <TableGoals
          deleteGoal={handleDeleteGoal}
          updateGoal={handleUpdateGoal}
          goals={goals}
        />
      </CardContent>
    </Card>
  )
}
