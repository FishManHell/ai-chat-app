import type { ChatPreview } from "@/entities/chat/types"
import type { MessageRole } from "@/entities/message/types"

export function createChatPreview(overrides?: Partial<ChatPreview>): ChatPreview {
  return {
    id: "chat-1",
    title: "Test Chat",
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  }
}

export function createMessage(overrides?: Partial<{ role: MessageRole; content: string; createdAt: Date }>) {
  return {
    role: "user" as MessageRole,
    content: "Hello",
    createdAt: new Date("2025-01-01T12:00:00"),
    ...overrides,
  }
}
