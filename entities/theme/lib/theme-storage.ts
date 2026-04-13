import type { CustomTheme } from "../types"
import { STORAGE_KEY } from "../types"

export function getSavedTheme(): CustomTheme | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : null
}

export function saveTheme(theme: CustomTheme): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
}

export function removeSavedTheme(): void {
  localStorage.removeItem(STORAGE_KEY)
}
