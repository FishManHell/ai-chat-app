"use client"

import { cn } from "@/shared/lib/utils"
import type { MessageRole } from "../types"

interface MessageBubbleProps {
  role: MessageRole
  content: string
  createdAt?: Date
}

export function MessageBubble({ role, content, createdAt }: Readonly<MessageBubbleProps>) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "group flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="mt-1 h-8 w-8 shrink-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
            boxShadow: "0 0 12px rgba(193, 122, 239, 0.3)",
          }}
        />
      )}

      <div
        className={cn(
          "relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>

        {/* Timestamp on hover */}
        {createdAt && (
          <span
            className={cn(
              "absolute -bottom-5 text-xs text-muted-foreground",
              "opacity-0 transition-opacity group-hover:opacity-100",
              isUser ? "right-0" : "left-0"
            )}
          >
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  )
}
