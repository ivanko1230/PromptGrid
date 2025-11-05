import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const searchSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['conversations', 'templates', 'all']).optional().default('all'),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const data = searchSchema.parse(body)

    const results: any = {
      conversations: [],
      templates: [],
    }

    if (data.type === 'all' || data.type === 'conversations') {
      const conversations = await prisma.conversation.findMany({
        where: {
          userId: user.id,
          OR: [
            { title: { contains: data.query, mode: 'insensitive' } },
            { messages: { contains: data.query, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      })

      results.conversations = conversations.map((conv) => ({
        ...conv,
        messages: JSON.parse(conv.messages),
      }))
    }

    if (data.type === 'all' || data.type === 'templates') {
      const templates = await prisma.promptTemplate.findMany({
        where: {
          OR: [
            { userId: user.id },
            { isPublic: true },
          ],
          OR: [
            { name: { contains: data.query, mode: 'insensitive' } },
            { description: { contains: data.query, mode: 'insensitive' } },
            { content: { contains: data.query, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      })

      results.templates = templates
    }

    return NextResponse.json({ results })
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

