import { cn } from "@/shared/lib/utils"

export const GlowBlob = ({ className, color }: { className: string; color: string }) => (
  <div
    className={cn("pointer-events-none absolute rounded-full", className)}
    style={{ background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)` }}
  />
)
