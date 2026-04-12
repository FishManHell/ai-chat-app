# Backend Reference

Architecture decisions and patterns for API routes, authentication,
AI streaming, and server actions.

## API Routes Structure

```
app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth handler
│   └── register/route.ts         # User registration
└── chat/
    ├── route.ts                  # POST: send message + stream AI response
    └── [chatId]/route.ts         # GET: load chat, DELETE: remove chat
```

Every protected route must check session via `getServerSession(authOptions)`
and return 401 if missing. Never trust client-side session alone.

---

## NextAuth Configuration

Config lives in `entities/user/lib/auth-config.ts`.

### Providers

**Credentials** — email + password login. The `authorize` function:
- Validates that email and password are provided
- Connects to DB, finds user by email
- Compares password hash with `bcrypt.compare`
- Returns user object with `id`, `name`, `email`, `avatar`
- Throws error on invalid credentials

**Google OAuth** — uses `GoogleProvider` with `GOOGLE_CLIENT_ID`
and `GOOGLE_CLIENT_SECRET` from env.

### Session strategy: JWT

`maxAge: 30 days`. No database sessions — everything in the token.

### Callbacks

**`jwt` callback** — runs on every token creation/update:
- On first sign in: attaches `userId` to token
- On Google sign in: checks if user with that email exists in DB.
  If exists — links Google account (saves `googleId`).
  If not — creates new user from Google profile.
  Either way, attaches `userId` to token.

**`session` callback** — exposes `userId` from token into
`session.user.id` so client components can access it.

### Custom pages

`signIn` and `error` both point to `/login`.

### Session type extension

Create `shared/types/next-auth.d.ts` to extend `Session` and `JWT`
types with `userId` field. This gives type safety when accessing
`session.user.id`.

### Route handler

`app/api/auth/[...nextauth]/route.ts` — import `authOptions`,
create handler with `NextAuth(authOptions)`, export as GET and POST.

---

## Registration

Separate endpoint `app/api/auth/register/route.ts` because NextAuth
Credentials provider only handles login, not account creation.

POST handler:
- Accepts `username`, `email`, `password` from body
- Validates all fields present, password min 6 characters
- Checks DB for existing user with same email OR username
- Hashes password with `bcrypt.hash` (salt rounds: 12)
- Creates user in DB
- Returns 201 on success, 409 if user exists, 400 if validation fails

---

## Middleware

`middleware.ts` uses `withAuth` from `next-auth/middleware`.

Matcher: `["/chat/:path*"]` — only chat routes are protected.
Auth pages (`/login`, `/register`) and landing page stay public.
Unauthenticated users hitting `/chat/*` get redirected to `/login`.

---

## AI Streaming

`app/api/chat/route.ts` — the core of the app.

### Flow

1. Check session (401 if missing)
2. Parse `messages` and `chatId` from request body
3. Call `streamText` from Vercel AI SDK with `google("gemini-2.0-flash")`
4. Return `result.toDataStreamResponse()` — streams to client

### Persistence via onFinish

The `onFinish` callback in `streamText` fires after streaming completes.
This is where messages get saved to DB:

- If `chatId` exists — push user message + AI response to existing chat
- If no `chatId` — create new chat with title from first message
  (truncated to 50 chars)

This approach means the user sees streaming instantly while the DB
write happens after completion. No blocking.

### Important details

- Use `$push` to append messages array — not replace the whole chat
- Set `updatedAt` on every message to keep sidebar sorted correctly
- The model `gemini-2.0-flash` is fast and free-tier friendly

---

## Chat CRUD

`app/api/chat/[chatId]/route.ts` handles individual chat operations:

**GET** — load chat by ID. Must verify `userId` matches session
to prevent users reading other users' chats. Return 404 if not found.

**DELETE** — remove chat. Same ownership check. Return 404 if
not found or not owned by user.

Both use `findOne`/`findOneAndDelete` with `{ _id, userId }` filter
to enforce ownership at the query level.

---

## Server Actions

Use Server Actions (`"use server"`) for simple mutations that
don't need streaming or custom response handling.

Located in `features/manage-chats/lib/chat-actions.ts`:

- **`getChats()`** — returns all user's chats for sidebar.
  Select only `title` and `updatedAt`, sort by newest first,
  use `.lean()` for plain objects. Map `_id` to string `id`.

- **`deleteChat(chatId)`** — delete with ownership check,
  then `revalidatePath("/chat")` to refresh sidebar.

- **`renameChat(chatId, title)`** — update title with ownership
  check, revalidate.

### When to use what

| Use case              | Approach      | Why                          |
|----------------------|---------------|-------------------------------|
| AI streaming         | API route     | Needs streaming response      |
| Load chat            | API route     | GET request with params       |
| Registration         | API route     | Custom status codes (201/409) |
| Delete/rename chat   | Server Action | Simple mutation, no response  |

---

## Error Handling

**API routes** — always return `NextResponse.json({ message }, { status })`.
Never plain text responses.

**Server Actions** — throw errors. Client catches with try/catch
and shows toast via Shadcn/UI `sonner`.

**Status codes**: 200 (ok), 201 (created), 400 (bad input),
401 (no session), 404 (not found), 409 (conflict/duplicate).

---

## Security

### Input Validation

Validate everything from the client before processing:
- Check required fields exist and are correct type
- Limit string lengths (username max 30, message max 10000, title max 100)
- Validate email format
- Sanitize message content before rendering to prevent XSS —
  use `sanitize-html` or DOMPurify on the server side
- Never trust `chatId` or `userId` from request body — always
  use session for userId, validate chatId is a valid ObjectId

### Rate Limiting

Use `next-rate-limit` or a simple in-memory rate limiter for key routes:
- `/api/auth/register` — 5 requests per minute (prevent spam accounts)
- `/api/auth/[...nextauth]` — 10 per minute (prevent brute force)
- `/api/chat` (POST) — 20 per minute (prevent AI API abuse)

This is critical because the Gemini API has its own rate limits —
unprotected endpoints could exhaust the free tier quickly.

### Security Headers

Configure in `next.config.ts`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — restrict script sources

### Environment Variables

- Store all secrets in `.env.local` (gitignored by default)
- Never import env variables on the client side
- Server-only vars: `MONGODB_URI`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`
- Public vars (prefixed `NEXT_PUBLIC_`): only if absolutely necessary,
  never put secrets here
