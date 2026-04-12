# AI Chat App

A full-stack AI chat application built with Next.js, React, and Google Gemini. Personal, self-hosted, portfolio-ready — like ChatGPT, but yours.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn/UI |
| Auth | NextAuth.js (Credentials + Google OAuth) |
| AI | Google Gemini via Vercel AI SDK |
| Database | MongoDB + Mongoose |
| Testing | Vitest + React Testing Library |

## Features

- Real-time AI chat with streaming responses
- User authentication (email/password + Google)
- Chat history management (create, rename, delete)
- Custom theme system with color picker (Aurora theme)
- Responsive design (mobile, tablet, desktop)

## Architecture

Adapted Feature-Sliced Design for Next.js App Router:

```
app/ → widgets/ → features/ → entities/ → shared/
```

## Getting Started

```bash
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

## Environment Variables

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## License

MIT
