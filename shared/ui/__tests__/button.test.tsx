import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { Button } from "../button"

describe("Button", () => {
  it("renders with text", () => {
    renderWithUser(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("calls onClick handler", async () => {
    const onClick = vi.fn()
    const { user } = renderWithUser(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    const { user } = renderWithUser(<Button disabled onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies custom className", () => {
    renderWithUser(<Button className="custom-class">Btn</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })
})
