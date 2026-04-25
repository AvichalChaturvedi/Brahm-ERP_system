import 'server-only';

import type { BOMAnalysisResult, NormalizedBOMItem } from '../types';
import { buildBOMAnalysisPrompt } from '../prompts/bom-analysis';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function analyzeWithOpenRouter(items: NormalizedBOMItem[]): Promise<BOMAnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.DEFAULT_AI_MODEL || 'meta-llama/llama-3.1-8b-instruct';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const prompt = buildBOMAnalysisPrompt(items);
  const res = await fetch(OPENROUTER_URL, {
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
    throw new Error(`OpenRouter request failed: ${res.status}`);
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
    confidence: parsed.confidence ?? 0.7,
    provider: 'openrouter',
    model,
    rawResponse: data,
  };
}
