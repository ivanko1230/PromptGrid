import { prisma } from '@/lib/prisma'

export async function checkUsageAlerts(userId: string) {
  try {
    const alerts = await prisma.usageAlert.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    if (alerts.length === 0) return

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyUsage = await prisma.aIUsage.aggregate({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        tokensUsed: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    })

    const requestsUsed = monthlyUsage._count.id || 0
    const tokensUsed = monthlyUsage._sum.tokensUsed || 0
    const costUsed = monthlyUsage._sum.cost || 0

    const triggeredAlerts = []

    for (const alert of alerts) {
      let shouldTrigger = false
      let currentValue = 0

      switch (alert.type) {
        case 'requests':
          currentValue = requestsUsed
          shouldTrigger = currentValue >= alert.threshold && 
            (!alert.lastTriggeredAt || 
             new Date(alert.lastTriggeredAt).getTime() < startOfMonth.getTime())
          break
        case 'tokens':
          currentValue = tokensUsed
          shouldTrigger = currentValue >= alert.threshold && 
            (!alert.lastTriggeredAt || 
             new Date(alert.lastTriggeredAt).getTime() < startOfMonth.getTime())
          break
        case 'cost':
          currentValue = costUsed
          shouldTrigger = currentValue >= alert.threshold && 
            (!alert.lastTriggeredAt || 
             new Date(alert.lastTriggeredAt).getTime() < startOfMonth.getTime())
          break
      }

      if (shouldTrigger) {
        triggeredAlerts.push({ alert, currentValue })
        
        // Update last triggered timestamp
        await prisma.usageAlert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: new Date() },
        })
      }
    }

    return triggeredAlerts
  } catch (error) {
    console.error('Error checking usage alerts:', error)
    return []
  }
}


