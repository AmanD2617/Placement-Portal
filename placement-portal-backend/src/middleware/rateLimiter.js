/**
 * Simple in-memory rate limiter middleware.
 * Limits requests per IP address within a sliding time window.
 *
 * For production, replace with express-rate-limit + Redis store:
 *   npm install express-rate-limit rate-limit-redis
 */

const requestCounts = new Map()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requestCounts) {
    if (now - entry.windowStart > entry.windowMs) {
      requestCounts.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Creates a rate limiter middleware.
 * @param {Object} options
 * @param {number} options.windowMs  - Time window in milliseconds (default: 60000 = 1 min)
 * @param {number} options.max       - Max requests per window (default: 10)
 * @param {string} options.message   - Error message when limit exceeded
 */
export function rateLimit({ windowMs = 60 * 1000, max = 10, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()

    let entry = requestCounts.get(key)

    if (!entry || now - entry.windowStart > windowMs) {
      // Start a new window
      entry = { windowStart: now, count: 1, windowMs }
      requestCounts.set(key, entry)
      return next()
    }

    entry.count++

    if (entry.count > max) {
      const retryAfterMs = windowMs - (now - entry.windowStart)
      res.set('Retry-After', String(Math.ceil(retryAfterMs / 1000)))
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
        },
      })
    }

    next()
  }
}
