import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { format, subDays } from 'date-fns'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const thirtyDaysAgo = subDays(new Date(), 30)

    // Get daily usage for last 30 days
    const usage = await prisma.aIUsage.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const dailyUsageMap = new Map<string, { tokens: number; requests: number; cost: number }>()

    usage.forEach((item) => {
      const date = format(new Date(item.createdAt), 'yyyy-MM-dd')
      const existing = dailyUsageMap.get(date) || { tokens: 0, requests: 0, cost: 0 }
      dailyUsageMap.set(date, {
        tokens: existing.tokens + item.tokensUsed,
        requests: existing.requests + 1,
        cost: existing.cost + item.cost,
      })
    })

    const dailyUsage = Array.from(dailyUsageMap.entries())
      .map(([date, data]) => ({
        date,
        tokens: data.tokens,
        requests: data.requests,
        cost: data.cost,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get provider statistics
    const providerStats = await prisma.aIUsage.groupBy({
      by: ['provider'],
      where: {
        userId: session.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
      _sum: { tokensUsed: true },
    })

    const providerData = providerStats.map((stat) => ({
      provider: stat.provider,
      count: stat._count.id,
      tokens: stat._sum.tokensUsed || 0,
    }))

    // Get totals
    const totals = await prisma.aIUsage.aggregate({
      where: {
        userId: session.user.id,
      },
      _sum: {
        tokensUsed: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    })

    return NextResponse.json({
      dailyUsage,
      providerStats: providerData,
      totalTokens: totals._sum.tokensUsed || 0,
      totalRequests: totals._count.id || 0,
      totalCost: totals._sum.cost || 0,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

