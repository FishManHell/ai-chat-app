import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"

interface RouteParams {
  params: Promise<{ chatId: string }>
}

async function validateAndConnect(params: Promise<{ chatId: string }>) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) }
  }

  const { chatId } = await params

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return { error: NextResponse.json({ message: "Invalid chat ID" }, { status: 400 }) }
  }

  await connectDB()

  return { userId: session.user.id, chatId }
}

export async function GET(_request: Request, { params }: RouteParams) {
  const result = await validateAndConnect(params)
  if ("error" in result) return result.error

  const chat = await ChatModel.findOne({
    _id: result.chatId,
    userId: result.userId,
  })

  if (!chat) {
    return NextResponse.json({ message: "Chat not found" }, { status: 404 })
  }

  return NextResponse.json(chat)
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const result = await validateAndConnect(params)
  if ("error" in result) return result.error

  const deleted = await ChatModel.findOneAndDelete({
    _id: result.chatId,
    userId: result.userId,
  })

  if (!deleted) {
    return NextResponse.json({ message: "Chat not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Chat deleted" })
}
