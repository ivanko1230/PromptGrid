'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface UsageData {
  date: string
  tokens: number
  requests: number
  cost: number
}

interface ProviderStats {
  provider: string
  count: number
  tokens: number
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([])
  const [loading, setLoading] = useState(true)
  const [totalTokens, setTotalTokens] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setUsageData(data.dailyUsage || [])
        setProviderStats(data.providerStats || [])
        setTotalTokens(data.totalTokens || 0)
        setTotalRequests(data.totalRequests || 0)
        setTotalCost(data.totalCost || 0)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (!session) {
    return <div>Please sign in</div>
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

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
              <Link href="/dashboard/analytics" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Analytics
              </Link>
              <Link href="/dashboard/usage-history" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Usage History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Requests
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalRequests.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Tokens
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalTokens.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Cost
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalCost.toFixed(2)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Daily Usage Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Daily Usage
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tokens" stroke="#3b82f6" name="Tokens" />
                  <Line type="monotone" dataKey="requests" stroke="#8b5cf6" name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Daily Cost
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Provider Distribution */}
            {providerStats.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Provider Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={providerStats}
                      dataKey="count"
                      nameKey="provider"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {providerStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
