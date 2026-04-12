import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import ChatModel from "@/models/Chat"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { messages, chatId } = await request.json()

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    onFinish: async ({ text }) => {
      await connectDB()

      const userMessage = messages[messages.length - 1]

      if (chatId) {
        await ChatModel.findOneAndUpdate(
          { _id: chatId, userId: session.user.id },
          {
            $push: {
              messages: {
                $each: [
                  { role: "user", content: userMessage.content, createdAt: new Date() },
                  { role: "assistant", content: text, createdAt: new Date() },
                ],
              },
            },
            $set: { updatedAt: new Date() },
          }
        )
      } else {
        const title = typeof userMessage.content === "string"
          ? userMessage.content.slice(0, 50)
          : "New Chat"

        await ChatModel.create({
          userId: session.user.id,
          title,
          messages: [
            { role: "user", content: userMessage.content, createdAt: new Date() },
            { role: "assistant", content: text, createdAt: new Date() },
          ],
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
