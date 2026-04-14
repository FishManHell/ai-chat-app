import type { ThemeColors } from "@/entities/theme/types"
import { CSS_VAR_MAP } from "./constants"

export function applyThemeColors(colors: ThemeColors) {
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    const value = colors[key as keyof ThemeColors]
    if (value) {
      root.style.setProperty(cssVar, value)
    }
  }
}

export function resetThemeColors() {
  const root = document.documentElement
  for (const cssVar of Object.values(CSS_VAR_MAP)) {
    root.style.removeProperty(cssVar)
  }
}

function parseHex(hex: string): [red: number, green: number, blue: number] | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!match) return null
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ]
}

function rgbToHsl(red: number, green: number, blue: number) {
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) return { hue: 0, saturation: 0, lightness }

  const saturation = lightness > 0.5
    ? delta / (2 - max - min)
    : delta / (max + min)

  let hue = 0
  if (max === red) hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6
  else if (max === green) hue = ((blue - red) / delta + 2) / 6
  else hue = ((red - green) / delta + 4) / 6

  return { hue, saturation, lightness }
}

function hueToRgbChannel(base: number, chroma: number, offset: number): number {
  const t = offset < 0 ? offset + 1 : offset > 1 ? offset - 1 : offset
  if (t < 1 / 6) return base + (chroma - base) * 6 * t
  if (t < 1 / 2) return chroma
  if (t < 2 / 3) return base + (chroma - base) * (2 / 3 - t) * 6
  return base
}

function channelToHex(value: number): string {
  return Math.round(value * 255).toString(16).padStart(2, "0")
}

// Convert HEX to HSL string (without "hsl()" wrapper, just "H S% L%")
export function hexToHsl(hex: string): string {
  const rgb = parseHex(hex)
  if (!rgb) return "0 0% 0%"

  const { hue, saturation, lightness } = rgbToHsl(...rgb)

  return `${Math.round(hue * 360)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`
}

// Convert HSL string ("H S% L%") to HEX
export function hslToHex(hsl: string): string {
  const parts = hsl.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return "#000000"

  const hue = parseFloat(parts[0]) / 360
  const saturation = parseFloat(parts[1]) / 100
  const lightness = parseFloat(parts[2]) / 100

  if (saturation === 0) {
    const gray = channelToHex(lightness)
    return `#${gray}${gray}${gray}`
  }

  const chroma = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation
  const base = 2 * lightness - chroma

  const red = hueToRgbChannel(base, chroma, hue + 1 / 3)
  const green = hueToRgbChannel(base, chroma, hue)
  const blue = hueToRgbChannel(base, chroma, hue - 1 / 3)

  return `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`
}
