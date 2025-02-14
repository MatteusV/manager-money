'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/server-action/logout'
import { useRouter } from 'next/navigation'

export function ProfileButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout() // ✅ Chama a server action corretamente
    router.push('/auth') // ✅ Redireciona após logout
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User />
          <span className="sr-only">My Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Configurações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
