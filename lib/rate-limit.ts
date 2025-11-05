import { prisma } from '@/lib/prisma'

interface RateLimitOptions {
  userId: string
  maxRequests: number
  windowMs: number
  identifier?: string // For API keys, use the key as identifier
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or similar
 */
const rateLimitCache = new Map<string, { count: number; resetAt: Date }>()

function getRateLimitKey(userId: string, identifier?: string): string {
  return identifier ? `api:${identifier}` : `user:${userId}`
}

export async function checkRateLimit({
  userId,
  maxRequests,
  windowMs,
  identifier,
}: RateLimitOptions): Promise<RateLimitResult> {
  const key = getRateLimitKey(userId, identifier)
  const now = new Date()
  
  // Clean up expired entries
  for (const [cacheKey, value] of rateLimitCache.entries()) {
    if (value.resetAt < now) {
      rateLimitCache.delete(cacheKey)
    }
  }

  const cached = rateLimitCache.get(key)
  
  if (!cached || cached.resetAt < now) {
    // Create new window
    const resetAt = new Date(now.getTime() + windowMs)
    rateLimitCache.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
    }
  }

  if (cached.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: cached.resetAt,
    }
  }

  // Increment count
  cached.count++
  rateLimitCache.set(key, cached)
  
  return {
    allowed: true,
    remaining: maxRequests - cached.count,
    resetAt: cached.resetAt,
  }
}

/**
 * Get rate limit configuration based on subscription plan
 */
export function getRateLimitConfig(plan: string): {
  perMinute: number
  perHour: number
} {
  const configs: Record<string, { perMinute: number; perHour: number }> = {
    free: { perMinute: 10, perHour: 100 },
    pro: { perMinute: 60, perHour: 1000 },
    enterprise: { perMinute: 300, perHour: 10000 },
  }
  
  return configs[plan] || configs.free
}

