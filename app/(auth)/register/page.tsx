import type { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create Account — AI Chat",
}

const RegisterPage = () => {
  return (
    <div>
      <h2 className="text-foreground mb-1 text-2xl font-bold">Create account</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Get started with AI Chat
      </p>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
