# Frontend Reference

Patterns and rules for building UI with React, Shadcn/UI, Tailwind CSS,
and Vercel AI SDK.

---

## Component Conventions

- **Arrow functions** for all components
- **Pages/layouts**: `export default` at the bottom of the file
- **Feature/entity components**: named export at the bottom
- **Props**: define clean interface, apply `Readonly<>` in function params
- **Server Components** by default. Add `"use client"` only for hooks, events, browser APIs
- Split when possible — server fetches data, passes to client component

---

## Shadcn/UI

- Components live in `shared/ui/`, configured via `components.json`
- Install: `npx shadcn@latest add <component> -y`
- Always use CSS variable classes (`bg-primary`, `text-foreground`) — never hardcode hex
- `cn()` from `shared/lib/utils` for merging Tailwind classes

---

## Chat UI

### Data flow

Server component (`app/chat/page.tsx`) fetches chats → passes to
client widget `ChatWindow` → manages `useChat` hook from `@ai-sdk/react`.

### AI SDK v4 API (important — differs from older docs)

- Send: `sendMessage({ text })` — NOT `handleSubmit`
- Status: `status` = `"ready" | "submitted" | "streaming" | "error"` — NOT `isLoading`
- Messages: `message.parts` array with `{ type: "text", text }` — NOT `.content`
- Transport: `DefaultChatTransport` from `"ai"` with `api` and `body` options
- Server: `convertToModelMessages()` before passing to `streamText()`
- Response: `result.toUIMessageStreamResponse()`

### New chat redirect

After first message (no chatId) → `onFinish` fetches `/api/chat/latest`
→ redirects to `/chat/[newChatId]` so next messages go to the same chat.

---

## Custom Theme System

### Architecture

1. CSS variables in `globals.css` — HSL format without wrapper (`258 40% 8%`)
2. Blocking `<script>` in `<head>` reads localStorage and applies vars before render (prevents FOUC)
3. `ThemeProvider` applies saved theme on mount as fallback
4. `ThemeCustomizer` — slide-in panel with presets + react-colorful color picker
5. Changes preview in real-time, persist only on Save button click

### Key files

- `entities/theme/types.ts` — ThemeColors, CustomTheme
- `entities/theme/lib/theme-storage.ts` — localStorage read/save/remove
- `entities/theme/components/ThemeProvider.tsx` — applies on mount
- `features/customize-theme/lib/apply-theme.ts` — CSS var setter, hex↔hsl converters
- `features/customize-theme/components/ThemeCustomizer.tsx` — UI panel

### Adding a new color

Add CSS variable in `globals.css` → add to `@theme inline` block →
add to `ThemeColors` interface → add to mapping in `apply-theme.ts`
and blocking script in `layout.tsx`.

---

## Design Tokens

### Color palette (default dark theme)

- Background: `#0F0B1E`, Card: `#1A1530`, Border: `#2D2650`
- Primary (amber): `#E8935A`, Secondary (violet): `#C17AEF`, Accent (blue): `#7B8CED`
- Text: `#F0EBF4`, Muted text: `#9B8FB0`, Input bg: `#140F28`
- Gradient: amber → violet → blue (used on buttons, logo, glow effects)

### Glassmorphism

Card bg 85% opacity + border 60% opacity + `backdrop-blur: 40px` + soft shadow.
Use `@supports (backdrop-filter: blur(8px))` fallback for Firefox.

### Spacing & radius

- Cards: `rounded-3xl` (24px), buttons/inputs: `rounded-xl` (12px), messages: `rounded-2xl` (16px)
- Font: Inter (latin + cyrillic)

---

## Responsive Design

Mobile-first approach. Sidebar hidden below `md`, toggled with hamburger.

| Breakpoint | Layout |
|-----------|--------|
| < 768px   | No sidebar, full-width chat, hamburger menu |
| ≥ 768px   | Sidebar appears, two-column layout |
| ≥ 1024px  | Wider sidebar, centered chat area |

- Use `h-[100dvh]` for full height (accounts for mobile browser chrome)
- Use `gap` in flex/grid, not margins
- `suppressHydrationWarning` on `<html>` and `<body>` for theme script

---

## Styling Rules

- Group Tailwind classes by concern in `cn()`: layout → appearance → state → interaction
- All colors through CSS variables — custom theme breaks with hardcoded values
- Glow shadows on primary buttons: `shadow-lg shadow-[var(--glow-primary)]`
- Transitions: `transition-all duration-200` for hover effects

---

## External Docs

- Shadcn/UI: https://ui.shadcn.com/docs
- Vercel AI SDK: https://ai-sdk.dev/docs/introduction
- Tailwind CSS v4: https://tailwindcss.com/docs
- react-colorful: https://github.com/omgovich/react-colorful
