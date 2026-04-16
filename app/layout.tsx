import { cookies } from "next/headers"
import { Toaster } from "@/shared/ui/sonner"
import { SessionProvider } from "@/shared/lib/session-provider"
import { inter } from "@/shared/config/fonts"
import { parseThemeCookie } from "@/entities/theme/lib/parse-theme-cookie"
import "./globals.css"
import { ReactNode } from "react"

export { metadata } from "@/shared/config/metadata"

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("ai-chat-theme-colors")
  const themeStyle = themeCookie ? parseThemeCookie(themeCookie.value) : undefined

  return (
    <html lang="en" className={`${inter.variable} h-full`} style={themeStyle} suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-full flex-col antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
