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
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--brand-start)] via-[var(--brand-mid)] to-[var(--brand-end)] shadow-[0_0_10px_var(--glow-secondary)]" />
        <span className="text-lg font-bold text-foreground">AI Chat</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  )
}
