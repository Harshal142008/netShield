import type { RequestHandler } from 'express'

const buckets = new Map<string, { count: number; resetAt: number }>()

export function simpleRateLimit(windowMs = 60_000, max = 20): RequestHandler {
  return (req, res, next) => {
    const now = Date.now()
    const key = req.ip || 'unknown'
    const bucket = buckets.get(key)
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }
    bucket.count += 1
    if (bucket.count > max) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
      return
    }
    next()
  }
}
