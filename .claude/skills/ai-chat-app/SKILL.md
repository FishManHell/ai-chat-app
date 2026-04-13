---
name: ai-chat-app
description: >
  Build an AI chat application with Next.js, React, TypeScript, Shadcn/UI,
  NextAuth (Credentials + Google OAuth), and Google Gemini via Vercel AI SDK.
  Uses adapted Feature-Sliced Design architecture with strict typing rules.
  Use this skill when the user works on the AI Chat App project — creating
  pages, components, API routes, authentication, chat UI, streaming responses,
  or any feature related to this application. Also trigger when the user
  mentions "chat app", "ai chat", "chat interface", or references Shadcn/UI
  components, NextAuth config, or Vercel AI SDK streaming in context of
  this project.
---

# AI Chat App

A full-stack AI chat application where users communicate with an AI assistant.
Similar to ChatGPT — personal, self-hosted, portfolio-ready.

## Stack

| Layer       | Technology                                    |
|------------|------------------------------------------------|
| Framework  | Next.js 16 (App Router, Turbopack)             |
| UI         | React 19 + TypeScript                          |
| Styling    | Tailwind CSS v4                                |
| Components | Shadcn/UI (base-nova style)                    |
| Auth       | NextAuth.js (Credentials + Google)             |
| AI         | Google Gemini 2.5 Flash via Vercel AI SDK v4   |
| Database   | MongoDB Atlas + Mongoose                       |
| Font       | Inter (latin + cyrillic)                       |

## Architecture: Adapted FSD for Next.js

The project follows Feature-Sliced Design adapted for Next.js App Router.
Layers can only import from layers below them:

```
app/ → widgets/ → features/ → entities/ → shared/
```

Never import upward. A feature can use an entity, but an entity must never
import from a feature. If two features need to share something, move it
down to entities/ or shared/.

## Project Structure

```
ai-chat-app/
├── app/                              # Routing only, minimal logic
│   ├── layout.tsx                    # Root: Inter font, SessionProvider, ThemeProvider, Toaster, FOUC script
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # CSS variables, theme tokens, scrollbar
│   ├── (auth)/
│   │   ├── layout.tsx                # Glassmorphism auth layout with glow blobs
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── chat/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Server: fetches chats, renders ChatWindow
│   │   └── [chatId]/page.tsx         # Server: loads chat + messages from DB
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       └── chat/
│           ├── route.ts              # POST: stream AI response, save to DB
│           ├── [chatId]/route.ts     # DELETE: remove chat
│           └── latest/route.ts       # GET: latest chat ID for redirect
│
├── widgets/                          # Page-level compositions
│   └── chat/
│       └── ChatWindow.tsx            # useChat + DefaultChatTransport, messages, input, sidebar
│
├── features/                         # User actions
│   ├── auth/components/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── send-message/components/
│   │   └── ChatInput.tsx             # Auto-growing textarea, own useState for input
│   ├── manage-chats/
│   │   ├── components/ChatSidebar.tsx  # Responsive sidebar, chat list, user section
│   │   └── lib/chat-actions.ts         # Server actions: getChats, deleteChat
│   └── customize-theme/
│       ├── components/ThemeCustomizer.tsx  # Slide-in panel, presets, react-colorful picker
│       └── lib/apply-theme.ts             # CSS var setter, hex↔hsl converters
│
├── entities/                         # Business data & base components
│   ├── user/
│   │   ├── components/UserAvatar.tsx
│   │   ├── lib/auth-config.ts        # NextAuth options
│   │   └── types.ts
│   ├── chat/
│   │   ├── components/ChatItem.tsx    # div[role="button"] to avoid nested button
│   │   └── types.ts
│   ├── message/
│   │   ├── components/MessageBubble.tsx
│   │   └── types.ts
│   └── theme/
│       ├── components/ThemeProvider.tsx   # Applies saved theme on mount
│       ├── lib/theme-storage.ts          # localStorage read/save/remove
│       └── types.ts                      # ThemeColors, CustomTheme interfaces
│
├── shared/                           # Used by everything
│   ├── ui/                           # Shadcn/UI components (configured via components.json)
│   ├── lib/
│   │   ├── db.ts                     # MongoDB connection (env check inside function)
│   │   ├── utils.ts                  # cn() helper
│   │   ├── rate-limit.ts             # In-memory rate limiter
│   │   ├── sanitize.ts               # sanitize-html wrapper
│   │   └── session-provider.tsx      # Client wrapper for NextAuth SessionProvider
│   └── types/
│       └── next-auth.d.ts            # Session type augmentation
│
├── models/                           # Mongoose models (server-only)
│   ├── User.ts
│   └── Chat.ts
│
└── proxy.ts                          # Next.js 16 proxy config (replaces middleware)
```

### What goes where

- **`app/`** — routing and page shells only. Import from widgets/features.
- **`widgets/`** — large compositions combining multiple features/entities.
- **`features/`** — user actions, self-contained with own components and logic.
- **`entities/`** — business objects, their types and base display components.
- **`shared/`** — UI kit (Shadcn/UI), utilities, common types.
- **`models/`** — Mongoose schemas, server-side only.

