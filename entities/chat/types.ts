import type { Document, Types } from "mongoose"
import type { Message, IChatMessage } from "@/entities/message/types"

export interface Chat {
  readonly id: string
  readonly userId: string
  readonly title: string
  readonly messages: ReadonlyArray<Message>
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type ChatPreview = Pick<Chat, "id" | "title" | "updatedAt">

export interface IChat extends Document {
  userId: Types.ObjectId
  title: string
  messages: IChatMessage[]
  createdAt: Date
  updatedAt: Date
}
