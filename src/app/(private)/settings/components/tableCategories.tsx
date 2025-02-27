import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import type { $Enums, Category } from '@prisma/client'
import { DialogUpdateCategory } from './dialogUpdateCategory'
import { useState } from 'react'
import { DialogDeleteCategory } from './dialogDeleteCategory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TableCategoriesProps {
  categories: Category[]
  newCategoryName: string | null
  newCategoryType: $Enums.TransactionType | null
  setNewCategoryName: (value: string) => void
  setNewCategoryBudget: (value: number) => void
  newCategoryBudget: number | null
  handleUpdateCategory: (value: {
    categoryId: string
    data: { name?: string; type?: $Enums.TransactionType; budget?: number }
  }) => void
  setNewCategoryType: (value: $Enums.TransactionType) => void
  handleDeleteCategory: (data: {
    categoryId: string
    transferTo?: string
  }) => Promise<void>
}

export function TableCategories({
  categories,
  handleDeleteCategory,
  handleUpdateCategory,
  newCategoryName,
  newCategoryType,
  setNewCategoryName,
  setNewCategoryType,
  newCategoryBudget,
  setNewCategoryBudget,
}: TableCategoriesProps) {
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<
    string | null
  >(null)
  const [selectedTransferCategory, setSelectedTransferCategory] = useState<
    string | null
  >(null)

  return (
    <>
      {/* Desktop Table */}
      <Table className="max-md:hidden">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Budget</TableHead>
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
              <TableCell>{category.budget}</TableCell>
              <TableCell className="flex gap-2">
                <DialogUpdateCategory
                  newCategoryBudget={newCategoryBudget}
                  setNewCategoryBudget={setNewCategoryBudget}
                  category={category}
                  handleUpdateCategory={handleUpdateCategory}
                  newCategoryName={newCategoryName}
                  setNewCategoryName={setNewCategoryName}
                  newCategoryType={newCategoryType}
                  setNewCategoryType={setNewCategoryType}
                />
                <DialogDeleteCategory
                  categories={categories}
                  category={category}
                  handleDeleteCategory={handleDeleteCategory}
                  selectedCategoryToDelete={selectedCategoryToDelete}
                  selectedTransferCategory={selectedTransferCategory}
                  setSelectedCategoryToDelete={setSelectedCategoryToDelete}
                  setSelectedTransferCategory={setSelectedTransferCategory}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden border-0 shadow-lg"
          >
            <div
              className={`h-2 w-full ${category.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {category.name}
                </CardTitle>
                <Badge
                  variant={
                    category.type === 'INCOME' ? 'default' : 'destructive'
                  }
                  className={`px-3 py-1 text-xs font-medium ${category.type === 'INCOME' ? 'bg-emerald-500 text-white' : 'bg-rose-500'}`}
                >
                  {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-col space-y-4">
                <div className="rounded-md bg-muted/30 p-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Budget
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(category.budget)}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <DialogUpdateCategory
                    newCategoryBudget={newCategoryBudget}
                    setNewCategoryBudget={setNewCategoryBudget}
                    category={category}
                    handleUpdateCategory={handleUpdateCategory}
                    newCategoryName={newCategoryName}
                    setNewCategoryName={setNewCategoryName}
                    newCategoryType={newCategoryType}
                    setNewCategoryType={setNewCategoryType}
                  />
                  <DialogDeleteCategory
                    categories={categories}
                    category={category}
                    handleDeleteCategory={handleDeleteCategory}
                    selectedCategoryToDelete={selectedCategoryToDelete}
                    selectedTransferCategory={selectedTransferCategory}
                    setSelectedCategoryToDelete={setSelectedCategoryToDelete}
                    setSelectedTransferCategory={setSelectedTransferCategory}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
