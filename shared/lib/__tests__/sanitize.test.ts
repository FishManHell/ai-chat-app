import { describe, it, expect } from "vitest"
import { sanitizeMessage } from "../sanitize"

describe("sanitizeMessage", () => {
  it("returns plain text as-is", () => {
    expect(sanitizeMessage("Hello world")).toBe("Hello world")
  })

  it("strips HTML tags", () => {
    expect(sanitizeMessage("<b>bold</b>")).toBe("bold")
  })

  it("strips script tags", () => {
    expect(sanitizeMessage('<script>alert("xss")</script>')).toBe("")
  })

  it("strips event handlers", () => {
    expect(sanitizeMessage('<img onerror="alert(1)" src="x">')).toBe("")
  })

  it("strips nested HTML", () => {
    expect(sanitizeMessage("<div><p>text</p></div>")).toBe("text")
  })

  it("handles empty string", () => {
    expect(sanitizeMessage("")).toBe("")
  })

  it("preserves special characters in text", () => {
    expect(sanitizeMessage("a < b && c > d")).toBe("a &lt; b &amp;&amp; c &gt; d")
  })
})
