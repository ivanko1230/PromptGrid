// Cost estimation utility
export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
  'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
  'gpt-3.5-turbo': { input: 0.0015 / 1000, output: 0.002 / 1000 },
  'claude-3-opus': { input: 0.015 / 1000, output: 0.075 / 1000 },
  'claude-3-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
  'claude-3-haiku': { input: 0.00025 / 1000, output: 0.00125 / 1000 },
}

// Rough estimation: ~4 characters per token for English text
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number = 0
): number {
  const costs = MODEL_COSTS[model] || { input: 0, output: 0 }
  return inputTokens * costs.input + outputTokens * costs.output
}

export function estimateRequestCost(
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens?: number
): { inputTokens: number; estimatedOutputTokens: number; estimatedCost: number } {
  // Estimate input tokens
  const inputText = messages.map(m => m.content).join(' ')
  const inputTokens = estimateTokens(inputText)

  // Estimate output tokens (use maxTokens if provided, otherwise estimate based on input)
  const estimatedOutputTokens = maxTokens || Math.min(inputTokens, 1000)

  const estimatedCost = estimateCost(model, inputTokens, estimatedOutputTokens)

  return {
    inputTokens,
    estimatedOutputTokens,
    estimatedCost,
  }
}


