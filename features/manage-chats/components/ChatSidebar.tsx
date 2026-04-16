"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Menu } from "lucide-react"
import { ThemeCustomizer } from "@/features/customize-theme/components/ThemeCustomizer"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { sidebarPanel, newChatButton } from "./ChatSidebar.styles"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"
import { ChatItem } from "@/entities/chat/components/ChatItem"
import { deleteChat } from "../lib/chat-actions"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarUser } from "./SidebarUser"
import type { ChatPreview } from "@/entities/chat/types"

interface ChatSidebarProps {
  chats: ReadonlyArray<ChatPreview>
  activeChatId?: string
}

export function ChatSidebar({ chats, activeChatId }: Readonly<ChatSidebarProps>) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)

  function handleNewChat() {
    router.push("/chat")
    setIsOpen(false)
  }

  function handleChatSelect(chatId: string) {
    router.push(`/chat/${chatId}`)
    setIsOpen(false)
  }

  async function handleChatDelete(chatId: string) {
    try {
      await deleteChat(chatId)
      toast.success("Chat deleted")
      if (chatId === activeChatId) {
        router.push("/chat")
      }
    } catch {
      toast.error("Failed to delete chat")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <ThemeCustomizer isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />

      <aside className={sidebarPanel(isOpen)}>
        <SidebarHeader onClose={() => setIsOpen(false)} />

        <div className="px-3 pb-2">
          <Button onClick={handleNewChat} className={newChatButton}>
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="flex-1 px-2 py-2">
          <div className="flex flex-col gap-0.5">
            {chats.length === 0 ? (
              <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                No conversations yet
              </p>
            ) : (
              chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelect={handleChatSelect}
                  onDelete={handleChatDelete}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <Separator className="bg-border" />
        <SidebarUser onThemeOpen={() => setIsThemeOpen(true)} />
      </aside>
    </>
  )
}
