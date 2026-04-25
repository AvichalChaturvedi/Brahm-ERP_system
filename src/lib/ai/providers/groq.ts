import 'server-only';

import type { BOMAnalysisResult, NormalizedBOMItem } from '../types';
import { buildBOMAnalysisPrompt } from '../prompts/bom-analysis';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function analyzeWithGroq(items: NormalizedBOMItem[]): Promise<BOMAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.DEFAULT_AI_MODEL || 'llama-3.1-8b-instant';

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const prompt = buildBOMAnalysisPrompt(items);
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq request failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content) as Omit<BOMAnalysisResult, 'provider' | 'model' | 'rawResponse'>;

  return {
    executiveSummary: parsed.executiveSummary || 'BOM analysis completed.',
    criticalRisks: parsed.criticalRisks || [],
    costOpportunities: parsed.costOpportunities || [],
    recommendedActions: parsed.recommendedActions || [],
    confidence: parsed.confidence ?? 0.75,
    provider: 'groq',
    model,
    rawResponse: data,
  };
}
