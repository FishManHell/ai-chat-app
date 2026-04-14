import Link from "next/link"
import { cn } from "@/shared/lib/utils"

const HomePage = () => {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F0B1E] to-[#1A1040] px-4">
      {/* Decorative glow blobs */}
      <div
        className="pointer-events-none absolute -top-40 right-20 h-[600px] w-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(ellipse at center, #C17AEF 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-20 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, #E8935A 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{
          background: "radial-gradient(ellipse at center, #7B8CED 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Logo */}
        <div
          className="h-20 w-20 rounded-full shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
            boxShadow: "0 0 48px rgba(193, 122, 239, 0.4)",
          }}
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            AI Chat
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Your personal AI assistant. Powered by Google Gemini.
            Fast, private, and always ready to help.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/chat"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-xl px-8",
              "bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-mid)]",
              "text-white font-semibold shadow-lg shadow-[var(--glow-primary)]",
              "hover:opacity-90 transition-all duration-200"
            )}
          >
            Start Chatting
          </Link>
          <Link
            href="/login"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-xl px-8",
              "border border-border bg-card/50 backdrop-blur-sm",
              "text-foreground font-medium",
              "hover:bg-card transition-all duration-200"
            )}
          >
            Sign In
          </Link>
        </div>

        {/* Decorative dots */}
        <div className="flex gap-2 pt-4">
          <div className="h-2 w-2 rounded-full" style={{ background: "#E8935A" }} />
          <div className="h-2 w-2 rounded-full" style={{ background: "#C17AEF" }} />
          <div className="h-2 w-2 rounded-full" style={{ background: "#7B8CED" }} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
