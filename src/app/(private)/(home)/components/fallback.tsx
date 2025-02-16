import { Loader2 } from 'lucide-react'

export function Fallback() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader2 className="size-8 text-black dark:text-white animate-spin" />
    </div>
  )
}
