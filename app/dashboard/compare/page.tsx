'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ModelComparisonPage() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState('')
  const [models, setModels] = useState<string[]>(['gpt-3.5-turbo', 'gpt-4'])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const availableModels = [
    { provider: 'openai', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
    { provider: 'anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  ]

  const handleCompare = async () => {
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResults([])

    try {
      const requests = models.map((model) => {
        const provider = availableModels.find((p) =>
          p.models.includes(model)
        )?.provider || 'openai'

        return fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            model,
            messages: [{ role: 'user', content: prompt }],
            maxTokens: 1000,
            temperature: 0.7,
          }),
        }).then((res) => res.json())
      })

      const responses = await Promise.allSettled(requests)

      const formattedResults = responses.map((result, index) => {
        if (result.status === 'fulfilled' && result.value.content) {
          return {
            model: models[index],
            success: true,
            content: result.value.content,
            tokensUsed: result.value.tokensUsed,
            cost: result.value.cost,
          }
        }
        return {
          model: models[index],
          success: false,
          error: result.status === 'rejected' ? result.reason.message : 'Request failed',
        }
      })

      setResults(formattedResults)
    } catch (error) {
      console.error('Comparison error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleModel = (model: string) => {
    if (models.includes(model)) {
      setModels(models.filter((m) => m !== model))
    } else if (models.length < 4) {
      setModels([...models, model])
    }
  }

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
              <Link href="/dashboard/compare" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Model Comparison
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Models to Compare (up to 4)
          </h2>
          <div className="space-y-4">
            {availableModels.map((providerGroup) => (
              <div key={providerGroup.provider}>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {providerGroup.provider}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {providerGroup.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        models.includes(model)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Enter Prompt
          </h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[150px]"
          />
          <button
            onClick={handleCompare}
            disabled={loading || !prompt.trim() || models.length === 0}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Comparing...' : 'Compare Models'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {result.model}
                  </h3>
                  {result.success && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {result.tokensUsed} tokens • ${result.cost.toFixed(6)}
                    </div>
                  )}
                </div>
                {result.success ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {result.content}
                    </p>
                  </div>
                ) : (
                  <div className="text-red-600 dark:text-red-400">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


