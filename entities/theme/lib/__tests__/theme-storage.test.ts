import { describe, it, expect, beforeEach } from "vitest"
import { getSavedTheme, saveTheme, removeSavedTheme } from "../theme-storage"
import { STORAGE_KEY } from "../../types"
import type { CustomTheme } from "../../types"

const mockTheme: CustomTheme = {
  name: "Test Theme",
  colors: {
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
  },
}

describe("theme-storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("getSavedTheme", () => {
    it("returns null when no theme saved", () => {
      expect(getSavedTheme()).toBeNull()
    })

    it("returns saved theme", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTheme))
      expect(getSavedTheme()).toEqual(mockTheme)
    })
  })

  describe("saveTheme", () => {
    it("saves theme to localStorage", () => {
      saveTheme(mockTheme)
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored).toEqual(mockTheme)
    })
  })

  describe("removeSavedTheme", () => {
    it("removes theme from localStorage", () => {
      saveTheme(mockTheme)
      removeSavedTheme()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })
})
