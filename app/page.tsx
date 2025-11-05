import { getCurrentUser } from '@/lib/auth-helpers'
import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'

export default async function Home() {
  const user = await getCurrentUser()
  
  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />
  }

  // Show authenticated home page for logged in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PromptGrid
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to PromptGrid
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your AI-powered platform for intelligent conversations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              AI Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Interact with advanced AI models
            </p>
            <Link
              href="/dashboard/chat"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your AI usage and costs
            </p>
            <Link
              href="/dashboard/analytics"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              View Analytics
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your account and subscription
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PromptGrid
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Conversations
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Access GPT-4, Claude, and more AI models through one unified platform. 
              Build intelligent applications with powerful APIs and beautiful interfaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth/signin"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features to build and scale your AI applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="Multiple AI Models"
              description="Access GPT-4, GPT-3.5, Claude Opus, Sonnet, and Haiku all in one place"
            />
            <FeatureCard
              icon="💬"
              title="Beautiful Chat Interface"
              description="Modern chat UI with markdown rendering and syntax highlighting"
            />
            <FeatureCard
              icon="📊"
              title="Analytics Dashboard"
              description="Track usage, costs, and performance with interactive charts"
            />
            <FeatureCard
              icon="🔑"
              title="API Access"
              description="RESTful API with secure key management for programmatic access"
            />
            <FeatureCard
              icon="📈"
              title="Usage Tracking"
              description="Detailed logs and history of all your AI interactions"
            />
            <FeatureCard
              icon="💳"
              title="Flexible Pricing"
              description="Free tier available, with Pro and Enterprise plans for scale"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              name="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                '100 requests/month',
                '100K tokens/month',
                'Access to GPT-3.5 & Claude Haiku',
                'Basic analytics',
                'Community support'
              ]}
              cta="Get Started"
              ctaLink="/auth/signup"
              featured={false}
            />
            <PricingCard
              name="Pro"
              price="$29"
              pricePeriod="/month"
              description="For growing businesses"
              features={[
                '1,000 requests/month',
                '1M tokens/month',
                'Access to GPT-4 & Claude Opus',
                'Advanced analytics',
                'API access',
                'Priority support'
              ]}
              cta="Start Pro Trial"
              ctaLink="/auth/signup"
              featured={true}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large organizations"
              features={[
                'Unlimited requests',
                'Unlimited tokens',
                'All AI models',
                'Custom integrations',
                'Dedicated support',
                'SLA guarantee'
              ]}
              cta="Contact Sales"
              ctaLink="/auth/signup"
              featured={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers building with PromptGrid
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">PromptGrid</h3>
              <p className="text-sm">
                AI-powered platform for intelligent conversations
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard/chat" className="hover:text-white">Chat</Link></li>
                <li><Link href="/dashboard/analytics" className="hover:text-white">Analytics</Link></li>
                <li><Link href="/dashboard/api-keys" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} PromptGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  pricePeriod = '',
  description,
  features,
  cta,
  ctaLink,
  featured = false,
}: {
  name: string
  price: string
  pricePeriod?: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  featured?: boolean
}) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg ${featured ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
      {featured && (
        <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
          POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
        {pricePeriod && <span className="text-gray-600 dark:text-gray-400">{pricePeriod}</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
          featured
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
