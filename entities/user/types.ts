import type { Document } from "mongoose"

export interface User {
  readonly id: string
  readonly username: string
  readonly email: string
  readonly password?: string
  readonly googleId?: string
  readonly avatar?: string
  readonly createdAt: Date
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
