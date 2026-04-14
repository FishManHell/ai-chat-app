import { cn } from "@/shared/lib/utils"
import type { CustomTheme } from "@/entities/theme/types"

const PREVIEW_KEYS = ["primary", "secondary", "accent"] as const

interface PresetCardProps {
  preset: CustomTheme
  onSelect: (preset: CustomTheme) => void
}

export function PresetCard({ preset, onSelect }: Readonly<PresetCardProps>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl p-3",
        "border border-border bg-input",
        "cursor-pointer transition-all duration-200",
        "hover:border-primary/50"
      )}
    >
      <div className="flex gap-1">
        {PREVIEW_KEYS.map((key) => (
          <div
            key={key}
            className="h-4 w-4 rounded-full border border-border"
            style={{ background: `hsl(${preset.colors[key]})` }}
          />
        ))}
      </div>
      <span className="text-xs text-foreground">{preset.name}</span>
    </button>
  )
}
