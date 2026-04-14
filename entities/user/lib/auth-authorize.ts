import bcrypt from "bcryptjs"
import { connectDB } from "@/shared/lib/db"
import UserModel from "@/models/User"

export async function authorize(credentials: Record<"email" | "password", string> | undefined) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required")
  }

  await connectDB()

  const user = await UserModel.findOne({ email: credentials.email })
  if (!user || !user.password) {
    throw new Error("Invalid credentials")
  }

  const isValid = await bcrypt.compare(credentials.password, user.password)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user._id.toString(),
    name: user.username,
    email: user.email,
    image: user.avatar,
  }
}
