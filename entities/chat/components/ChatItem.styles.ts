import { cn } from "@/shared/lib/utils"

export const itemWrapper = (isActive: boolean) =>
  cn(
    "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left",
    "transition-all duration-200",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
  )

export const deleteButton = cn(
  "h-7 w-7 shrink-0 opacity-0 transition-opacity",
  "group-hover:opacity-100",
  "text-muted-foreground hover:text-destructive"
)
