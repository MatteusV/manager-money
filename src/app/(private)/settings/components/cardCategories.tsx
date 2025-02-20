import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { $Enums, Category as CategoryPrisma } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { TableCategories } from './tableCategories'
import { useRouter } from 'next/navigation'
import { createNewCategory } from '@/app/server-action/createNewCategory'
import { updateCategory } from '@/app/server-action/updateCategory'
import { deleteCategory } from '@/app/server-action/deleteCategory'
import { toast } from 'sonner'

type Category = {
  id: string
  name: string
  type: $Enums.TransactionType
}

interface CardCategoriesProps {
  userId: string
  categories: CategoryPrisma[]
}

export function CardCategories({ categories, userId }: CardCategoriesProps) {
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
        toast.error('Erro ao criar uma nova categoría.')
        return
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
  )
}
