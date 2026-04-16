import { cn } from "@/shared/lib/utils"

export const styles = {
  panel: cn(
    "fixed right-0 top-0 z-50 flex h-full w-80 flex-col",
    "border-l border-border bg-card/95 backdrop-blur-xl",
    "animate-in slide-in-from-right duration-300"
  ),
  saveButton: cn(
    "flex-1 cursor-pointer rounded-xl",
    "bg-linear-to-r from-(--brand-start) to-(--brand-mid)",
    "text-white shadow-(--glow-primary)",
    "hover:opacity-90 transition-all duration-200"
  ),
}
