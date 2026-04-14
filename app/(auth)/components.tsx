import { cn } from "@/shared/lib/utils"
import { brandGradient, brandGlow } from "./styles"

export function GlowBlob({ color, className }: Readonly<{ color: string; className: string }>) {
  return (
    <div
      className={cn("pointer-events-none absolute h-[500px] w-[500px] rounded-full", className)}
      style={{ background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)` }}
    />
  )
}

export function BrandOrb({ size = "h-10 w-10" }: Readonly<{ size?: string }>) {
  return (
    <div
      className={cn(size, "rounded-full")}
      style={{ background: brandGradient, boxShadow: brandGlow }}
    />
  )
}
