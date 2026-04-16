"use client"

import { useState, useRef } from "react"
import { HexColorPicker } from "react-colorful"
import { Palette, RotateCcw, X } from "lucide-react"
import { Button } from "@/shared/ui/button"

import { styles } from "./ThemeCustomizer.styles"
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
  const savedColorsRef = useRef<ThemeColors>(colors)

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
    setActiveColor(null)
  }

  function handleSave() {
    saveTheme({ name: "Custom", colors })
    savedColorsRef.current = colors
    onClose()
  }

  function handleClose() {
    setColors(savedColorsRef.current)
    applyThemeColors(savedColorsRef.current)
    setActiveColor(null)
    onClose()
  }

  function handleReset() {
    removeSavedTheme()
    resetThemeColors()
    setColors(DEFAULT_COLORS)
    savedColorsRef.current = DEFAULT_COLORS
    setActiveColor(null)
  }

  function toggleColor(key: keyof ThemeColors) {
    setActiveColor(activeColor === key ? null : key)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={handleClose} />

      <div className={styles.panel}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Palette className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">Theme</h2>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-border" />

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">Presets</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <PresetCard key={preset.name} preset={preset} onSelect={handlePreset} />
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">Customize</p>
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
                  <span className="text-muted-foreground text-xs">
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
            className="border-border bg-input text-foreground flex-1 cursor-pointer gap-1 rounded-xl"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            className={styles.saveButton}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  )
}
