import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/entities/user/lib/auth-config"
import { connectDB } from "@/shared/lib/db"
import { chatLimiter } from "@/shared/lib/rate-limit"
import { sanitizeMessage } from "@/shared/lib/sanitize"
import ChatModel from "@/models/Chat"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { allowed } = chatLimiter(session.user.id)

  if (!allowed) {
    return NextResponse.json(
      { message: "Too many requests. Try again later." },
      { status: 429 }
    )
  }

  const { messages, chatId } = await request.json()

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    onFinish: async ({ text }) => {
      await connectDB()

      const userMessage = messages[messages.length - 1]
      const sanitizedContent = sanitizeMessage(userMessage.content)
      const sanitizedResponse = sanitizeMessage(text)

      if (chatId) {
        await ChatModel.findOneAndUpdate(
          { _id: chatId, userId: session.user.id },
          {
            $push: {
              messages: {
                $each: [
                  { role: "user", content: sanitizedContent, createdAt: new Date() },
                  { role: "assistant", content: sanitizedResponse, createdAt: new Date() },
                ],
              },
            },
            $set: { updatedAt: new Date() },
          }
        )
      } else {
        const title = typeof sanitizedContent === "string"
          ? sanitizedContent.slice(0, 50)
          : "New Chat"

        await ChatModel.create({
          userId: session.user.id,
          title,
          messages: [
            { role: "user", content: sanitizedContent, createdAt: new Date() },
            { role: "assistant", content: sanitizedResponse, createdAt: new Date() },
          ],
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
