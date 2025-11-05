import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const favoriteSchema = z.object({
  type: z.enum(['template', 'conversation']),
  itemId: z.string(),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const data = favoriteSchema.parse(body)

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_type_itemId: {
          userId: user.id,
          type: data.type,
          itemId: data.itemId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ favorite: existing, message: 'Already favorited' })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        type: data.type,
        itemId: data.itemId,
      },
    })

    return NextResponse.json({ favorite }, { status: 201 })
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'template' | 'conversation' | null

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
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
        { error: 'Favorite ID is required' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: 'Favorite removed successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


