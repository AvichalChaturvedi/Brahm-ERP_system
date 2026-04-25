import 'server-only';

import type { BOMAnalysisResult, NormalizedBOMItem } from './types';
import { analyzeWithGroq } from './providers/groq';
import { analyzeWithOpenRouter } from './providers/openrouter';

export async function analyzeBOMWithAI(input: NormalizedBOMItem[]): Promise<BOMAnalysisResult> {
  const preferred = (process.env.AI_PROVIDER || 'groq').toLowerCase();

  if (preferred === 'openrouter') {
    try {
      return await analyzeWithOpenRouter(input);
    } catch {
      return analyzeWithGroq(input);
    }
  }

  try {
    return await analyzeWithGroq(input);
  } catch {
    return analyzeWithOpenRouter(input);
  }
}

export type { BOMAnalysisResult, NormalizedBOMItem } from './types';
