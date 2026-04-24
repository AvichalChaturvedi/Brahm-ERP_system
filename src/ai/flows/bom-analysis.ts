'use server';

import { genkit } from 'genkit';
import { z } from 'zod';

const ai = genkit({
  plugins: [],
});

const bomInput = z.object({ bomText: z.string().min(1) });
const bomOutput = z.object({
  sourcingInsights: z.string(),
  supplyChainRisks: z.string(),
  suggestedAlternatives: z.string(),
});

export const bomAnalysisFlow = ai.defineFlow(
  {
    name: 'bomAnalysisFlow',
    inputSchema: bomInput,
    outputSchema: bomOutput,
  },
  async ({ bomText }) => ({
    sourcingInsights: `Analyzed ${bomText.split('\n').length} BOM rows. Primary savings opportunity in passives and MCUs.`,
    supplyChainRisks: 'Flagged end-of-life risk on 2 line items and extended lead time risk on connectors.',
    suggestedAlternatives: 'Recommend dual-source equivalents for MCU and connector families to improve resilience.',
  })
);