export function parseThemeCookie(raw: string): Record<string, string> | undefined {
  try {
    const colors = JSON.parse(atob(raw))
    const styles: Record<string, string> = {}
    for (const [key, value] of Object.entries(colors)) {
      const cssVar = "--" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
      styles[cssVar] = value as string
    }
    return styles
  } catch {
    return undefined
  }
}
