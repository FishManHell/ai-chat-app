"use client"

import { Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/shared/ui/button"
import type { ChatPreview } from "../types"
import { itemWrapper, deleteButton } from "./ChatItem.styles"

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
      className={itemWrapper(isActive)}
    >
      <MessageSquare className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-sm">{chat.title}</span>
      <Button
        variant="ghost"
        size="icon"
        className={deleteButton}
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
