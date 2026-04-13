import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata: Metadata = {
  title: "Sign In — AI Chat",
}

const LoginPage = () => {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Sign in to continue your conversations
      </p>
      <LoginForm />
    </div>
  )
}

export default LoginPage
