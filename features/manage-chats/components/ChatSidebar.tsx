"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Plus, LogOut, X, Menu, Palette } from "lucide-react"
import { ThemeCustomizer } from "@/features/customize-theme/components/ThemeCustomizer"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"
import { ChatItem } from "@/entities/chat/components/ChatItem"
import { UserAvatar } from "@/entities/user/components/UserAvatar"
import { deleteChat } from "../lib/chat-actions"
import type { ChatPreview } from "@/entities/chat/types"

interface ChatSidebarProps {
  chats: ReadonlyArray<ChatPreview>
  activeChatId?: string
}

export function ChatSidebar({ chats, activeChatId }: Readonly<ChatSidebarProps>) {
  const router = useRouter()
  const { data: session } = useSession()
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

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-full"
            style={{
              background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
              boxShadow: "0 0 10px rgba(193, 122, 239, 0.3)",
            }}
          />
          <span className="text-lg font-bold text-foreground">AI Chat</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* New Chat button */}
      <div className="px-3 pb-2">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full cursor-pointer justify-start gap-2 rounded-xl",
            "bg-gradient-to-r from-[var(--aurora-start)] to-[var(--aurora-mid)]",
            "text-white shadow-md shadow-[var(--glow-primary)]",
            "hover:opacity-90 transition-all duration-200"
          )}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator className="bg-border" />

      {/* Chat list */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="flex flex-col gap-0.5">
          {chats.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
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

      {/* User section */}
      <Separator className="bg-border" />
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
          onClick={() => setIsThemeOpen(true)}
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
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 md:hidden text-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Theme customizer */}
      <ThemeCustomizer isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border",
          "bg-card/80 backdrop-blur-xl",
          "transition-transform duration-300",
          "md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
