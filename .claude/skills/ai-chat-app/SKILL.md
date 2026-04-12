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

| Layer       | Technology                         |
|------------|-------------------------------------|
| Framework  | Next.js (App Router)                |
| UI         | React + TypeScript                  |
| Styling    | Tailwind CSS                        |
| Components | Shadcn/UI                           |
| Auth       | NextAuth.js (Credentials + Google)  |
| AI         | Google Gemini API via Vercel AI SDK  |
| Database   | MongoDB + Mongoose                  |
| Testing    | Vitest + React Testing Library      |

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
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── chat/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [chatId]/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── chat/
│           ├── route.ts
│           └── [chatId]/route.ts
│
├── widgets/                          # Page-level compositions
│   └── chat/
│       └── ChatWindow.tsx
│
├── features/                         # User actions
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── lib/
│   │       └── auth-actions.ts
│   ├── send-message/
│   │   ├── components/
│   │   │   └── ChatInput.tsx
│   │   └── lib/
│   │       └── send-message.ts
│   ├── manage-chats/
│   │   ├── components/
│   │   │   └── ChatSidebar.tsx
│   │   └── lib/
│   │       └── chat-actions.ts
│   └── customize-theme/
│       ├── components/
│       │   ├── ThemeCustomizer.tsx    # Panel with color pickers
│       │   └── ColorPicker.tsx
│       └── lib/
│           └── apply-theme.ts        # Writes CSS variables to :root
│
├── entities/                         # Business data & base components
│   ├── user/
│   │   ├── components/
│   │   │   └── UserAvatar.tsx
│   │   ├── lib/
│   │   │   └── auth-config.ts
│   │   └── types.ts
│   ├── chat/
│   │   ├── components/
│   │   │   └── ChatItem.tsx
│   │   └── types.ts
│   ├── message/
│   │   ├── components/
│   │   │   └── MessageBubble.tsx
│   │   └── types.ts
│   └── theme/
│       ├── components/
│       │   └── ThemeProvider.tsx      # Applies saved theme on load
│       ├── lib/
│       │   └── theme-storage.ts      # Read/write localStorage
│       └── types.ts
│
├── shared/                           # Used by everything
│   ├── ui/                           # Shadcn/UI components
│   ├── lib/
│   │   ├── db.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
│
├── models/                           # Mongoose models (server-only)
│   ├── User.ts
│   └── Chat.ts
│
└── middleware.ts
```

### What goes where

- **`app/`** — routing and page shells only. Import from widgets/features.
- **`widgets/`** — large compositions combining multiple features/entities.
- **`features/`** — user actions, self-contained with own components and logic.
- **`entities/`** — business objects, their types and base display components.
- **`shared/`** — UI kit (Shadcn/UI), utilities, common types.
- **`models/`** — Mongoose schemas, server-side only.

## Import Rules

**Within the same slice — relative path:**
```tsx
import type { Message } from "../types"
import { formatTime } from "../lib/utils"
```

**Between layers — absolute path with @/:**
```tsx
import { MessageBubble } from "@/entities/message/components/MessageBubble"
import { Button } from "@/shared/ui/button"
```

Cross-feature imports are forbidden. If shared logic is needed, move it
down to entities/ or shared/.

## TypeScript Rules

### Types live separately
Every slice has its own `types.ts`. Shared reusable types go in
`shared/types/index.ts`. Never define types inside components.

### as const over enum
```tsx
const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const

type MessageRole = typeof MESSAGE_ROLES[keyof typeof MESSAGE_ROLES]
```

Enums compile into runtime objects and hurt tree-shaking. Always use
`as const` with union types.

### Utility types for data transformations
Derive types from base types instead of duplicating:
```tsx
export interface Message {
  readonly id: string
  readonly chatId: string
  readonly role: MessageRole
  readonly content: string
  readonly createdAt: Date
}

export type CreateMessageDTO = Omit<Message, "id" | "createdAt">
export type UpdateMessageDTO = Partial<Pick<Message, "content">>
```

### Key practices
- `readonly` for immutable data (API responses, props)
- `ReadonlyArray<T>` for immutable arrays
- `import type` for type-only imports
- Generics in custom hooks and utility functions
- Proper utility types (`Omit`, `Pick`, `Partial`, `Record`) over duplicated interfaces

## Clean JSX

Keep JSX readable. Group Tailwind classes with `cn()`:
```tsx
const containerStyles = cn(
  "flex items-center justify-between p-4",
  "bg-white rounded-lg shadow-md",
  "hover:shadow-lg transition-all duration-200"
)
```

## Component Pattern

1. Imports (with `import type` for types)
2. Types (only if truly component-specific)
3. Component function
4. Export

Use `"use client"` only for browser APIs, event handlers, or hooks.
Server Components are the default.

## Authentication

Two providers via NextAuth:

**Credentials** — registration (username, email, password with bcrypt hash),
login (email + password), JWT session strategy.

**Google OAuth** — "Sign in with Google" button, no password needed.

If same email used for both methods — accounts are linked (one User, two
auth methods).

Read `references/backend.md` for full NextAuth configuration.

## Custom Themes

Full color customization via color picker. Theme is stored in localStorage
and applied on load. If no saved theme exists — default light theme is used.

Read `references/frontend.md` for theme system implementation.

## AI Streaming

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

- `references/frontend.md` — Shadcn/UI, chat UI patterns, component details
- `references/backend.md` — API routes, NextAuth config, Vercel AI SDK
- `references/testing.md` — test patterns for components, hooks, API routes

## External Docs

- FSD architecture: https://feature-sliced.design/docs/get-started/overview
- Next.js: https://nextjs.org/docs
- Shadcn/UI: https://ui.shadcn.com/docs
- Vercel AI SDK: https://ai-sdk.dev/docs/introduction
- NextAuth: https://next-auth.js.org/getting-started/example
- Mongoose: https://mongoosejs.com/
- Google Gemini: https://ai.google.dev/
