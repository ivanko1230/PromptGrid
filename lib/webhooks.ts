import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function triggerWebhooks(
  userId: string,
  eventType: string,
  data: any
) {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    const activeWebhooks = webhooks.filter((webhook) => {
      const events = JSON.parse(webhook.events) as string[]
      return events.includes(eventType) || events.includes('*')
    })

    // Trigger webhooks asynchronously
    for (const webhook of activeWebhooks) {
      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PromptGrid-Event': eventType,
          'X-PromptGrid-Signature': generateSignature(webhook.secret, JSON.stringify(data)),
        },
        body: JSON.stringify({
          event: eventType,
          data,
          timestamp: new Date().toISOString(),
        }),
      }).catch((error) => {
        console.error(`Webhook ${webhook.id} failed:`, error)
      })

      // Update last triggered timestamp
      await prisma.webhook.update({
        where: { id: webhook.id },
        data: { lastTriggeredAt: new Date() },
      })
    }
  } catch (error) {
    console.error('Error triggering webhooks:', error)
  }
}

function generateSignature(secret: string, payload: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

