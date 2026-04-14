"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Palette, RotateCcw, X } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { ScrollArea } from "@/shared/ui/scroll-area"
import type { ThemeColors, CustomTheme } from "@/entities/theme/types"
import { getSavedTheme, saveTheme, removeSavedTheme } from "@/entities/theme/lib/theme-storage"
import { applyThemeColors, resetThemeColors, hexToHsl, hslToHex } from "../lib/apply-theme"

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  background: "Background",
  foreground: "Text",
  card: "Card",
  cardForeground: "Card Text",
  primary: "Primary",
  primaryForeground: "Primary Text",
  secondary: "Secondary",
  secondaryForeground: "Secondary Text",
  muted: "Muted",
  mutedForeground: "Muted Text",
  accent: "Accent",
  accentForeground: "Accent Text",
  border: "Border",
  input: "Input",
  ring: "Ring",
}

const DEFAULT_COLORS: ThemeColors = {
  background: "258 40% 8%",
  foreground: "270 30% 94%",
  card: "258 30% 14%",
  cardForeground: "270 30% 94%",
  primary: "22 76% 63%",
  primaryForeground: "258 40% 8%",
  secondary: "275 70% 71%",
  secondaryForeground: "258 40% 8%",
  muted: "258 25% 20%",
  mutedForeground: "268 20% 62%",
  accent: "231 73% 70%",
  accentForeground: "258 40% 8%",
  border: "258 30% 25%",
  input: "258 40% 11%",
  ring: "22 76% 63%",
}

const PRESETS: ReadonlyArray<CustomTheme> = [
  {
    name: "Default",
    colors: DEFAULT_COLORS,
  },
  {
    name: "Midnight Ocean",
    colors: {
      background: "220 40% 7%",
      foreground: "210 30% 94%",
      card: "220 30% 12%",
      cardForeground: "210 30% 94%",
      primary: "200 80% 55%",
      primaryForeground: "220 40% 7%",
      secondary: "180 60% 50%",
      secondaryForeground: "220 40% 7%",
      muted: "220 25% 18%",
      mutedForeground: "215 20% 60%",
      accent: "260 60% 65%",
      accentForeground: "220 40% 7%",
      border: "220 25% 22%",
      input: "220 35% 10%",
      ring: "200 80% 55%",
    },
  },
  {
    name: "Forest",
    colors: {
      background: "150 30% 6%",
      foreground: "140 20% 92%",
      card: "150 25% 11%",
      cardForeground: "140 20% 92%",
      primary: "145 65% 45%",
      primaryForeground: "150 30% 6%",
      secondary: "80 50% 55%",
      secondaryForeground: "150 30% 6%",
      muted: "150 20% 16%",
      mutedForeground: "145 15% 58%",
      accent: "170 55% 50%",
      accentForeground: "150 30% 6%",
      border: "150 20% 20%",
      input: "150 30% 9%",
      ring: "145 65% 45%",
    },
  },
  {
    name: "Rose Gold",
    colors: {
      background: "340 25% 7%",
      foreground: "330 20% 93%",
      card: "340 20% 12%",
      cardForeground: "330 20% 93%",
      primary: "350 70% 65%",
      primaryForeground: "340 25% 7%",
      secondary: "20 60% 60%",
      secondaryForeground: "340 25% 7%",
      muted: "340 18% 17%",
      mutedForeground: "335 15% 58%",
      accent: "310 50% 60%",
      accentForeground: "340 25% 7%",
      border: "340 18% 21%",
      input: "340 25% 10%",
      ring: "350 70% 65%",
    },
  },
]

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeCustomizer({ isOpen, onClose }: Readonly<ThemeCustomizerProps>) {
  const [colors, setColors] = useState<ThemeColors>(() => {
    const saved = getSavedTheme()
    return saved ? saved.colors : DEFAULT_COLORS
  })
  const [activeColor, setActiveColor] = useState<keyof ThemeColors | null>(null)

  function handleColorChange(hex: string) {
    if (!activeColor) return
    const hsl = hexToHsl(hex)
    const updated = { ...colors, [activeColor]: hsl }
    setColors(updated)
    applyThemeColors(updated)
  }

  function handlePreset(theme: CustomTheme) {
    setColors(theme.colors)
    applyThemeColors(theme.colors)
    saveTheme(theme)
    setActiveColor(null)
  }

  function handleSave() {
    saveTheme({ name: "Custom", colors })
    onClose()
  }

  function handleReset() {
    removeSavedTheme()
    resetThemeColors()
    setColors(DEFAULT_COLORS)
    setActiveColor(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-80 flex-col",
        "border-l border-border bg-card/95 backdrop-blur-xl",
        "animate-in slide-in-from-right duration-300"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            {/* Presets */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Presets
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl p-3",
                      "border border-border bg-input",
                      "cursor-pointer transition-all duration-200",
                      "hover:border-primary/50"
                    )}
                  >
                    <div className="flex gap-1">
                      <div
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ background: `hsl(${preset.colors.primary})` }}
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ background: `hsl(${preset.colors.secondary})` }}
                      />
                      <div
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ background: `hsl(${preset.colors.accent})` }}
                      />
                    </div>
                    <span className="text-xs text-foreground">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Color picker */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Customize
              </p>
              <div className="flex flex-col gap-1">
                {(Object.keys(COLOR_LABELS) as Array<keyof ThemeColors>).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveColor(activeColor === key ? null : key)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 py-1.5",
                      "cursor-pointer transition-colors",
                      activeColor === key
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div
                      className="h-5 w-5 shrink-0 rounded-md border border-border"
                      style={{ background: `hsl(${colors[key]})` }}
                    />
                    <span className="text-sm text-foreground">
                      {COLOR_LABELS[key]}
                    </span>
                  </button>
                ))}
              </div>

              {activeColor && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <HexColorPicker
                    color={hslToHex(colors[activeColor])}
                    onChange={handleColorChange}
                    style={{ width: "100%" }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {hslToHex(colors[activeColor])}
                  </span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <Separator className="bg-border" />

        {/* Footer */}
        <div className="flex gap-2 p-4">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer gap-1 rounded-xl border-border bg-input text-foreground"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            className={cn(
              "flex-1 cursor-pointer rounded-xl",
              "bg-gradient-to-r from-[var(--brand-start)] to-[var(--brand-mid)]",
              "text-white shadow-md shadow-[var(--glow-primary)]",
              "hover:opacity-90 transition-all duration-200"
            )}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  )
}
