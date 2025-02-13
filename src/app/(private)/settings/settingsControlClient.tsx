'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { $Enums, Category as CategoryPrisma } from '@prisma/client'
import { createNewCategory } from '@/app/server-action/createNewCategory'
import { toast } from '@/hooks/use-toast'
import { deleteCategory } from '@/app/server-action/deleteCategory'
import { updateCategory } from '@/app/server-action/updateCategory'
import { useRouter } from 'next/navigation'
import { DialogClose } from '@radix-ui/react-dialog'

type Category = {
  id: string
  name: string
  type: $Enums.TransactionType
}

interface SettingsPageProps {
  userId: string
  categories: CategoryPrisma[]
}

export function SettingsControlClient({
  userId,
  categories,
}: SettingsPageProps) {
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    type: 'EXPENSE',
  })
  const [newCategoryName, setNewCategoryName] = useState<string | null>(null)
  const [newCategoryType, setNewCategoryType] =
    useState<$Enums.TransactionType | null>(null)

  const router = useRouter()

  async function addCategory() {
    if (newCategory.name.trim()) {
      const data = {
        ...newCategory,
        userId,
      }
      const { category } = await createNewCategory({ data })
      if (!category) {
        return toast({
          title: 'Erro ao criar uma nova categoría.',
        })
      }
    }

    router.refresh()
  }

  function handleUpdateCategory({
    categoryId,
    data,
  }: {
    categoryId: string
    data: { name?: string; type?: $Enums.TransactionType }
  }) {
    updateCategory({
      categoryId,
      data: {
        name: data.name,
        type: data.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
      },
    })
    router.refresh()
  }

  async function handleDeleteCategory(categoryId: string) {
    await deleteCategory({ id: categoryId })
    router.refresh()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gerenciar Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Nova categoria"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <select
              className="border rounded px-2 py-1"
              defaultValue={newCategory.type}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  type: e.target.value === 'INCOME' ? 'INCOME' : 'EXPENSE',
                })
              }
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            <Button onClick={addCategory}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 text-zinc-300 hover:text-white"
                        >
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
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
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
                                  e.target.value === 'INCOME'
                                    ? 'INCOME'
                                    : 'EXPENSE',
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
                    <Button
                      className="hover:text-red-600"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
