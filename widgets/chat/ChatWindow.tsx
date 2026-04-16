"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { toast } from "sonner"
import { MessageBubble } from "@/entities/message/components/MessageBubble"
import { ChatInput } from "@/features/send-message/components/ChatInput"
import { ChatSidebar } from "@/features/manage-chats/components/ChatSidebar"
import type { ChatPreview } from "@/entities/chat/types"
import { EmptyState } from "./components/EmptyState"
import { TypingIndicator } from "./components/TypingIndicator"
import { handleNewChatRedirect } from "./lib/handleNewChatRedirect"
import { getMessageText } from "./lib/getMessageText"

interface ChatWindowProps {
  initialChats: ReadonlyArray<ChatPreview>
  chatId?: string
  initialMessages?: ReadonlyArray<UIMessage>
}

export function ChatWindow({
  initialChats,
  chatId,
  initialMessages,
}: ChatWindowProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat({
    transport: new DefaultChatTransport({api: "/api/chat", body: { chatId }}),
    messages: initialMessages as UIMessage[],
    onFinish: () => handleNewChatRedirect(router, chatId),
    onError: () => toast.error("Failed to send message. Please try again."),
  })

  const isLoading = status === "submitted" || status === "streaming"

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const handleSend = (text: string) => sendMessage({ text })

  return (
    <div className="flex h-dvh">
      <ChatSidebar chats={initialChats} activeChatId={chatId} />

      <main className="flex min-w-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? <EmptyState /> : (
            <div className="mx-auto max-w-3xl space-y-6 px-3 py-6 pb-4 sm:px-4 lg:px-6">
              {messages.map((message) => {
                const text = getMessageText(message)
                if (!text) return null

                return (
                  <MessageBubble
                    key={message.id}
                    role={message.role as "user" | "assistant"}
                    content={text}
                    createdAt={undefined}
                  />
                )
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
            </div>
          )}
        </div>
        <ChatInput isLoading={isLoading} onSend={handleSend} onStop={stop}/>
      </main>
    </div>
  )
}
