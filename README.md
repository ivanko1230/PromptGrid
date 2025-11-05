# PromptGrid

A modern, full-stack AI-powered SaaS platform built with Next.js, TypeScript, Prisma, and NextAuth.

## Features

- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 🤖 **AI Integration** - Support for OpenAI and Anthropic Claude models
- 📊 **Usage Analytics** - Track AI usage, tokens, and costs
- 💳 **Subscriptions** - Stripe integration for subscription management
- 📱 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🔒 **Type Safety** - Full TypeScript support

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
- PostgreSQL database
- OpenAI API key (optional)
- Anthropic API key (optional)
- Stripe account (optional, for payments)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saas_ai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AI Providers
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Stripe (optional)
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
│   │   └── subscriptions/ # Subscription endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility functions
│   ├── ai.ts            # AI integration
│   ├── auth.ts          # Auth configuration
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── types/               # TypeScript type definitions
```

## Features Overview

### Authentication
- User registration and login
- Secure password hashing with bcrypt
- Session management with JWT

### AI Chat
- Chat interface with multiple AI models
- Support for OpenAI (GPT-4, GPT-3.5) and Anthropic (Claude)
- Real-time streaming responses
- Usage tracking and cost calculation

### Subscription Management
- Free, Pro, and Enterprise tiers
- Stripe integration for payments
- Usage limits based on subscription tier
- Webhook handling for subscription updates

### Analytics
- Usage statistics dashboard
- Token and cost tracking
- Monthly usage reports

## Database Schema

- **User**: User accounts and authentication
- **Subscription**: User subscription plans and billing
- **AIUsage**: AI API usage tracking and costs
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
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL
- `OPENAI_API_KEY`: OpenAI API key (optional)
- `ANTHROPIC_API_KEY`: Anthropic API key (optional)
- `STRIPE_SECRET_KEY`: Stripe secret key (optional)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret (optional)

## License

MIT

