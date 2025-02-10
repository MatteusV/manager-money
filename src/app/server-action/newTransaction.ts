'use server'

import type { Transaction } from "@/components/financeControl";
import { prisma } from "@/lib/prisma";

interface NewTransactionProps extends Omit<Transaction, 'id'> {
  userId: string
}

export async function newTransaction(data: NewTransactionProps) {
  const userExists = await prisma.user.findUnique({
    where: {
      id: data.userId
    }
  })

  if(!userExists) {
    return { error: 'Usuário não foi encontrado' }
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      date: data.date,
      userId: data.userId
    }
  })

  return { transaction }
}