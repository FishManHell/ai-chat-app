"use client"

import {SyntheticEvent, useState} from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { GoogleIcon } from "@/shared/ui/google-icon"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      toast.error("Invalid email or password")
      return
    }

    router.push("/chat")
  }

  function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    signIn("google", { callbackUrl: "/chat" })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className={cn(
            "h-11 rounded-xl border-input-border bg-input",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-primary"
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Min 6 characters"
          required
          minLength={6}
          disabled={isLoading}
          className={cn(
            "h-11 rounded-xl border-input-border bg-input",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-primary"
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "h-11 rounded-xl font-semibold",
          "bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-mid)]",
          "text-white shadow-lg shadow-[var(--glow-primary)]",
          "hover:opacity-90 transition-all duration-200"
        )}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className={cn(
          "h-11 rounded-xl bg-input border-input-border",
          "text-foreground font-medium",
          "hover:bg-muted transition-all duration-200"
        )}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  )
}
