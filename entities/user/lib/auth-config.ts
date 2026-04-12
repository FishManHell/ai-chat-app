import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectDB } from "@/shared/lib/db"
import UserModel from "@/models/User"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
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
    },

    async session({ session, token }) {
      session.user.id = token.userId
      return session
    },
  },
}
