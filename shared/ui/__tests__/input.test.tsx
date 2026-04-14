import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { Input } from "../input"

describe("Input", () => {
  it("renders with placeholder", () => {
    renderWithUser(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument()
  })

  it("accepts user input", async () => {
    const { user } = renderWithUser(<Input placeholder="Type" />)
    const input = screen.getByPlaceholderText("Type")
    await user.type(input, "hello")
    expect(input).toHaveValue("hello")
  })

  it("respects disabled state", () => {
    renderWithUser(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled()
  })

  it("renders correct type", () => {
    renderWithUser(<Input type="password" placeholder="Pass" />)
    expect(screen.getByPlaceholderText("Pass")).toHaveAttribute("type", "password")
  })
})
