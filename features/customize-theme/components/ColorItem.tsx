import { cn } from "@/shared/lib/utils"
import type { ThemeColors } from "@/entities/theme/types"
import { COLOR_LABELS } from "../lib/constants"

interface ColorItemProps {
  colorKey: keyof ThemeColors
  hslValue: string
  isActive: boolean
  onToggle: (key: keyof ThemeColors) => void
}

export function ColorItem({ colorKey, hslValue, isActive, onToggle }: Readonly<ColorItemProps>) {
  return (
    <button
      type="button"
      onClick={() => onToggle(colorKey)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-1.5",
        "cursor-pointer transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      <div
        className="border-border h-5 w-5 shrink-0 rounded-md border"
        style={{ background: `hsl(${hslValue})` }}
      />
      <span className="text-foreground text-sm">
        {COLOR_LABELS[colorKey]}
      </span>
    </button>
  )
}
