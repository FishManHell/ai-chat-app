import type { CallbacksOptions } from "next-auth"
import { connectDB } from "@/shared/lib/db"
import UserModel from "@/models/User"

export const jwt: CallbacksOptions["jwt"] = async ({ token, user, account }) => {
  if (user) {
    token.userId = user.id
  }

  if (account?.provider === "google") {
    await connectDB()

    const email = token.email ?? undefined
    const name = token.name ?? `user_${Date.now()}`

    let dbUser = await UserModel.findOne({ email })

    if (dbUser) {
      if (!dbUser.googleId) {
        dbUser.googleId = account.providerAccountId
        await dbUser.save()
      }
    } else {
      dbUser = await UserModel.create({
        username: name,
        email,
        googleId: account.providerAccountId,
        avatar: token.picture ?? undefined,
      })
    }

    token.userId = dbUser._id.toString()
  }

  return token
}

export const session: CallbacksOptions["session"] = async ({ session, token }) => {
  session.user.id = token.userId
  return session
}
