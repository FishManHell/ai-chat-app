import { ReactNode } from "react"

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F0B1E] to-[#1A1040] px-4">
      {/* Decorative glow blobs */}
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, #C17AEF 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-0 h-[500px] w-[500px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, #E8935A 0%, transparent 70%)",
        }}
      />

      <div className="flex w-full max-w-4xl items-center justify-center gap-16 lg:justify-between">
        {/* Left branding — hidden on mobile */}
        <div className="hidden flex-col gap-6 lg:flex">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
                boxShadow: "0 0 24px rgba(193, 122, 239, 0.4)",
              }}
            />
            <h1 className="text-5xl font-bold text-foreground">AI Chat</h1>
          </div>
          <p className="max-w-xs text-lg text-muted-foreground">
            Your personal AI assistant, powered by Gemini.
          </p>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: "#E8935A" }} />
            <div className="h-2 w-2 rounded-full" style={{ background: "#C17AEF" }} />
            <div className="h-2 w-2 rounded-full" style={{ background: "#7B8CED" }} />
          </div>
        </div>

        {/* Auth card */}
        <div
          className="w-full max-w-md rounded-3xl border p-8"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur))",
            WebkitBackdropFilter: "blur(var(--glass-blur))",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <div
              className="h-8 w-8 rounded-full"
              style={{
                background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
                boxShadow: "0 0 16px rgba(193, 122, 239, 0.4)",
              }}
            />
            <span className="text-2xl font-bold text-foreground">AI Chat</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
