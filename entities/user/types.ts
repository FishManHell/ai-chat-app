import type { Document } from "mongoose"

export interface User {
  id: string
  username: string
  email: string
  password?: string
  googleId?: string
  avatar?: string
  createdAt: Date
}

export type CreateUserDTO = Pick<User, "username" | "email" | "password">

export interface IUser extends Document {
  username: string
  email: string
  password?: string
  googleId?: string
  avatar?: string
  createdAt: Date
}
