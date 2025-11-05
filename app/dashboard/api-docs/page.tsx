import Link from 'next/link'

export default function ApiDocsPage() {
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
              <Link href="/dashboard/api-docs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                API Docs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          API Documentation
        </h1>

        <div className="space-y-12">
          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                Authorization: Bearer sk_...
              </code>
            </div>
          </section>

          {/* Chat Endpoint */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Chat Endpoint
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                POST /api/v1/chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Send a chat message to an AI model
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                Request Body:
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
{`{
  "provider": "openai",
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "maxTokens": 1000,
  "temperature": 0.7
}`}
                </pre>
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                Response:
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`{
  "content": "Hello! How can I help you?",
  "tokensUsed": 15,
  "cost": 0.00003
}`}
                </pre>
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                Example cURL:
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`curl -X POST https://api.promptgrid.com/api/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                </pre>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Rate Limits
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Rate limits are applied per subscription plan:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Free:</strong> 10 requests/minute, 100 requests/hour</li>
                <li><strong>Pro:</strong> 60 requests/minute, 1,000 requests/hour</li>
                <li><strong>Enterprise:</strong> 300 requests/minute, 10,000 requests/hour</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Rate limit information is included in response headers:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 mt-2 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1234567890`}
                </pre>
              </div>
            </div>
          </section>

          {/* Error Responses */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Error Responses
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">401 Unauthorized</h4>
                  <div className="bg-gray-900 rounded-lg p-4 mt-2 overflow-x-auto">
                    <pre className="text-red-400 text-sm">{`{"error": "Unauthorized"}`}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">429 Too Many Requests</h4>
                  <div className="bg-gray-900 rounded-lg p-4 mt-2 overflow-x-auto">
                    <pre className="text-red-400 text-sm">
{`{
  "error": "Rate limit exceeded",
  "message": "Too many requests per minute",
  "resetAt": "2024-01-01T12:00:00Z"
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">403 Forbidden</h4>
                  <div className="bg-gray-900 rounded-lg p-4 mt-2 overflow-x-auto">
                    <pre className="text-red-400 text-sm">{`{"error": "Monthly request limit exceeded"}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Available Models */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Models
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">OpenAI</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                <li>gpt-4</li>
                <li>gpt-4-turbo</li>
                <li>gpt-3.5-turbo</li>
              </ul>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Anthropic</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>claude-3-opus</li>
                <li>claude-3-sonnet</li>
                <li>claude-3-haiku</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


