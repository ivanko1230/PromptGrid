import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { hashApiKey } from '@/lib/api-keys'
import { rateLimitMiddleware } from '@/lib/middleware'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = authHeader.substring(7)
    const keyHash = hashApiKey(apiKey)

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    })

    if (!apiKeyRecord) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    })

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { userId: apiKeyRecord.userId },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      )
    }

    // Apply rate limiting with API key identifier
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      apiKeyRecord.userId,
      subscription.plan,
      apiKey
    )
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    const { provider, model, messages, maxTokens, temperature } = body

    // Import and use the AI chat handler logic
    const { callAI } = await import('@/lib/ai')

    const response = await callAI({
      provider: provider || 'openai',
      model: model || 'gpt-3.5-turbo',
      messages: messages || [],
      maxTokens,
      temperature,
    })

    // Track usage
    await prisma.aIUsage.create({
      data: {
        userId: apiKeyRecord.userId,
        provider: provider || 'openai',
        model: model || 'gpt-3.5-turbo',
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        metadata: JSON.stringify({
          messages: messages?.length || 0,
          maxTokens,
          temperature,
          source: 'api',
        }),
      },
    })

    return NextResponse.json({
      content: response.content,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
    })
  } catch (error) {
    console.error('API key endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

