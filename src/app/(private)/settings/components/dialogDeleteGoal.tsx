'use client'

import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

import { Trash2 } from 'lucide-react'

interface DialogDeleteGoalProps {
  handleDeleteGoal: (goalId: string) => void
  goalId: string
}

export function DialogDeleteGoal({
  handleDeleteGoal,
  goalId,
}: DialogDeleteGoalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:text-red-600" variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Categoria</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-red-400">
          Tem certeza que deseja excluir essa categoria? Essa ação é
          irreversível.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteGoal(goalId)
              }}
            >
              Excluir
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
