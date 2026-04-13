"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { MessageBubble } from "@/entities/message/components/MessageBubble"
import { ChatInput } from "@/features/send-message/components/ChatInput"
import { ChatSidebar } from "@/features/manage-chats/components/ChatSidebar"
import type { ChatPreview } from "@/entities/chat/types"

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
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    messages: initialMessages as UIMessage[],
    onFinish: async () => {
      if (!chatId) {
        // New chat was created — fetch latest chats and redirect
        const res = await fetch("/api/chat/latest")
        if (res.ok) {
          const { chatId: newChatId } = await res.json()
          if (newChatId) {
            router.push(`/chat/${newChatId}`)
            return
          }
        }
        router.refresh()
      }
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.")
    },
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

  function handleSend(text: string) {
    sendMessage({ text })
  }

  return (
    <div className="flex h-[100dvh]">
      <ChatSidebar chats={initialChats} activeChatId={chatId} />

      <main className="flex flex-1 flex-col min-w-0">
        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-3 py-6 sm:px-4 lg:px-6 pb-4">
              {messages.map((message) => {
                const textContent = message.parts
                  .filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("")

                if (!textContent) return null

                return (
                  <MessageBubble
                    key={message.id}
                    role={message.role as "user" | "assistant"}
                    content={textContent}
                    createdAt={undefined}
                  />
                )
              })}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div
                    className="mt-1 h-8 w-8 shrink-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
                    }}
                  />
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          onStop={stop}
        />
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <div
        className={cn(
          "h-16 w-16 rounded-full",
          "shadow-lg"
        )}
        style={{
          background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
          boxShadow: "0 0 32px rgba(193, 122, 239, 0.3)",
        }}
      />
      <h2 className="text-xl font-semibold text-foreground">
        How can I help you today?
      </h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Start a conversation with AI Chat. Ask anything — from coding questions
        to creative writing.
      </p>
    </div>
  )
}
