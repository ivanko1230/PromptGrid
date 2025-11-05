# PromptGrid

A modern, full-stack AI-powered SaaS platform for intelligent conversations and AI model management. Built with Next.js, TypeScript, Prisma, and NextAuth.

## Features

- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 🤖 **AI Integration** - Support for OpenAI (GPT-4, GPT-3.5) and Anthropic Claude models
- 💬 **Chat Interface** - Beautiful chat UI with markdown rendering and syntax highlighting
- 📊 **Analytics Dashboard** - Interactive charts and visualizations for usage tracking
- 📈 **Usage History** - Detailed logs of all AI API calls with filtering
- 🔑 **API Key Management** - Create and manage API keys for programmatic access
- 👥 **Admin Dashboard** - User management and platform statistics for administrators
- 💳 **Subscriptions** - Stripe integration for subscription management
- 📱 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🗄️ **Database** - SQLite (development) / PostgreSQL (production) with Prisma ORM
- 🔒 **Type Safety** - Full TypeScript support
- 📝 **Prompt Templates** - Create, manage, and share reusable prompt templates
- 💾 **Conversation History** - Save and manage chat conversations
- 🔔 **Webhooks** - Real-time event notifications for integrations
- 📚 **API Documentation** - Comprehensive API documentation page
- 💰 **Cost Estimation** - Real-time cost preview before API calls
- ⚠️ **Usage Alerts** - Get notified when usage thresholds are reached
- 🚦 **Rate Limiting** - Plan-based rate limiting for API protection
- 📥 **Export Functionality** - Export analytics and conversations (CSV, JSON, Markdown)
- 🔄 **Batch Processing** - Process multiple prompts simultaneously
- 🔍 **Search** - Search through conversations and templates
- ⚖️ **Model Comparison** - Compare responses from different AI models side-by-side
- ⭐ **Favorites** - Bookmark favorite templates and conversations

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **AI Providers**: OpenAI, Anthropic
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- SQLite (for development) or PostgreSQL database (for production)
- OpenAI API key (optional, for OpenAI models)
- Anthropic API key (optional, for Claude models)
- Stripe account (optional, for subscription payments)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database (SQLite for development, PostgreSQL for production)
DATABASE_URL="file:./dev.db"
# For PostgreSQL: DATABASE_URL="postgresql://user:password@localhost:5432/promptgrid?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# AI Providers
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Stripe (optional, for subscription payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── ai/           # AI chat endpoints
│   │   │   ├── chat/     # Chat endpoint
│   │   │   ├── batch/    # Batch processing
│   │   │   └── estimate-cost/ # Cost estimation
│   │   ├── api-keys/     # API key management
│   │   ├── analytics/    # Analytics data endpoints
│   │   │   └── export/   # Analytics export
│   │   ├── conversations/ # Conversation management
│   │   │   └── export/   # Conversation export
│   │   ├── prompt-templates/ # Prompt template management
│   │   ├── usage-alerts/ # Usage alerts management
│   │   ├── webhooks/     # Webhook management
│   │   ├── favorites/    # Favorites/bookmarks
│   │   ├── search/       # Search functionality
│   │   ├── subscriptions/ # Subscription endpoints
│   │   └── v1/           # Public API endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   │   ├── chat/         # AI chat interface
│   │   ├── analytics/    # Analytics dashboard
│   │   ├── api-keys/     # API key management
│   │   ├── usage-history/ # Usage history logs
│   │   ├── settings/     # User settings
│   │   ├── admin/        # Admin dashboard
│   │   ├── templates/    # Prompt templates
│   │   ├── conversations/ # Conversation history
│   │   ├── webhooks/     # Webhook management
│   │   ├── api-docs/     # API documentation
│   │   ├── alerts/       # Usage alerts
│   │   ├── search/       # Search page
│   │   └── compare/      # Model comparison
│   └── page.tsx          # Home page (landing page)
├── components/           # React components
├── lib/                  # Utility functions
│   ├── ai.ts            # AI integration
│   ├── auth.ts          # Auth configuration
│   ├── api-keys.ts      # API key utilities
│   ├── prisma.ts        # Prisma client
│   ├── cost-estimation.ts # Cost estimation utilities
│   ├── usage-alerts.ts  # Usage alert checking
│   ├── webhooks.ts      # Webhook triggering
│   ├── middleware.ts    # Rate limiting middleware
│   └── rate-limit.ts    # Rate limiting logic
├── prisma/
│   └── schema.prisma    # Database schema
└── types/               # TypeScript type definitions
```

## Features Overview

### Authentication
- User registration and login
- Secure password hashing with bcrypt
- Session management with JWT
- Role-based access control (user/admin)

### AI Chat
- Interactive chat interface with multiple AI models
- Support for OpenAI (GPT-4, GPT-4 Turbo, GPT-3.5) and Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Markdown rendering with syntax highlighting
- Adjustable temperature and token limits
- Real-time responses
- Usage tracking and cost calculation

### Analytics Dashboard
- Interactive charts using Recharts
- Daily usage statistics (tokens, requests, costs)
- Provider distribution visualization
- Monthly usage summaries
- Cost tracking and reporting
- Export analytics data in CSV or JSON format
- Detailed usage breakdowns

### API Key Management
- Create and manage API keys for programmatic access
- Secure key generation and storage
- Usage tracking per API key
- RESTful API endpoint at `/api/v1/chat`

### Usage History
- Detailed logs of all AI API calls
- Filter by provider, model, date
- Cost breakdown per request
- Export capabilities
- Search functionality

### Admin Dashboard
- Platform-wide statistics
- User management
- Subscription analytics
- Recent user activity

### Subscription Management
- Free, Pro, and Enterprise tiers
- Stripe integration for payments
- Usage limits based on subscription tier
- Webhook handling for subscription updates

### Rate Limiting & API Protection
- Plan-based rate limiting (per-minute and per-hour limits)
- Free: 10/min, 100/hour
- Pro: 60/min, 1,000/hour
- Enterprise: 300/min, 10,000/hour
- Rate limit headers in API responses
- Protection for both internal and external API endpoints

### Webhooks
- Create webhooks for real-time event notifications
- Event types: usage.created, conversation.saved, api_key.created, or all events
- HMAC SHA-256 signature verification
- Enable/disable webhooks dynamically
- Track last triggered timestamp

### Usage Alerts
- Set alerts for monthly requests, tokens, or cost thresholds
- Visual notifications in chat interface
- Automatic alert checking after each API call
- Prevent duplicate alerts (once per month)
- Track alert history

### Cost Estimation
- Real-time cost estimation before API calls
- Model-specific pricing accuracy
- Visual cost indicator in chat interface
- Detailed breakdown (input/output tokens)
- Expandable cost details panel

### API Documentation
- Comprehensive API documentation page
- Authentication examples
- Request/response examples
- Rate limit documentation
- Error response examples
- Available models list

### Prompt Templates
- Create and manage reusable prompt templates
- Public and private templates
- Category organization (general, coding, writing, analysis, creative)
- Usage tracking for public templates
- Share templates with the community

### Conversation History
- Save and manage chat conversations
- View conversation history with titles and metadata
- Load previous conversations
- Export conversations in JSON or Markdown format
- Search through conversation history

### Batch Processing
- Process multiple prompts simultaneously (up to 10 per batch)
- Parallel execution for faster processing
- Individual success/failure tracking per request
- Summary with total cost and tokens
- Automatic usage tracking for each request

### Search Functionality
- Search through conversations and templates
- Real-time search with debouncing
- Filter by type (all, conversations, templates)
- Search across titles, content, and descriptions
- Quick access to relevant content

### Model Comparison
- Compare up to 4 models side-by-side
- Select models from OpenAI and Anthropic
- Same prompt sent to all selected models
- Compare responses, tokens, and costs
- Visual grid layout for easy comparison

### Favorites System
- Bookmark favorite templates and conversations
- Quick access to frequently used content
- Prevent duplicate favorites
- Track favorite creation time

## Database Schema

- **User**: User accounts, authentication, and roles
- **Subscription**: User subscription plans and billing information
- **AIUsage**: AI API usage tracking and costs
- **ApiKey**: API keys for programmatic access
- **Conversation**: Saved chat conversations with messages
- **PromptTemplate**: Reusable prompt templates (public/private)
- **Webhook**: Webhook configurations for event notifications
- **UsageAlert**: Usage threshold alerts for users
- **Favorite**: Favorites/bookmarks for templates and conversations
- **Account/Session**: NextAuth session management

## Development

### Database Commands
```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Environment Variables

Make sure to set all required environment variables in `.env.local`:
- `DATABASE_URL`: Database connection string (SQLite: `file:./dev.db` or PostgreSQL connection string)
- `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `OPENAI_API_KEY`: OpenAI API key (optional, required for OpenAI models)
- `ANTHROPIC_API_KEY`: Anthropic API key (optional, required for Claude models)
- `STRIPE_SECRET_KEY`: Stripe secret key (optional, for subscription payments)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret (optional, for subscription webhooks)
- `NEXT_PUBLIC_APP_URL`: Public URL of your application (optional, for Stripe redirects)

## API Usage

### Using API Keys

Create an API key from the dashboard and use it to make requests:

```bash
curl -X POST http://localhost:3000/api/v1/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "maxTokens": 1000,
    "temperature": 0.7
  }'
```

### Batch Processing

Process multiple prompts simultaneously:

```bash
curl -X POST http://localhost:3000/api/ai/batch \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [
      {
        "provider": "openai",
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello!"}]
      },
      {
        "provider": "anthropic",
        "model": "claude-3-haiku",
        "messages": [{"role": "user", "content": "Hi!"}]
      }
    ]
  }'
```

### Cost Estimation

Estimate cost before making API calls:

```bash
curl -X POST http://localhost:3000/api/ai/estimate-cost \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "maxTokens": 1000
  }'
```

### Rate Limits

Rate limits are enforced per subscription plan:
- **Free**: 10 requests/minute, 100 requests/hour
- **Pro**: 60 requests/minute, 1,000 requests/hour
- **Enterprise**: 300 requests/minute, 10,000 requests/hour

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Admin Access

To grant admin access to a user, update their role in the database:

```sql
UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
npm run db:studio
```

## License

MIT

---

Built with ❤️ by the PromptGrid team

