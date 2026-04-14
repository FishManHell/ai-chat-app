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
import { COLOR_LABELS, DEFAULT_COLORS, PRESETS } from "../lib/constants"
import { PresetCard } from "./PresetCard"
import { ColorItem } from "./ColorItem"

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

  function toggleColor(key: keyof ThemeColors) {
    setActiveColor(activeColor === key ? null : key)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-80 flex-col",
        "border-l border-border bg-card/95 backdrop-blur-xl",
        "animate-in slide-in-from-right duration-300"
      )}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Presets</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <PresetCard key={preset.name} preset={preset} onSelect={handlePreset} />
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Customize</p>
              <div className="flex flex-col gap-1">
                {(Object.keys(COLOR_LABELS) as Array<keyof ThemeColors>).map((key) => (
                  <ColorItem
                    key={key}
                    colorKey={key}
                    hslValue={colors[key]}
                    isActive={activeColor === key}
                    onToggle={toggleColor}
                  />
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
