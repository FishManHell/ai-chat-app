import type { Document, Types } from "mongoose"
import type { Message, IChatMessage } from "@/entities/message/types"

export interface Chat {
  id: string
  userId: string
  title: string
  messages: ReadonlyArray<Message>
  createdAt: Date
  updatedAt: Date
}

export type ChatPreview = Pick<Chat, "id" | "title" | "updatedAt">

export interface IChat extends Document {
  userId: Types.ObjectId
  title: string
  messages: IChatMessage[]
  createdAt: Date
  updatedAt: Date
}
