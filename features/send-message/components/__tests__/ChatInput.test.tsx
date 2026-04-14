import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { ChatInput } from "../ChatInput"

function renderChatInput(overrides?: Partial<{ isLoading: boolean; onSend: () => void; onStop: () => void }>) {
  const props = {
    isLoading: false,
    onSend: vi.fn(),
    onStop: vi.fn(),
    ...overrides,
  }
  const result = renderWithUser(<ChatInput {...props} />)
  return { ...props, ...result }
}

describe("ChatInput", () => {
  it("renders textarea with placeholder", () => {
    renderChatInput()
    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument()
  })

  it("sends message on form submit", async () => {
    const { user, onSend } = renderChatInput()
    const textarea = screen.getByPlaceholderText("Send a message...")
    await user.type(textarea, "Hello")
    await user.click(screen.getByRole("button"))
    expect(onSend).toHaveBeenCalledWith("Hello")
  })

  it("sends message on Enter key", async () => {
    const { user, onSend } = renderChatInput()
    const textarea = screen.getByPlaceholderText("Send a message...")
    await user.type(textarea, "Hi{Enter}")
    expect(onSend).toHaveBeenCalledWith("Hi")
  })

  it("does not send empty message", async () => {
    const { user, onSend } = renderChatInput()
    const textarea = screen.getByPlaceholderText("Send a message...")
    await user.type(textarea, "   {Enter}")
    expect(onSend).not.toHaveBeenCalled()
  })

  it("clears input after sending", async () => {
    const { user } = renderChatInput()
    const textarea = screen.getByPlaceholderText("Send a message...")
    await user.type(textarea, "Hello{Enter}")
    expect(textarea).toHaveValue("")
  })

  it("shows stop button when loading", () => {
    renderChatInput({ isLoading: true })
    const textarea = screen.getByPlaceholderText("Send a message...")
    expect(textarea).toBeDisabled()
  })

  it("calls onStop when stop button clicked", async () => {
    const { user, onStop } = renderChatInput({ isLoading: true })
    await user.click(screen.getByRole("button"))
    expect(onStop).toHaveBeenCalledOnce()
  })
})
