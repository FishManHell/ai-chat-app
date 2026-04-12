---
name: ai-chat-database
description: >
  MongoDB database layer for the AI Chat App — Mongoose models, schemas,
  connection, indexes, and data operations. Use this skill when working
  with database schemas, models, MongoDB queries, indexes, data migrations,
  or Mongoose configuration. Also trigger when the user mentions "schema",
  "model", "collection", "MongoDB", "Mongoose", or database-related
  operations in context of the AI Chat App project.
---

# AI Chat Database

MongoDB database layer for the AI Chat App. Handles connection,
schemas, models, indexes, and data integrity.

## Stack

| Tool     | Purpose                    |
|---------|----------------------------|
| MongoDB  | Database (Atlas cloud)     |
| Mongoose | ODM — schemas, models, queries |

## Connection

Single reusable connection in `shared/lib/db.ts`.

Mongoose in Next.js has a known issue — in development, hot reload
creates multiple connections. The fix is to cache the connection
on `global`:

- Check if `global.mongoose` already has a connection
- If yes — reuse it
- If no — connect and cache on `global`
- Use `MONGODB_URI` from env
- Set `bufferCommands: false` to fail fast if not connected

In production this is not an issue — the process starts once.

## Models

All models live in `models/` directory at the project root,
separate from FSD layers because they are server-side only.

### User Model (`models/User.ts`)

Collection: `users`

Fields:
- `username` — string, required, unique, trimmed
- `email` — string, required, unique, lowercase, trimmed
- `password` — string, optional (not required for Google-only users)
- `avatar` — string, optional (URL from Google profile)
- `googleId` — string, optional (set when linked with Google)
- `createdAt` — auto via timestamps
- `updatedAt` — auto via timestamps

Indexes:
- `{ email: 1 }` — unique, for login lookup
- `{ username: 1 }` — unique, for registration check

Important: `password` is optional because users who sign in
only through Google never set a password. The schema must allow this.

Use `timestamps: true` in schema options — Mongoose auto-manages
`createdAt` and `updatedAt`.

### Chat Model (`models/Chat.ts`)

Collection: `chats`

Fields:
- `userId` — ObjectId, required, ref to User
- `title` — string, required, default "New Chat"
- `messages` — array of embedded message subdocuments:
  - `role` — string, "user" or "assistant"
  - `content` — string, required
  - `createdAt` — Date, default now
- `createdAt` — auto via timestamps
- `updatedAt` — auto via timestamps

Indexes:
- `{ userId: 1, updatedAt: -1 }` — for sidebar query (user's chats sorted by recent)

Messages are embedded (subdocuments), not a separate collection.
This is the right choice because:
- Messages always belong to one chat
- We always load messages together with their chat
- No need for cross-chat message queries
- Better read performance — one query gets everything

### Model re-import safety

Mongoose in Next.js can try to recompile models on hot reload.
Always check if model exists before defining:

```ts
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema)
```

## Schema Design Principles

### Embedded vs Referenced

**Embed** when:
- Data always accessed together (messages in a chat)
- Child doesn't exist without parent
- No need to query children independently

**Reference** when:
- Data accessed independently (user has many chats)
- Many-to-many relationships
- Document would exceed 16MB limit

In this project:
- Messages → **embedded** in Chat (always loaded together)
- Chat → User: **referenced** via `userId` (user listed separately)

### Validation

Mongoose schema validation is the last line of defense.
API routes validate input first, but schema validation catches
anything that slips through:

- `required` on fields that must exist
- `enum` on fields with fixed values (message role)
- `minlength` / `maxlength` where applicable
- `match` for email format validation
- Custom validators for complex rules

### Lean queries

When returning data to the client, always use `.lean()`.
It returns plain JS objects instead of Mongoose documents —
smaller, faster, serializable.

For sidebar: `.select("title updatedAt").lean()` — only what's needed.
For full chat: `.lean()` — includes messages array.

### ObjectId to string

MongoDB `_id` is an ObjectId. The client expects string `id`.
Always map when returning data:

```ts
return chats.map((chat) => ({
  id: chat._id.toString(),
  title: chat.title,
  updatedAt: chat.updatedAt,
}))
```

## MongoDB Atlas Setup

The database is hosted on MongoDB Atlas (free tier).

Setup via Atlas CLI or web UI:
1. Create cluster (free M0 tier)
2. Create database user with read/write permissions
3. Whitelist IP (or allow all for development: `0.0.0.0/0`)
4. Get connection string → put in `MONGODB_URI` env variable
5. Create database named `ai-chat-app`

Collections are created automatically by Mongoose on first write.
No manual collection creation needed.
