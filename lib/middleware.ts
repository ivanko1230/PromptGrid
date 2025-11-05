import { NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitConfig } from '@/lib/rate-limit'

/**
 * Rate limiting middleware for API routes
 */
export async function rateLimitMiddleware(
  request: Request,
  userId: string,
  plan: string,
  identifier?: string
): Promise<NextResponse | null> {
  const config = getRateLimitConfig(plan)
  
  // Check per-minute limit
  const minuteLimit = await checkRateLimit({
    userId,
    maxRequests: config.perMinute,
    windowMs: 60 * 1000, // 1 minute
    identifier,
  })

  if (!minuteLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests per minute. Please try again later.',
        resetAt: minuteLimit.resetAt.toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.perMinute.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(minuteLimit.resetAt.getTime() / 1000).toString(),
          'Retry-After': Math.ceil((minuteLimit.resetAt.getTime() - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  // Check per-hour limit
  const hourLimit = await checkRateLimit({
    userId,
    maxRequests: config.perHour,
    windowMs: 60 * 60 * 1000, // 1 hour
    identifier,
  })

  if (!hourLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests per hour. Please try again later.',
        resetAt: hourLimit.resetAt.toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.perHour.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(hourLimit.resetAt.getTime() / 1000).toString(),
          'Retry-After': Math.ceil((hourLimit.resetAt.getTime() - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  // Return null to continue processing (rate limit passed)
  return null
}

