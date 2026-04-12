import sanitizeHtml from "sanitize-html"

export function sanitizeMessage(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  })
}
