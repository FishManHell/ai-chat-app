import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const latest = await ChatModel.findOne({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .select("_id")
    .lean()

  if (!latest) {
    return NextResponse.json({ chatId: null })
  }

  return NextResponse.json({ chatId: latest._id.toString() })
}
