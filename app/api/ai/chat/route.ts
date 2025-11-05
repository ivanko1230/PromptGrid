import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimitMiddleware } from '@/lib/middleware'

const aiRequestSchema = z.object({
  provider: z.enum(['openai', 'anthropic']),
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = aiRequestSchema.parse(body)

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      )
    }

    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      session.user.id,
      subscription.plan
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Check usage limits based on plan
    const planLimits: Record<string, { monthlyRequests: number; monthlyTokens: number }> = {
      free: { monthlyRequests: 100, monthlyTokens: 100000 },
      pro: { monthlyRequests: 1000, monthlyTokens: 1000000 },
      enterprise: { monthlyRequests: 10000, monthlyTokens: 10000000 },
    }

    const limits = planLimits[subscription.plan] || planLimits.free

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyUsage = await prisma.aIUsage.aggregate({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        tokensUsed: true,
      },
      _count: {
        id: true,
      },
    })

    const requestsUsed = monthlyUsage._count.id || 0
    const tokensUsed = monthlyUsage._sum.tokensUsed || 0

    if (requestsUsed >= limits.monthlyRequests) {
      return NextResponse.json(
        { error: 'Monthly request limit exceeded' },
        { status: 403 }
      )
    }

    if (tokensUsed >= limits.monthlyTokens) {
      return NextResponse.json(
        { error: 'Monthly token limit exceeded' },
        { status: 403 }
      )
    }

    // Call AI
    const response = await callAI({
      provider: data.provider,
      model: data.model,
      messages: data.messages,
      maxTokens: data.maxTokens,
      temperature: data.temperature,
    })

    // Track usage
    await prisma.aIUsage.create({
      data: {
        userId: session.user.id,
        provider: data.provider,
        model: data.model,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        metadata: JSON.stringify({
          messages: data.messages.length,
          maxTokens: data.maxTokens,
          temperature: data.temperature,
        }),
      },
    })

    return NextResponse.json({
      content: response.content,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('AI API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

