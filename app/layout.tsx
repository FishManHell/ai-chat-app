import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/shared/ui/sonner"
import { SessionProvider } from "@/shared/lib/session-provider"
import { ThemeProvider } from "@/entities/theme/components/ThemeProvider"
import "./globals.css"
import { ReactNode } from "react"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Personal AI chat assistant powered by Google Gemini",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ai-chat-theme");if(t){var c=JSON.parse(t).colors,m={background:"--background",foreground:"--foreground",card:"--card",cardForeground:"--card-foreground",primary:"--primary",primaryForeground:"--primary-foreground",secondary:"--secondary",secondaryForeground:"--secondary-foreground",muted:"--muted",mutedForeground:"--muted-foreground",accent:"--accent",accentForeground:"--accent-foreground",border:"--border",input:"--input",ring:"--ring"};for(var k in m)if(c[k])document.documentElement.style.setProperty(m[k],c[k])}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
