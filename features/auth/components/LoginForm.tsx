"use client"

import {SyntheticEvent, useState} from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { GoogleIcon } from "@/shared/ui/google-icon"
import { styles } from "./auth.styles"

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
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className={styles.input}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-foreground text-sm font-medium">
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
          className={styles.input}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative flex items-center gap-4 py-2">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className={styles.googleButton}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  )
}
