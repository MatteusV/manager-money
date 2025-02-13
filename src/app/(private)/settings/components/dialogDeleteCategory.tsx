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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@prisma/client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DialogDeleteCategoryProps {
  selectedCategoryToDelete: string | null
  selectedTransferCategory: string | null
  category: Category
  categories: Category[]
  setSelectedCategoryToDelete: (value: string) => void
  setSelectedTransferCategory: (value: string) => void
  handleDeleteCategory: (data: {
    categoryId: string
    transferTo?: string
  }) => void
}

export function DialogDeleteCategory({
  selectedCategoryToDelete,
  selectedTransferCategory,
  category,
  categories,
  setSelectedCategoryToDelete,
  setSelectedTransferCategory,
  handleDeleteCategory,
}: DialogDeleteCategoryProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hover:text-red-600"
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategoryToDelete(category.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Categoria</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-400">
          Essa categoria contém transações. Deseja transferi-las para outra
          categoria ou excluir tudo?
        </p>
        <Select required onValueChange={setSelectedTransferCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria para transferir" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((cat) => cat.id !== selectedCategoryToDelete)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedTransferCategory) {
                  handleDeleteCategory({
                    categoryId: selectedCategoryToDelete!,
                    transferTo: selectedTransferCategory!,
                  })
                } else {
                  return toast.error('Erro ao deletar a categoria!', {
                    description:
                      'Você precisa transferir as transações que estão nessa categoria.',
                  })
                }
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
