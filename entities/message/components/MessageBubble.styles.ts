import { cn } from "@/shared/lib/utils"

export const wrapper = (isUser: boolean) =>
  cn("group flex gap-3", isUser ? "flex-row-reverse" : "flex-row")

export const bubble = (isUser: boolean) =>
  cn(
    "relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base",
    isUser
      ? "bg-primary text-primary-foreground"
      : "bg-card text-card-foreground border border-border"
  )

export const timestamp = (isUser: boolean) =>
  cn(
    "absolute -bottom-5 text-xs text-muted-foreground",
    "opacity-0 transition-opacity group-hover:opacity-100",
    isUser ? "right-0" : "left-0"
  )
