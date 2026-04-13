"use client"

import { Trash2, MessageSquare } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import type { ChatPreview } from "../types"

interface ChatItemProps {
  chat: ChatPreview
  isActive: boolean
  onSelect: (chatId: string) => void
  onDelete: (chatId: string) => void
}

export function ChatItem({ chat, isActive, onSelect, onDelete }: Readonly<ChatItemProps>) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(chat.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(chat.id)
      }}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left",
        "transition-all duration-200",
        isActive
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <MessageSquare className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-sm">{chat.title}</span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 shrink-0 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          "text-muted-foreground hover:text-destructive"
        )}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(chat.id)
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
