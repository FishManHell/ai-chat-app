export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const

export type MessageRole = typeof MESSAGE_ROLES[keyof typeof MESSAGE_ROLES]

export interface Message {
  readonly id: string
  readonly chatId: string
  readonly role: MessageRole
  readonly content: string
  readonly createdAt: Date
}

export type CreateMessageDTO = Omit<Message, "id" | "createdAt">

export interface IChatMessage {
  role: MessageRole
  content: string
  createdAt: Date
}
