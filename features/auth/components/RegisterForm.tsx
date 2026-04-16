"use client"

import {SyntheticEvent, useState} from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { styles } from "./auth.styles"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (password !== formData.get("confirmPassword")) {
      toast.error("Passwords don't match")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message)
        return
      }

      const result = await signIn("credentials", { email, password, redirect: false })

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
        <label htmlFor="username" className="text-foreground text-sm font-medium">
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
          className={styles.input}
        />
      </div>

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

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
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
          className={styles.input}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  )
}
