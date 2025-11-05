'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function SearchPage() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'conversations' | 'templates'>('all')
  const [results, setResults] = useState<any>({ conversations: [], templates: [] })
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type: searchType }),
      })
      const data = await res.json()
      setResults(data.results || { conversations: [], templates: [] })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        handleSearch()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [query, searchType])

  if (!session) {
    return <div>Please sign in</div>
  }

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
              <Link href="/dashboard/search" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Search
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Search
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations, templates..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="conversations">Conversations</option>
              <option value="templates">Templates</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {!loading && query && (
          <div className="space-y-6">
            {(searchType === 'all' || searchType === 'conversations') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Conversations ({results.conversations?.length || 0})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.conversations?.map((conv: any) => (
                    <Link
                      key={conv.id}
                      href={`/dashboard/chat?conversation=${conv.id}`}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {conv.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(searchType === 'all' || searchType === 'templates') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Templates ({results.templates?.length || 0})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.templates?.map((template: any) => (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {template.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {template.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

