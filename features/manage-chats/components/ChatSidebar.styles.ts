import { cn } from "@/shared/lib/utils"

export const sidebarPanel = (isOpen: boolean) =>
  cn(
    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border",
    "bg-card/80 backdrop-blur-xl",
    "transition-transform duration-300",
    "md:static md:translate-x-0",
    isOpen ? "translate-x-0" : "-translate-x-full"
  )

export const newChatButton = cn(
  "w-full cursor-pointer justify-start gap-2 rounded-xl",
  "bg-linear-to-r from-(--brand-start) to-(--brand-mid)",
  "text-white shadow-(--glow-primary)",
  "hover:opacity-90 transition-all duration-200"
)
