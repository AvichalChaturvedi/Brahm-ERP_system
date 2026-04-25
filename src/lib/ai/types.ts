export type NormalizedBOMItem = {
  partNumber: string;
  description?: string;
  quantity: number;
  supplier?: string;
  unitCost?: number;
  category?: string;
  supplyRisk?: 'low' | 'medium' | 'high';
  costRisk?: 'low' | 'medium' | 'high' | 'unknown';
  availabilityRisk?: 'low' | 'medium' | 'high';
  recommendation?: string;
};

export type BOMAnalysisResult = {
  executiveSummary: string;
  criticalRisks: string[];
  costOpportunities: string[];
  recommendedActions: string[];
  confidence: number;
  provider: string;
  model: string;
  rawResponse: unknown;
};

export type AIProviderName = 'groq' | 'openrouter';
