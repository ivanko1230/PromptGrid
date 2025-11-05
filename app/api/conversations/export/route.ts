import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const format = searchParams.get('format') || 'json' // json or markdown

    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const messages = JSON.parse(conversation.messages)

    if (format === 'markdown') {
      const markdown = messages
        .map((msg: any) => {
          const role = msg.role === 'user' ? '**You**' : '**Assistant**'
          return `${role}\n\n${msg.content}\n\n---\n`
        })
        .join('\n')

      const fullMarkdown = `# ${conversation.title}\n\n**Provider:** ${conversation.provider || 'N/A'}\n**Model:** ${conversation.model || 'N/A'}\n**Date:** ${new Date(conversation.createdAt).toLocaleString()}\n\n---\n\n${markdown}`

      return new NextResponse(fullMarkdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${conversation.title.replace(/[^a-z0-9]/gi, '_')}.md"`,
        },
      })
    }

    // JSON format
    const exportData = {
      title: conversation.title,
      provider: conversation.provider,
      model: conversation.model,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages,
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="${conversation.title.replace(/[^a-z0-9]/gi, '_')}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


