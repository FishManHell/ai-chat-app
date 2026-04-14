import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithUser } from "@/shared/lib/__tests__/helpers/render"
import { UserAvatar } from "../UserAvatar"

describe("UserAvatar", () => {
  it("shows initials from name", () => {
    renderWithUser(<UserAvatar name="John Doe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("shows single initial for single name", () => {
    renderWithUser(<UserAvatar name="Alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("shows fallback 'U' when no name provided", () => {
    renderWithUser(<UserAvatar />)
    expect(screen.getByText("U")).toBeInTheDocument()
  })

  it("truncates initials to 2 characters", () => {
    renderWithUser(<UserAvatar name="John William Doe" />)
    expect(screen.getByText("JW")).toBeInTheDocument()
  })
})
