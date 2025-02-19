'use client'

import type { Category, Goal } from '@prisma/client'

import { CardCategories } from './cardCategories'
import { CardGoals } from './cardGoals'

interface SettingsPageProps {
  userId: string
  categories: Category[]
  goals: Goal[]
}

export function SettingsControlClient({
  userId,
  categories,
  goals,
}: SettingsPageProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <CardCategories categories={categories} userId={userId} />

      <CardGoals goals={goals} userId={userId} />
    </div>
  )
}
