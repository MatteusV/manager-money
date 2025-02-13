'use client'

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

interface TableCategoriesProps {
  categories: Category[]
  newCategoryName: string | null
  newCategoryType: $Enums.TransactionType | null
  setNewCategoryName: (value: string) => void
  handleUpdateCategory: (value: {
    categoryId: string
    data: { name?: string; type?: $Enums.TransactionType }
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
}: TableCategoriesProps) {
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<
    string | null
  >(null)
  const [selectedTransferCategory, setSelectedTransferCategory] = useState<
    string | null
  >(null)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-auto">
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>
              {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
            </TableCell>
            <TableCell>
              <DialogUpdateCategory
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
  )
}
