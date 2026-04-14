import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { createChatPreview } from "@/shared/lib/__tests__/helpers/factories"
import { ChatItem } from "../ChatItem"

function renderChatItem(overrides?: Parameters<typeof createChatPreview>[0], isActive = false) {
  const chat = createChatPreview(overrides)
  const onSelect = vi.fn()
  const onDelete = vi.fn()
  const result = renderWithUser(
    <ChatItem chat={chat} isActive={isActive} onSelect={onSelect} onDelete={onDelete} />
  )
  return { chat, onSelect, onDelete, ...result }
}

describe("ChatItem", () => {
  it("renders chat title", () => {
    renderChatItem({ title: "My Chat" })
    expect(screen.getByText("My Chat")).toBeInTheDocument()
  })

  it("calls onSelect when clicked", async () => {
    const { user, onSelect } = renderChatItem({ id: "abc-123" })
    await user.click(screen.getByRole("button", { name: /Test Chat/i }))
    expect(onSelect).toHaveBeenCalledWith("abc-123")
  })

  it("calls onDelete when delete button clicked", async () => {
    const { user, onDelete } = renderChatItem({ id: "abc-123" })
    const buttons = screen.getAllByRole("button")
    const deleteBtn = buttons.find(btn => btn !== screen.getByRole("button", { name: /Test Chat/i }))!
    await user.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith("abc-123")
  })

  it("does not trigger onSelect when delete is clicked", async () => {
    const { user, onSelect, onDelete } = renderChatItem({ id: "abc-123" })
    const buttons = screen.getAllByRole("button")
    const deleteBtn = buttons.find(btn => btn !== screen.getByRole("button", { name: /Test Chat/i }))!
    await user.click(deleteBtn)
    expect(onDelete).toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })
})
