import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { callAI } from '@/lib/ai'

const batchRequestSchema = z.object({
  requests: z.array(
    z.object({
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
  ).min(1).max(10), // Limit to 10 requests per batch
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const data = batchRequestSchema.parse(body)

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      )
    }

    // Process all requests in parallel
    const results = await Promise.allSettled(
      data.requests.map(async (req) => {
        try {
          const response = await callAI({
            provider: req.provider,
            model: req.model,
            messages: req.messages,
            maxTokens: req.maxTokens,
            temperature: req.temperature,
          })

          // Track usage
          await prisma.aIUsage.create({
            data: {
              userId: user.id,
              provider: req.provider,
              model: req.model,
              tokensUsed: response.tokensUsed,
              cost: response.cost,
              metadata: JSON.stringify({
                messages: req.messages.length,
                maxTokens: req.maxTokens,
                temperature: req.temperature,
                source: 'batch',
              }),
            },
          })

          return {
            success: true,
            content: response.content,
            tokensUsed: response.tokensUsed,
            cost: response.cost,
          }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    const responses = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      }
      return {
        success: false,
        error: result.reason?.message || 'Request failed',
      }
    })

    const totalCost = responses
      .filter((r) => r.success)
      .reduce((sum, r) => sum + (r.cost || 0), 0)

    const totalTokens = responses
      .filter((r) => r.success)
      .reduce((sum, r) => sum + (r.tokensUsed || 0), 0)

    return NextResponse.json({
      results: responses,
      summary: {
        total: data.requests.length,
        successful: responses.filter((r) => r.success).length,
        failed: responses.filter((r) => !r.success).length,
        totalCost,
        totalTokens,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


