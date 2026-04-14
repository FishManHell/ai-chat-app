import { describe, it, expect, beforeEach } from "vitest"
import { hexToHsl, hslToHex, applyThemeColors, resetThemeColors } from "../apply-theme"
import type { ThemeColors } from "@/entities/theme/types"

describe("hexToHsl", () => {
  it("converts a color correctly", () => {
    expect(hexToHsl("#ff0000")).toBe("0 100% 50%")
  })

  it("handles hex without #", () => {
    expect(hexToHsl("ff0000")).toBe("0 100% 50%")
  })

  it("returns fallback for invalid input", () => {
    expect(hexToHsl("invalid")).toBe("0 0% 0%")
  })
})

describe("hslToHex", () => {
  it("converts a color correctly", () => {
    expect(hslToHex("0 100% 50%")).toBe("#ff0000")
  })

  it("returns fallback for invalid input", () => {
    expect(hslToHex("invalid")).toBe("#000000")
  })
})

describe("hexToHsl <-> hslToHex roundtrip", () => {
  it("roundtrips with minimal rounding drift", () => {
    const hex = "#ff8800"
    expect(hslToHex(hexToHsl(hex))).toBe(hex)
  })
})

describe("applyThemeColors", () => {
  beforeEach(() => {
    document.documentElement.style.cssText = ""
  })

  it("sets CSS variables on document root", () => {
    const colors: ThemeColors = {
      background: "#0F0B1E",
      foreground: "#F0EBF4",
      card: "#1A1530",
      cardForeground: "#F0EBF4",
      primary: "#E8935A",
      primaryForeground: "#0F0B1E",
      secondary: "#C17AEF",
      secondaryForeground: "#F0EBF4",
      muted: "#1A1530",
      mutedForeground: "#9B8FB0",
      accent: "#7B8CED",
      accentForeground: "#F0EBF4",
      border: "#2D2650",
      input: "#140F28",
      ring: "#E8935A",
    }

    applyThemeColors(colors)

    const root = document.documentElement
    expect(root.style.getPropertyValue("--primary")).toBe("#E8935A")
    expect(root.style.getPropertyValue("--background")).toBe("#0F0B1E")
  })
})

describe("resetThemeColors", () => {
  it("removes all theme CSS variables", () => {
    const root = document.documentElement
    root.style.setProperty("--background", "#000")
    root.style.setProperty("--primary", "#fff")

    resetThemeColors()

    expect(root.style.getPropertyValue("--background")).toBe("")
    expect(root.style.getPropertyValue("--primary")).toBe("")
  })
})
