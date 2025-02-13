'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { $Enums, Category as CategoryPrisma } from '@prisma/client'
import { createNewCategory } from '@/app/server-action/createNewCategory'
import { toast } from '@/hooks/use-toast'
import { deleteCategory } from '@/app/server-action/deleteCategory'
import { updateCategory } from '@/app/server-action/updateCategory'
import { useRouter } from 'next/navigation'
import { TableCategories } from './tableCategories'

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

  async function handleDeleteCategory({
    categoryId,
    transferTo,
  }: {
    categoryId: string
    transferTo?: string
  }) {
    await deleteCategory({ id: categoryId, tranferTo: transferTo || null })
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
                  type: e.target.value === 'income' ? 'INCOME' : 'EXPENSE',
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

          <TableCategories
            setNewCategoryName={setNewCategoryName}
            setNewCategoryType={setNewCategoryType}
            handleDeleteCategory={handleDeleteCategory}
            handleUpdateCategory={handleUpdateCategory}
            newCategoryName={newCategoryName}
            newCategoryType={newCategoryType}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  )
}
