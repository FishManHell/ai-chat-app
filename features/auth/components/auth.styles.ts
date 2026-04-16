import { cn } from "@/shared/lib/utils"

export const styles = {
  input: cn(
    "h-11 rounded-xl border-input-border bg-input",
    "placeholder:text-muted-foreground",
    "focus:border-primary focus:ring-primary"
  ),
  submitButton: cn(
    "h-11 rounded-xl font-semibold",
    "bg-linear-to-r from-(--brand-start) to-(--brand-mid)",
    "text-white shadow-(--glow-primary)",
    "hover:opacity-90 transition-all duration-200"
  ),
  googleButton: cn(
    "h-11 rounded-xl bg-input border-input-border",
    "text-foreground font-medium",
    "hover:bg-muted transition-all duration-200"
  ),
}
