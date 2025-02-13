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
import type { $Enums, Category } from '@prisma/client'

import { Pencil } from 'lucide-react'

interface DialogUpdateCategoryProps {
  category: Category
  setNewCategoryName: (value: string) => void
  setNewCategoryType: (value: $Enums.TransactionType) => void
  handleUpdateCategory: (value: {
    categoryId: string
    data: { name?: string; type?: $Enums.TransactionType }
  }) => void
  newCategoryName: string | null
  newCategoryType: $Enums.TransactionType | null
}

export function DialogUpdateCategory({
  category,
  handleUpdateCategory,
  setNewCategoryName,
  setNewCategoryType,
  newCategoryName,
  newCategoryType,
}: DialogUpdateCategoryProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              defaultValue={category.name}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <select
              id="type"
              className="col-span-3 border rounded px-2 py-1"
              defaultValue={category.type}
              onChange={(e) =>
                setNewCategoryType(
                  e.target.value === 'INCOME' ? 'INCOME' : 'EXPENSE',
                )
              }
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            onClick={() =>
              handleUpdateCategory({
                categoryId: category.id,
                data: {
                  name: newCategoryName ?? undefined,
                  type: newCategoryType ?? undefined,
                },
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
