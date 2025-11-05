import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createConversationSchema = z.object({
  title: z.string().min(1).max(200),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
  model: z.string().optional(),
  provider: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const data = createConversationSchema.parse(body)

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: data.title,
        messages: JSON.stringify(data.messages),
        model: data.model || null,
        provider: data.provider || null,
      },
    })

    return NextResponse.json({ conversation }, { status: 201 })
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

export async function GET(request: Request) {
  try {
    const user = await requireAuth()

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    const formatted = conversations.map((conv) => ({
      ...conv,
      messages: JSON.parse(conv.messages),
    }))

    return NextResponse.json({ conversations: formatted })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    await prisma.conversation.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


