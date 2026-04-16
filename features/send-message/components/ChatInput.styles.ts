import { cn } from "@/shared/lib/utils"

export const styles = {
  wrapper: "border-t border-border bg-background/80 backdrop-blur-sm p-3 sm:p-4",
  form: cn(
    "mx-auto flex max-w-3xl items-end gap-2",
    "rounded-2xl border border-input-border bg-input p-2"
  ),
  textarea: cn(
    "flex-1 resize-none bg-transparent px-2 py-1.5",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "outline-none",
    "max-h-[200px] min-h-[36px]"
  ),
  stopButton: cn(
    "h-9 w-9 shrink-0 rounded-xl",
    "bg-muted text-muted-foreground",
    "hover:bg-muted/80 transition-colors"
  ),
  sendButton: cn(
    "h-9 w-9 shrink-0 rounded-xl",
    "bg-linear-to-r from-(--brand-start) to-(--brand-mid)",
    "text-white shadow-(--glow-primary)",
    "hover:opacity-90 transition-all duration-200",
    "disabled:opacity-40 disabled:shadow-none"
  ),
}
