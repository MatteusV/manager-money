import type { $Enums, Transaction as TransactionPrisma } from '@prisma/client'

interface Category {
  id: string
  name: string
  type: $Enums.TransactionType
}

export interface Transaction extends TransactionPrisma {
  category: Category | null
}
