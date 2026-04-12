import mongoose, { Schema } from "mongoose"
import type { IChat } from "@/entities/chat/types"
import type { IChatMessage } from "@/entities/message/types"

const messageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      default: "New Chat",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
)

chatSchema.index({ userId: 1, updatedAt: -1 })

const ChatModel =
  (mongoose.models.Chat as mongoose.Model<IChat>) ||
  mongoose.model<IChat>("Chat", chatSchema)

export default ChatModel
