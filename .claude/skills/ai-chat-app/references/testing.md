# Testing Reference

Test patterns for the AI Chat App using Vitest and React Testing Library.

## Stack

| Tool                  | Purpose                          |
|----------------------|----------------------------------|
| Vitest               | Test runner, assertions, mocking |
| React Testing Library | Render components, simulate user actions |
| @testing-library/user-event | Realistic user interactions |
| MSW (Mock Service Worker) | Mock API responses |

## Setup

Vitest config in `vitest.config.ts`:
- Environment: `jsdom` for component tests
- Path aliases: same `@/` mapping as in `tsconfig.json`
- Setup file: `vitest.setup.ts` for React Testing Library matchers
- Coverage: track with `@vitest/coverage-v8`

Setup file registers `@testing-library/jest-dom` matchers
(`toBeInTheDocument`, `toBeVisible`, `toHaveTextContent`, etc.).

## File Organization

Tests live next to the code they test in `__tests__/` directories.
Naming: `[filename].test.tsx` for components, `[filename].test.ts`
for logic. Same structure as the source — if `LoginForm.tsx` is in
`features/auth/components/`, its test is in
`features/auth/components/__tests__/LoginForm.test.tsx`.

---

## Testing Philosophy

Test behavior, not implementation. Ask "what does the user see
and do?" not "what state variable changed?"

- Find elements by role, text, placeholder — what the user sees
- Avoid `getByTestId` unless no semantic alternative exists
- Use `userEvent` over `fireEvent` — simulates real user behavior
- `screen` queries preferred over destructuring `render()` result

---

## Component Tests

### What to test for each component

**LoginForm / RegisterForm:**
- Renders all fields (email, password, username for register)
- Submit button disabled when required fields are empty
- Shows validation errors for invalid input
- Calls submit handler with correct values
- Shows loading state during submission
- Displays error message on failed auth

**ChatInput:**
- Renders textarea and send button
- Send button disabled when input is empty
- Send button disabled while AI is streaming
- Submit on Enter key press
- New line on Shift+Enter
- Input clears after submit

**MessageBubble:**
- User message renders with correct alignment and style
- Assistant message renders with avatar and different style
- Markdown content renders correctly in assistant messages
- Timestamp appears on hover

**ChatSidebar:**
- Displays list of chats
- Active chat is visually highlighted
- "New Chat" button triggers creation
- Delete button appears on hover
- Delete triggers removal action
- Empty state shows when no chats exist

**ChatWindow (widget):**
- Renders sidebar and message area together
- Auto-scrolls to bottom when new message appears

**ThemeCustomizer:**
- Color pickers render for each theme variable
- Changing a color updates the preview
- Save applies theme to the page
- Reset returns to default theme
- Preset themes load correctly

---

## Hook Tests

Use `renderHook` from React Testing Library for custom hooks.

**useChat mock** — mock `@ai-sdk/react` to return controlled state:
messages array, input value, loading state, error. Test components
in different states by changing what the mock returns.

**Theme hooks** — test that saved theme is read from localStorage
on mount, new theme is written on save, removal clears storage.

---

## API Route Tests

Call the route handler function directly with a constructed `Request`.

**Registration route:**
- Returns 400 when fields are missing
- Returns 400 when password too short
- Returns 409 when email already exists
- Returns 201 on successful registration

**Chat route (POST):**
- Returns 401 without session
- Accepts messages and returns streaming response
- Saves messages to DB after streaming completes

**Chat route (GET/DELETE):**
- Returns 401 without session
- Returns 404 for non-existent chat
- Returns 404 when user doesn't own the chat (ownership check)
- Returns chat data on successful GET
- Removes chat on successful DELETE

Mock `getServerSession` to simulate authenticated/unauthenticated
states. Mock Mongoose model methods for DB operations.

---

## Test Priority

### Must test (high value):
- Auth forms — validation, submit, error display
- ChatInput — typing, submit, disabled states
- MessageBubble — user vs assistant rendering
- ChatSidebar — chat list, active state, delete
- API routes — auth check, validation, status codes

### Good to test (medium value):
- ThemeCustomizer — color changes, save, reset
- Loading states — skeletons display
- Error states — toast on API failure

### Skip:
- Shadcn/UI base components — tested by the library
- Pure display components with no logic
- CSS/visual styling — not suited for unit tests

---

## Running Tests

- `npx vitest` — run all tests
- `npx vitest --watch` — re-run on file change
- `npx vitest LoginForm` — run specific file
- `npx vitest --coverage` — with coverage report
