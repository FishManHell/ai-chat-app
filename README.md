# AI Chat App

A full-stack AI chat application built with Next.js, React, and Google Gemini. Personal, self-hosted, portfolio-ready — like ChatGPT, but yours.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Components | Shadcn/UI |
| Auth | NextAuth.js (Credentials + Google OAuth) |
| AI | Google Gemini 2.5 Flash via Vercel AI SDK v4 |
| Database | MongoDB Atlas + Mongoose |

## Features

- Real-time AI chat with streaming responses
- User authentication (email/password + Google OAuth)
- Chat history management (create, delete)
- Custom theme system with color picker and presets
- Glassmorphism dark UI with aurora gradient accents
- Responsive design (mobile, tablet, desktop)
- Rate limiting and input sanitization

## Architecture

Adapted Feature-Sliced Design for Next.js App Router:

```
app/ → widgets/ → features/ → entities/ → shared/
```

## Getting Started

```bash
yarn install
cp .env.example .env.local  # fill in your keys
yarn dev
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
