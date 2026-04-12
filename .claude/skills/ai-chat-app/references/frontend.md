# Frontend Reference

Detailed patterns for building the chat UI with React, Shadcn/UI,
Tailwind CSS, and Vercel AI SDK client hooks.

## Table of Contents

1. [Shadcn/UI Setup](#shadcnui-setup)
2. [Component Patterns](#component-patterns)
3. [Chat UI](#chat-ui)
4. [Streaming with useChat](#streaming-with-usechat)
5. [Custom Theme System](#custom-theme-system)
6. [Responsive Design](#responsive-design)
7. [Styling Patterns](#styling-patterns)

---

## Shadcn/UI Setup

Shadcn/UI is not a package — it copies component source code into your
project. Components live in `shared/ui/` and are fully customizable.

Install components as needed:
```bash
npx shadcn@latest add button input textarea avatar card scroll-area
npx shadcn@latest add dropdown-menu dialog toast sonner popover
```

Configure `components.json` to use the `shared/ui/` path:
```json
{
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/lib/utils"
  }
}
```

The `cn()` utility merges Tailwind classes and resolves conflicts:
```tsx
import { cn } from "@/shared/lib/utils"

cn("p-4 bg-white", isActive && "bg-blue-500", className)
```

---

## Component Patterns

### Server vs Client Components

Default to Server Components. Add `"use client"` only when needed:

| Needs                          | Component Type |
|-------------------------------|----------------|
| Static display, data fetching | Server         |
| onClick, onChange, onSubmit   | Client         |
| useState, useEffect, useRef  | Client         |
| useChat, useRouter            | Client         |

Split when possible — server-render the data, pass it to a client component
for interactivity:

```tsx
// app/chat/page.tsx — Server Component
import { ChatWindow } from "@/widgets/chat/ChatWindow"
import { getChats } from "@/features/manage-chats/lib/chat-actions"

export default async function ChatPage() {
  const chats = await getChats()
  return <ChatWindow initialChats={chats} />
}

// widgets/chat/ChatWindow.tsx — Client Component (needs interactivity)
"use client"
```

### Props Pattern

Use `interface` for props with `readonly`:

```tsx
import type { Chat } from "@/entities/chat/types"

interface ChatSidebarProps {
  readonly chats: ReadonlyArray<Chat>
  readonly activeChatId?: string
  readonly onChatSelect: (chatId: string) => void
  readonly onChatDelete: (chatId: string) => void
  readonly onNewChat: () => void
}
```

### Loading States

Use Shadcn/UI `Skeleton` for loading placeholders:
```tsx
import { Skeleton } from "@/shared/ui/skeleton"

function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    </div>
  )
}
```

---

## Chat UI

### Layout Structure

```
┌──────────┬─────────────────────────┐
│          │                         │
│ Sidebar  │     Chat Messages       │
│          │                         │
│ - Chats  │  ┌───────────────────┐  │
│ - New    │  │ MessageBubble     │  │
│ - Delete │  │ MessageBubble     │  │
│          │  │ MessageBubble     │  │
│          │  │ ...               │  │
│          │  └───────────────────┘  │
│          │                         │
│          │  ┌───────────────────┐  │
│          │  │ ChatInput         │  │
│          │  └───────────────────┘  │
└──────────┴─────────────────────────┘
```

Widget `ChatWindow` composes everything:
```tsx
"use client"

export function ChatWindow({ initialChats }: ChatWindowProps) {
  return (
    <div className="flex h-screen">
      <ChatSidebar chats={initialChats} />
      <main className="flex flex-1 flex-col">
        <ChatMessages />
        <ChatInput />
      </main>
    </div>
  )
}
```

### ChatSidebar (features/manage-chats)

Key behaviors:
- List all user chats, sorted by most recent
- "New Chat" button at the top
- Each chat shows title (first message or "New Chat")
- Delete button on hover
- Active chat is highlighted
- On mobile: sidebar hidden, toggle with hamburger button

### MessageBubble (entities/message)

Two visual variants — user and assistant:
- User messages: aligned right, colored background
- Assistant messages: aligned left, neutral background, avatar
- Markdown rendering in assistant messages (use `react-markdown`)
- Timestamp shown on hover

### ChatInput (features/send-message)

Key behaviors:
- Textarea that grows with content (up to max height, then scroll)
- Send on Enter, new line on Shift+Enter
- Send button disabled when input is empty or AI is responding
- Loading indicator while AI is streaming

---

## Streaming with useChat

The `useChat` hook from `@ai-sdk/react` handles the full chat lifecycle:

```tsx
"use client"
import { useChat } from "@ai-sdk/react"

export function ChatInput({ chatId }: { chatId?: string }) {
  const {
    messages,           // all messages in conversation
    input,              // current input value
    handleInputChange,  // onChange for textarea
    handleSubmit,       // onSubmit for form
    isLoading,          // true while AI is responding
    stop,               // cancel streaming
    error,              // error if request failed
  } = useChat({
    api: "/api/chat",
    body: { chatId },
    onFinish: (message) => {
      // called when AI finishes responding
      // save message to DB here
    },
    onError: (error) => {
      // show toast notification
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      {/* render messages and input */}
    </form>
  )
}
```

Important: `useChat` manages its own message state. Do not duplicate it
with a separate `useState` for messages — use `messages` from the hook.

For existing chats, load previous messages with `initialMessages`:
```tsx
useChat({
  api: "/api/chat",
  initialMessages: previousMessages,  // loaded from DB
})
```

---

## Custom Theme System

Full color customization through a color picker. The user picks any colors
they want and the theme is saved in localStorage.

### Entity: theme

```tsx
// entities/theme/types.ts
export interface ThemeColors {
  readonly background: string         // HSL: "0 0% 100%"
  readonly foreground: string
  readonly primary: string
  readonly primaryForeground: string
  readonly secondary: string
  readonly secondaryForeground: string
  readonly muted: string
  readonly mutedForeground: string
  readonly accent: string
  readonly accentForeground: string
  readonly border: string
  readonly input: string
  readonly ring: string
}

export interface CustomTheme {
  readonly name: string
  readonly colors: ThemeColors
}

const STORAGE_KEY = "ai-chat-theme" as const
```

### Storage (entities/theme/lib/theme-storage.ts)

```tsx
import type { CustomTheme } from "../types"

const STORAGE_KEY = "ai-chat-theme"

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
```

### Provider (entities/theme/components/ThemeProvider.tsx)

Wraps the app. On mount, reads localStorage and applies CSS variables:

```tsx
"use client"
import { useEffect } from "react"
import { getSavedTheme } from "../lib/theme-storage"
import type { ThemeColors } from "../types"

function applyColors(colors: ThemeColors) {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    // camelCase to kebab-case: primaryForeground → primary-foreground
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = getSavedTheme()
    if (saved) applyColors(saved.colors)
  }, [])

  return <>{children}</>
}
```

### Feature: customize-theme

ThemeCustomizer opens as a panel/dialog with color pickers for each
theme variable. Use a color picker library like `react-colorful` (small,
no dependencies) to let users pick any color.

Convert the picked HEX color to HSL before saving — Shadcn/UI CSS
variables use HSL format without the `hsl()` wrapper.

Provide a few preset themes (light, dark, blue, green) as starting
points the user can customize further.

Include a "Reset to default" button that calls `removeSavedTheme()`
and reloads the default CSS variables.

---

## Responsive Design

The app must work correctly across all screen sizes and all major browsers.

### Breakpoints

Mobile-first approach — styles apply to the smallest screens by default,
then override for larger screens:

| Breakpoint | Size     | Layout                                    |
|-----------|----------|-------------------------------------------|
| default   | < 640px  | Phone — full-width, no sidebar, stacked   |
| `sm`      | ≥ 640px  | Large phone — minor spacing adjustments   |
| `md`      | ≥ 768px  | Tablet — sidebar appears, two-column      |
| `lg`      | ≥ 1024px | Laptop — wider sidebar, centered chat     |
| `xl`      | ≥ 1280px | Desktop — max-width container, balanced   |
| `2xl`     | ≥ 1536px | Large screen — comfortable max-width      |

```tsx
// Sidebar: hidden on mobile, visible from tablet
<aside className="hidden md:flex md:w-56 lg:w-64 xl:w-72 flex-col border-r">

// Mobile menu toggle
<Button className="md:hidden" onClick={toggleSidebar}>
  <Menu />
</Button>

// Chat area: adapts to screen width
<div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">

// Message bubble: responsive padding and font size
<div className={cn(
  "p-3 sm:p-4 rounded-lg",
  "text-sm sm:text-base"
)}>
```

Every component must be tested at all breakpoints. Use flexible units
(`%`, `rem`, `vh/dvh`) over fixed `px` for layout dimensions. Use `dvh`
(dynamic viewport height) instead of `vh` on mobile to account for
browser chrome.

### Cross-Browser Compatibility

Target browsers: Chrome, Firefox, Safari, Edge (latest 2 versions).

Rules to follow:
- Use `gap` in flex/grid — supported everywhere now, prefer over margins
- Use `dvh` with `vh` fallback: `h-[100vh] h-[100dvh]`
- Avoid `-webkit-` prefixes manually — Tailwind + autoprefixer handle this
- Test `backdrop-blur` in Firefox (may need fallback background)
- Test `scroll-behavior: smooth` in Safari
- Use `@supports` for features with partial support:

```css
/* Fallback for browsers without backdrop-blur */
.sidebar {
  background: rgba(255, 255, 255, 0.95);
}

@supports (backdrop-filter: blur(8px)) {
  .sidebar {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
  }
}
```

PostCSS with `autoprefixer` is included in Next.js by default — vendor
prefixes are added automatically at build time.

---

## Styling Patterns

### Grouping Tailwind classes

Organize by concern for readability:
```tsx
const messageStyles = cn(
  // layout
  "flex gap-3 p-4",
  // appearance
  "rounded-lg border",
  // variants
  isUser ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12",
  // interaction
  "transition-colors hover:bg-opacity-90"
)
```

### Shadcn/UI theming variables

Use CSS variables from Shadcn/UI theme instead of hardcoded colors.
This ensures the custom theme system works correctly:
```tsx
// ✅ theme-aware — respects custom colors
"bg-primary text-primary-foreground"
"bg-muted text-muted-foreground"
"border-border"

// ❌ hardcoded — ignores custom theme
"bg-blue-500 text-white"
"bg-gray-100 text-gray-900"
```

This is critical for the custom theme system — every component must use
CSS variable classes so that color picker changes are reflected everywhere.
