import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { Textarea } from "../textarea"

describe("Textarea", () => {
  it("renders with placeholder", () => {
    renderWithUser(<Textarea placeholder="Write something" />)
    expect(screen.getByPlaceholderText("Write something")).toBeInTheDocument()
  })

  it("accepts user input", async () => {
    const { user } = renderWithUser(<Textarea placeholder="Type" />)
    const textarea = screen.getByPlaceholderText("Type")
    await user.type(textarea, "hello world")
    expect(textarea).toHaveValue("hello world")
  })

  it("respects disabled state", () => {
    renderWithUser(<Textarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled()
  })
})
