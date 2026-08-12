import type { ErrorRequestHandler } from 'express'
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Unexpected server error:', err.message)
  res.status(500).json({ error: 'An unexpected error occurred.' })
}
