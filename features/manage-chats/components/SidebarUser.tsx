"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, Palette } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { UserAvatar } from "@/entities/user/components/UserAvatar"

interface SidebarUserProps {
  onThemeOpen: () => void
}

export function SidebarUser({ onThemeOpen }: Readonly<SidebarUserProps>) {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-3 p-4">
      <UserAvatar
        name={session?.user?.name}
        image={session?.user?.image}
        className="h-8 w-8"
      />
      <span className="flex-1 truncate text-sm text-foreground">
        {session?.user?.name ?? session?.user?.email}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-primary"
        onClick={onThemeOpen}
      >
        <Palette className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-destructive"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
