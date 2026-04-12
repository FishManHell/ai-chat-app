interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  readonly maxRequests: number
  readonly windowMs: number
}

export function rateLimit({ maxRequests, windowMs }: RateLimitOptions) {
  return function check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs })
      return { allowed: true, remaining: maxRequests - 1 }
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    entry.count++
    return { allowed: true, remaining: maxRequests - entry.count }
  }
}

export const registerLimiter = rateLimit({ maxRequests: 5, windowMs: 60_000 })
export const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 })
export const chatLimiter = rateLimit({ maxRequests: 20, windowMs: 60_000 })
