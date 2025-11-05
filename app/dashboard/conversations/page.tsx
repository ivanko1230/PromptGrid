import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ConversationsPage() {
  const user = await requireAuth()

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50,
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
              <Link href="/dashboard/conversations" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Conversations
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Conversation History
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No saved conversations yet. Start chatting to save conversations!
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <Link href={`/dashboard/chat?conversation=${conversation.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {conversation.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conversation.provider && conversation.model
                      ? `${conversation.provider} / ${conversation.model}`
                      : 'No model info'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/api/conversations/export?id=${conversation.id}&format=json`}
                    download
                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    Export JSON
                  </a>
                  <a
                    href={`/api/conversations/export?id=${conversation.id}&format=markdown`}
                    download
                    className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    Export MD
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

