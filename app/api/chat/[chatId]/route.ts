import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"

interface RouteParams {
  params: Promise<{ chatId: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { chatId } = await params

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return NextResponse.json({ message: "Invalid chat ID" }, { status: 400 })
  }

  await connectDB()

  const chat = await ChatModel.findOne({
    _id: chatId,
    userId: session.user.id,
  })

  if (!chat) {
    return NextResponse.json({ message: "Chat not found" }, { status: 404 })
  }

  return NextResponse.json(chat)
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { chatId } = await params

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return NextResponse.json({ message: "Invalid chat ID" }, { status: 400 })
  }

  await connectDB()

  const deleted = await ChatModel.findOneAndDelete({
    _id: chatId,
    userId: session.user.id,
  })

  if (!deleted) {
    return NextResponse.json({ message: "Chat not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Chat deleted" })
}
