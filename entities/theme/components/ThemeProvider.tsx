"use client"

import {ReactNode, useEffect} from "react"
import { getSavedTheme } from "../lib/theme-storage"
import { applyThemeColors } from "@/features/customize-theme/lib/apply-theme"

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    const saved = getSavedTheme()
    if (saved) {
      applyThemeColors(saved.colors)
    }
  }, [])

  return <>{children}</>
}
