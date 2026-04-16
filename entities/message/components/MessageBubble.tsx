"use client"

import type { MessageRole } from "../types"
import * as styles from "./MessageBubble.styles"

interface MessageBubbleProps {
  role: MessageRole
  content: string
  createdAt?: Date
}

export function MessageBubble({ role, content, createdAt }: Readonly<MessageBubbleProps>) {
  const isUser = role === "user"

  return (
    <div className={styles.wrapper(isUser)}>
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

      <div className={styles.bubble(isUser)}>
        <p className="break-words whitespace-pre-wrap">{content}</p>

        {/* Timestamp on hover */}
        {createdAt && (
          <span className={styles.timestamp(isUser)}>
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
