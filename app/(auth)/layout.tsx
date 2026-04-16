import { ReactNode } from "react"
import { GlowBlob, BrandOrb } from "./components"
import { glassStyle } from "./styles"

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-[#0F0B1E] to-[#1A1040] px-4">
      <GlowBlob color="#C17AEF" className="-top-32 right-0 opacity-20" />
      <GlowBlob color="#E8935A" className="-bottom-32 left-0 opacity-25" />

      <div className="flex w-full max-w-4xl items-center justify-center gap-16 lg:justify-between">
        {/* Left branding — hidden on mobile */}
        <div className="hidden flex-col gap-6 lg:flex">
          <div className="flex items-center gap-3">
            <BrandOrb />
            <h1 className="text-foreground text-5xl font-bold">AI Chat</h1>
          </div>
          <p className="text-muted-foreground max-w-xs text-lg">
            Your personal AI assistant, powered by Gemini.
          </p>
          <div className="flex gap-2">
            {["#E8935A", "#C17AEF", "#7B8CED"].map((color) => (
              <div key={color} className="h-2 w-2 rounded-full" style={{ background: color }} />
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md rounded-3xl border p-8" style={glassStyle}>
          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <BrandOrb size="h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">AI Chat</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
