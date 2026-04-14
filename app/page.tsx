import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { GlowBlob } from "@/shared/ui/glow-blob"
import { BrandDot } from "@/shared/ui/brand-dot"

const HomePage = () => {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F0B1E] to-[#1A1040] px-4">
      <GlowBlob className="-top-40 right-20 h-[600px] w-[600px] opacity-15" color="var(--brand-mid)" />
      <GlowBlob className="-bottom-40 left-20 h-[600px] w-[600px] opacity-20" color="var(--brand-start)" />
      <GlowBlob className="top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 opacity-10" color="var(--brand-end)" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div
          className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--brand-start)] via-[var(--brand-mid)] to-[var(--brand-end)] shadow-2xl"
          style={{ boxShadow: "0 0 48px var(--glow-secondary)" }}
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

        <div className="flex gap-2 pt-4">
          <BrandDot color="var(--brand-start)" />
          <BrandDot color="var(--brand-mid)" />
          <BrandDot color="var(--brand-end)" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
