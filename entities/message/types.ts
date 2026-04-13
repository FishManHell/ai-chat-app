export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const

export type MessageRole = typeof MESSAGE_ROLES[keyof typeof MESSAGE_ROLES]

export interface Message {
  id: string
  chatId: string
  role: MessageRole
  content: string
  createdAt: Date
}

export type CreateMessageDTO = Omit<Message, "id" | "createdAt">

export interface IChatMessage {
  role: MessageRole
  content: string
  createdAt: Date
}
