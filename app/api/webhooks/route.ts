import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'

const createWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const data = createWebhookSchema.parse(body)

    const secret = crypto.randomBytes(32).toString('hex')

    const webhook = await prisma.webhook.create({
      data: {
        userId: user.id,
        url: data.url,
        secret,
        events: JSON.stringify(data.events),
        isActive: true,
      },
    })

    return NextResponse.json({ webhook }, { status: 201 })
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

    const webhooks = await prisma.webhook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = webhooks.map((webhook) => ({
      ...webhook,
      events: JSON.parse(webhook.events),
    }))

    return NextResponse.json({ webhooks: formatted })
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
        { error: 'Webhook ID is required' },
        { status: 400 }
      )
    }

    await prisma.webhook.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: 'Webhook deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { id, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhook.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isActive: isActive !== undefined ? isActive : undefined,
      },
    })

    return NextResponse.json({ webhook })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

