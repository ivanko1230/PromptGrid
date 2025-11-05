import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export type AIProvider = 'openai' | 'anthropic'

export interface AIRequest {
  provider: AIProvider
  model: string
  messages: Array<{ role: string; content: string }>
  maxTokens?: number
  temperature?: number
}

export interface AIResponse {
  content: string
  tokensUsed: number
  cost: number
}

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
  'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
  'gpt-3.5-turbo': { input: 0.0015 / 1000, output: 0.002 / 1000 },
  'claude-3-opus': { input: 0.015 / 1000, output: 0.075 / 1000 },
  'claude-3-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
  'claude-3-haiku': { input: 0.00025 / 1000, output: 0.00125 / 1000 },
}

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model] || { input: 0, output: 0 }
  return inputTokens * costs.input + outputTokens * costs.output
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  if (request.provider === 'openai') {
    const completion = await openai.chat.completions.create({
      model: request.model,
      messages: request.messages as any,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
    })

    const content = completion.choices[0]?.message?.content || ''
    const tokensUsed =
      (completion.usage?.prompt_tokens || 0) +
      (completion.usage?.completion_tokens || 0)
    const cost = estimateCost(
      request.model,
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0
    )

    return { content, tokensUsed, cost }
  } else if (request.provider === 'anthropic') {
    const message = await anthropic.messages.create({
      model: request.model,
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature,
      messages: request.messages as any,
    })

    const content = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens
    const cost = estimateCost(
      request.model,
      message.usage.input_tokens,
      message.usage.output_tokens
    )

    return { content, tokensUsed, cost }
  }

  throw new Error(`Unsupported provider: ${request.provider}`)
}

