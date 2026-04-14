import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"
import { ChatWindow } from "@/widgets/chat/ChatWindow"
import { getChats } from "@/features/manage-chats/lib/chat-actions"
import type { UIMessage } from "ai"

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>
}

const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const { chatId } = await params

  if (!mongoose.Types.ObjectId.isValid(chatId)) notFound()

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    notFound()
  }

  await connectDB()

  const chat = await ChatModel.findOne({
    _id: chatId,
    userId: session.user.id,
  }).lean()

  if (!chat) notFound()

  const chats = await getChats()

  const initialMessages: UIMessage[] = chat.messages.map(
    (msg, index) => ({
      id: `${chatId}-${index}`,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text" as const, text: msg.content }],
    })
  )

  return (
    <ChatWindow
      initialChats={chats}
      chatId={chatId}
      initialMessages={initialMessages}
    />
  )
}

export default ChatDetailPage
