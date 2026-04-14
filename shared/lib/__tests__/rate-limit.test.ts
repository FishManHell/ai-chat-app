import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { rateLimit } from "../rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("allows requests and decrements remaining", () => {
    const check = rateLimit({ maxRequests: 3, windowMs: 1000 })

    const first = check("a")
    expect(first.allowed).toBe(true)
    expect(first.remaining).toBe(2)

    const second = check("a")
    expect(second.allowed).toBe(true)
    expect(second.remaining).toBe(1)
  })

  it("blocks when limit exceeded", () => {
    const check = rateLimit({ maxRequests: 2, windowMs: 1000 })
    check("b")
    check("b")
    const result = check("b")
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("resets after window expires", () => {
    const check = rateLimit({ maxRequests: 1, windowMs: 1000 })
    check("c")

    vi.advanceTimersByTime(1001)

    const result = check("c")
    expect(result.allowed).toBe(true)
  })

  it("tracks different keys independently", () => {
    const check = rateLimit({ maxRequests: 1, windowMs: 1000 })
    check("d")

    const result = check("e")
    expect(result.allowed).toBe(true)
  })
})
