import type { NormalizedBOMItem } from '../types';

export function buildBOMAnalysisPrompt(items: NormalizedBOMItem[]) {
  return `You are a senior hardware sourcing intelligence analyst.\nReturn strict JSON with keys: executiveSummary, criticalRisks, costOpportunities, recommendedActions, confidence.\nFocus on cost reduction, lead-time speed, risk mitigation, and visibility.\n\nBOM Items:\n${JSON.stringify(items, null, 2)}`;
}
