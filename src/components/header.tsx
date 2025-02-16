import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { ChartColumn, Home, Settings } from 'lucide-react'
import { ProfileButton } from './profileButton'
import { getUserToken } from '@/app/server-action/getUserToken'
import { getImageProfile } from '@/app/server-action/getImageProfile'

export async function Header() {
  const { tokenDecoded } = await getUserToken()
  const { imageUrl } = await getImageProfile(tokenDecoded!.id!)
  return (
    <header className="w-full p-4 flex items-center justify-between border-b border-zinc-500/50">
      <div className="flex-1 flex gap-4">
        <Link
          href={'/'}
          title="Home"
          className="border border-zinc-500 p-2 rounded-xl hover:bg-white/10"
        >
          <Home className="size-5" />
        </Link>
        <Link
          href={'/performance'}
          title="desempenho"
          className="border border-zinc-500 p-2 rounded-xl hover:bg-white/10"
        >
          <ChartColumn className="size-5" />
        </Link>
        <Link
          href={'/settings'}
          title="configurações"
          className="border border-zinc-500 p-2 rounded-xl hover:bg-white/10"
        >
          <Settings className="size-5" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ProfileButton imageUrl={imageUrl} />
      </div>
    </header>
  )
}
