import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { createMessage } from "@/shared/lib/__tests__/helpers/factories"
import { MessageBubble } from "../MessageBubble"

describe("MessageBubble", () => {
  it("renders message content", () => {
    const msg = createMessage({ content: "Hello world" })
    renderWithUser(<MessageBubble {...msg} />)
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("shows avatar for assistant messages only", () => {
    const { container: assistantContainer } = renderWithUser(
      <MessageBubble {...createMessage({ role: "assistant" })} />
    )
    const { container: userContainer } = renderWithUser(
      <MessageBubble {...createMessage({ role: "user" })} />
    )
    // Assistant has gradient avatar div, user does not
    const assistantAvatars = assistantContainer.querySelectorAll("[style*='linear-gradient']")
    const userAvatars = userContainer.querySelectorAll("[style*='linear-gradient']")
    expect(assistantAvatars.length).toBe(1)
    expect(userAvatars.length).toBe(0)
  })

  it("renders timestamp when createdAt is provided", () => {
    const msg = createMessage({ createdAt: new Date("2025-01-01T14:30:00") })
    renderWithUser(<MessageBubble {...msg} />)
    expect(screen.getByText(/14:30|2:30/)).toBeInTheDocument()
  })
})
