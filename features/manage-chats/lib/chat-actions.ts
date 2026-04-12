"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"
import type { ChatPreview } from "@/entities/chat/types"

export async function getChats(): Promise<ReadonlyArray<ChatPreview>> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return []
  }

  await connectDB()

  const chats = await ChatModel.find({ userId: session.user.id })
    .select("title updatedAt")
    .sort({ updatedAt: -1 })
    .lean()

  return chats.map((chat) => ({
    id: chat._id.toString(),
    title: chat.title,
    updatedAt: chat.updatedAt,
  }))
}

export async function deleteChat(chatId: string): Promise<void> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await connectDB()

  const deleted = await ChatModel.findOneAndDelete({
    _id: chatId,
    userId: session.user.id,
  })

  if (!deleted) {
    throw new Error("Chat not found")
  }

  revalidatePath("/chat")
}

export async function renameChat(chatId: string, title: string): Promise<void> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (!title || title.length > 100) {
    throw new Error("Title must be between 1 and 100 characters")
  }

  await connectDB()

  const updated = await ChatModel.findOneAndUpdate(
    { _id: chatId, userId: session.user.id },
    { title }
  )

  if (!updated) {
    throw new Error("Chat not found")
  }

  revalidatePath("/chat")
}
