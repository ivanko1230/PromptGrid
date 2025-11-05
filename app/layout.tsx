import '../app/globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PromptGrid - AI-Powered Conversations Made Simple',
  description: 'Access GPT-4, Claude, and more AI models through one unified platform. Build intelligent applications with powerful APIs and beautiful interfaces.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