## Import Rules

- **Within the same slice** — use relative paths (`../types`, `../lib/utils`)
- **Between layers** — use absolute paths with `@/` prefix (`@/entities/message/components/MessageBubble`, `@/shared/ui/button`)
- Cross-feature imports are forbidden. If shared logic is needed, move it down to entities/ or shared/.

## TypeScript Rules

### Types live separately
Every slice has its own `types.ts`. Shared reusable types go in
`shared/types/`. Never define types inside components.

### Props pattern
Define a clean interface for props, then apply `Readonly<>` at the function
parameter level — not `readonly` on each field individually.

### as const over enum
Use `as const` objects with derived union types instead of enums.
Enums compile into runtime objects and hurt tree-shaking.

### Utility types for data transformations
Derive types from base types using `Omit`, `Pick`, `Partial`, `Record`
instead of duplicating interfaces. For example, a create DTO omits `id`
and `createdAt` from the base type.

### Key practices
- `import type` for type-only imports
- Generics in custom hooks and utility functions
- Proper utility types over duplicated interfaces

## Component Conventions

- **Arrow functions** for all components
- **Pages/layouts**: `export default` at the bottom of the file
- **Feature/entity components**: named export at the bottom
- **Server Components** by default. Add `"use client"` only for hooks, events, browser APIs
- Split when possible — server fetches data, passes to client component

## Styling

- Group Tailwind classes by concern in `cn()`: layout → appearance → state → interaction
- All colors through CSS variables — custom theme breaks with hardcoded values
- Use CSS variable classes (`bg-primary`, `text-foreground`) — never hardcode hex
- Glow shadows on primary buttons: `shadow-lg shadow-[var(--glow-primary)]`
- Transitions: `transition-all duration-200` for hover effects

### Design tokens (default dark theme)

- Background: `#0F0B1E`, Card: `#1A1530`, Border: `#2D2650`
- Primary (amber): `#E8935A`, Secondary (violet): `#C17AEF`, Accent (blue): `#7B8CED`
- Text: `#F0EBF4`, Muted text: `#9B8FB0`, Input bg: `#140F28`
- Gradient: amber → violet → blue (buttons, logo, glow effects)
- Glassmorphism: card bg 85% opacity + border 60% opacity + `backdrop-blur: 40px`
- Radius: cards `rounded-3xl`, buttons/inputs `rounded-xl`, messages `rounded-2xl`

### Responsive breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 768px   | No sidebar, full-width chat, hamburger menu |
| ≥ 768px   | Sidebar appears, two-column layout |
| ≥ 1024px  | Wider sidebar, centered chat area |

Use `h-[100dvh]` for full height (mobile browser chrome).

## Authentication

Two providers via NextAuth:

**Credentials** — registration (username, email, password with bcrypt hash),
login (email + password), JWT session strategy.

**Google OAuth** — "Sign in with Google" button, no password needed.

If same email used for both methods — accounts are linked (one User, two
auth methods).

Read `references/backend.md` for full NextAuth configuration.

## Custom Themes

Full color customization via react-colorful color picker. Theme is stored
in localStorage and applied on load. Blocking `<script>` in `<head>`
prevents FOUC by reading localStorage before first render. Changes preview
in real-time but persist only on Save button click. 4 built-in presets
(Default, Midnight Ocean, Forest, Rose Gold) + individual color editing.

Read `references/frontend.md` for theme system details.

## AI Streaming

Uses Vercel AI SDK v4 with important API differences from older versions:
- `sendMessage({ text })` instead of `handleSubmit`
- `status` field (`"ready" | "submitted" | "streaming" | "error"`) instead of `isLoading`
- `message.parts` array with `{ type: "text", text }` instead of `.content`
- `DefaultChatTransport` for configuring API endpoint
- Server: `convertToModelMessages()` + `streamText()` → `toUIMessageStreamResponse()`

After first message in a new chat, `onFinish` fetches `/api/chat/latest`
and redirects to `/chat/[newChatId]` so subsequent messages go to the same chat.

Read `references/backend.md` for Vercel AI SDK + Gemini setup and
`references/frontend.md` for `useChat` hook patterns.

## Testing

Vitest + React Testing Library. Tests live next to the code in `__tests__/`
directories. Read `references/testing.md` for patterns and examples.

## Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

## References

- `references/frontend.md` — Shadcn/UI, chat UI patterns, theme system, responsive design
- `references/backend.md` — API routes, NextAuth config, Vercel AI SDK
- `references/testing.md` — test patterns for components, hooks, API routes

## External Docs

- FSD architecture: https://feature-sliced.design/docs/get-started/overview
- Next.js: https://nextjs.org/docs
- Shadcn/UI: https://ui.shadcn.com/docs
- Vercel AI SDK: https://ai-sdk.dev/docs/introduction
- Tailwind CSS v4: https://tailwindcss.com/docs
- NextAuth: https://next-auth.js.org/getting-started/example
- Mongoose: https://mongoosejs.com/
- Google Gemini: https://ai.google.dev/
- react-colorful: https://github.com/omgovich/react-colorful
