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
import { AddProfileImageDialog } from './addNewProfileImage'
import Image from 'next/image'

export function ProfileButton({
  imageUrl,
}: {
  imageUrl: string | null | undefined
}) {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/auth')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${imageUrl ? 'p-0' : null}`}
          variant={imageUrl ? 'ghost' : 'outline'}
          size="icon"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={400}
              height={400}
              className="rounded-full"
              alt="Imagem do perfil do usuário"
            />
          ) : (
            <User className="size-5" />
          )}
          <span className="sr-only">My Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Configurações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          <AddProfileImageDialog />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
