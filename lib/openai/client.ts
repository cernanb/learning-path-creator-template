import OpenAI from 'openai'

let openai: OpenAI | null = null

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'Missing OPENAI_API_KEY environment variable. Please set it to use the hint generation feature.'
    )
  }

  if (!openai) {
    openai = new OpenAI({ apiKey })
  }

  return openai
}
