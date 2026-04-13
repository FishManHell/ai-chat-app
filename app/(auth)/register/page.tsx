import type { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create Account — AI Chat",
}

const RegisterPage = () => {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-foreground">Create account</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Get started with AI Chat
      </p>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
