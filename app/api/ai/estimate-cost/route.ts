import { NextResponse } from 'next/server'
import { z } from 'zod'
import { estimateRequestCost } from '@/lib/cost-estimation'

const estimateSchema = z.object({
  provider: z.enum(['openai', 'anthropic']),
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  maxTokens: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = estimateSchema.parse(body)

    const estimation = estimateRequestCost(
      data.model,
      data.messages,
      data.maxTokens
    )

    return NextResponse.json({
      ...estimation,
      estimatedCostFormatted: `$${estimation.estimatedCost.toFixed(6)}`,
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


