import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/shared/lib/db"
import UserModel from "@/models/User"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    if (typeof username !== "string" || username.length > 30) {
      return NextResponse.json(
        { message: "Username must be 30 characters or less" },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
