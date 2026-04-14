import type { CustomTheme, ThemeColors } from "../types"
import { STORAGE_KEY } from "../types"

const COOKIE_KEY = "ai-chat-theme-colors"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function getSavedTheme(): CustomTheme | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : null
}

export function saveTheme(theme: CustomTheme): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  const encoded = btoa(JSON.stringify(theme.colors))
  document.cookie = `${COOKIE_KEY}=${encoded};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}

export function removeSavedTheme(): void {
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = `${COOKIE_KEY}=;path=/;max-age=0`
}
