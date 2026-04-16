"use client"

import { X } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface SidebarHeaderProps {
  onClose: () => void
}

export function SidebarHeader({ onClose }: Readonly<SidebarHeaderProps>) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-linear-to-br from-(--brand-start) via-(--brand-mid) to-(--brand-end) shadow-[0_0_10px_var(--glow-secondary)]" />
        <span className="text-foreground text-lg font-bold">AI Chat</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground md:hidden"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}
