import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { format as formatDate, subDays } from 'date-fns'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json or csv
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = subDays(new Date(), days)

    // Get all usage data
    const usage = await prisma.aIUsage.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (format === 'csv') {
      // Generate CSV with proper escaping
      const escapeCSV = (value: string | number): string => {
        const str = String(value)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      const csvHeader = 'Date,Provider,Model,Tokens Used,Cost\n'
      const csvRows = usage.map((item) => {
        const date = formatDate(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')
        return [
          escapeCSV(date),
          escapeCSV(item.provider),
          escapeCSV(item.model),
          escapeCSV(item.tokensUsed),
          escapeCSV(item.cost.toFixed(4)),
        ].join(',')
      }).join('\n')

      const csv = csvHeader + csvRows

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="promptgrid-analytics-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // Return JSON format
    const exportData = {
      exportedAt: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days,
      },
      summary: {
        totalRequests: usage.length,
        totalTokens: usage.reduce((sum, item) => sum + item.tokensUsed, 0),
        totalCost: usage.reduce((sum, item) => sum + item.cost, 0),
      },
      data: usage.map((item) => ({
        date: item.createdAt.toISOString(),
        provider: item.provider,
        model: item.model,
        tokensUsed: item.tokensUsed,
        cost: item.cost,
        metadata: item.metadata ? JSON.parse(item.metadata) : null,
      })),
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="promptgrid-analytics-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

