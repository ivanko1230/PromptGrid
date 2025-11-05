import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await requireAuth()

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
  })

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthlyUsage = await prisma.aIUsage.aggregate({
    where: {
      userId: user.id,
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

  const totalUsage = await prisma.aIUsage.aggregate({
    where: { userId: user.id },
    _sum: {
      tokensUsed: true,
      cost: true,
    },
    _count: {
      id: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PromptGrid
              </Link>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/dashboard/chat" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Chat
              </Link>
              <Link href="/dashboard/analytics" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Analytics
              </Link>
              <Link href="/dashboard/templates" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Templates
              </Link>
              <Link href="/dashboard/conversations" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Conversations
              </Link>
              <Link href="/dashboard/webhooks" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Webhooks
              </Link>
              <Link href="/dashboard/api-docs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                API Docs
              </Link>
              <Link href="/dashboard/alerts" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Alerts
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Current Plan
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {subscription?.plan || 'Free'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Monthly Requests
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {monthlyUsage._count.id || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Monthly Tokens
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(monthlyUsage._sum.tokensUsed || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Cost
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(totalUsage._sum.cost || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/chat"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Start Chatting
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interact with AI models
              </p>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                View Analytics
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed usage statistics
              </p>
            </Link>
            <Link
              href="/dashboard/settings"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account
              </p>
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                API Keys
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage API access
              </p>
            </Link>
            <Link
              href="/dashboard/usage-history"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Usage History
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View detailed logs
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

