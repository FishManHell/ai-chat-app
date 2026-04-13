"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
        setIsLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.success("Account created! Please sign in.")
        router.push("/login")
      } else {
        router.push("/chat")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Your username"
          required
          maxLength={30}
          disabled={isLoading}
          className={cn(
            "h-11 rounded-xl border-input-border bg-input",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-primary"
          )}
        />
      </div>

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

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repeat password"
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
          "bg-gradient-to-r from-[var(--aurora-start)] to-[var(--aurora-mid)]",
          "text-white shadow-lg shadow-[var(--glow-primary)]",
          "hover:opacity-90 transition-all duration-200"
        )}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </form>
  )
}
