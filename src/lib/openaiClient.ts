import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function hasOpenAIKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export const PRIMARY_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || 'gpt-4o';

/**
 * Chat completion that requests a strict JSON object response.
 * Returns the parsed JSON (typed loosely; callers validate with zod).
 */
export async function chatJson(opts: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
}): Promise<any> {
  const client = getOpenAI();
  const completion = await client.chat.completions.create({
    model: opts.model || PRIMARY_MODEL,
    temperature: opts.temperature ?? 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
  });
  const content = completion.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}
