import { google } from "@ai-sdk/google"
import { streamText, convertToModelMessages } from "ai"
import type { UIMessage } from "ai"
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

  const modelMessages = await convertToModelMessages(
    messages as UIMessage[]
  )

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: modelMessages,
    onFinish: async ({ text }) => {
      await connectDB()

      // Extract user message text from the last UI message
      const lastUserMsg = [...messages].reverse().find(
        (m: UIMessage) => m.role === "user"
      )
      const userText = lastUserMsg?.parts
        ?.filter((p: { type: string }) => p.type === "text")
        ?.map((p: { text: string }) => p.text)
        ?.join("") ?? ""

      const sanitizedContent = sanitizeMessage(userText)
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
