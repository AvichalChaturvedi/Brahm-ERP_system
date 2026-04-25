import { NextResponse } from 'next/server';
import { analyzeBOMWithAI, type NormalizedBOMItem } from '@/lib/ai';

type BomRequest = {
  programId?: string;
  programName?: string;
  fileName?: string;
  sourceType?: string;
  rawText?: string;
  items: Array<{
    partNumber: string;
    description?: string;
    quantity: number;
    supplier?: string;
    unitCost?: number;
    category?: string;
  }>;
};

function deterministicRisk(item: BomRequest['items'][number]): NormalizedBOMItem {
  const desc = `${item.description || ''} ${item.category || ''}`.toLowerCase();
  const isSensitive = /(semiconductor|mcu|ic|sensor)/.test(desc);
  const highQty = item.quantity > 5000;
  const lineCost = (item.unitCost || 0) * item.quantity;

  const supplyRisk: 'low' | 'medium' | 'high' =
    !item.supplier ? 'medium' : isSensitive || highQty ? 'high' : 'low';

  const costRisk: 'low' | 'medium' | 'high' | 'unknown' =
    item.unitCost == null ? 'unknown' : lineCost > 200000 ? 'high' : lineCost > 50000 ? 'medium' : 'low';

  const availabilityRisk: 'low' | 'medium' | 'high' =
    isSensitive ? 'high' : highQty ? 'medium' : 'low';

  return {
    ...item,
    supplyRisk,
    costRisk,
    availabilityRisk,
    recommendation:
      supplyRisk === 'high'
        ? 'Qualify alternate supplier and split allocation.'
        : costRisk === 'high'
          ? 'Renegotiate volume tiers and evaluate substitutes.'
          : 'Monitor sourcing cadence and keep contingency stock.',
  };
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import('@/lib/db');
    const payload = (await request.json()) as BomRequest;
    const normalized = (payload.items || []).map(deterministicRisk);

    if (!normalized.length) {
      return NextResponse.json({ error: 'No BOM items received' }, { status: 400 });
    }

    const ai = await analyzeBOMWithAI(normalized);

    const program = payload.programId
      ? await prisma.program.findUnique({ where: { id: payload.programId } })
      : await prisma.program.create({
          data: {
            name: payload.programName || 'Untitled Program',
            description: 'Auto-created from BOM analysis API.',
            status: 'active',
          },
        });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    const upload = await prisma.bOMUpload.create({
      data: {
        programId: program.id,
        fileName: payload.fileName || 'bom-input.csv',
        sourceType: payload.sourceType || 'manual',
        rawText: payload.rawText || JSON.stringify(payload.items),
      },
    });

    await prisma.bOMItem.createMany({
      data: normalized.map((i) => ({
        uploadId: upload.id,
        partNumber: i.partNumber,
        description: i.description,
        quantity: i.quantity,
        supplier: i.supplier,
        unitCost: i.unitCost,
        category: i.category,
        supplyRisk: i.supplyRisk || 'low',
        costRisk: i.costRisk || 'unknown',
        availabilityRisk: i.availabilityRisk || 'low',
        recommendation: i.recommendation,
      })),
    });

    await prisma.analysisResult.create({
      data: {
        uploadId: upload.id,
        provider: ai.provider,
        model: ai.model,
        summary: ai.executiveSummary,
        criticalRisks: ai.criticalRisks,
        costOpportunities: ai.costOpportunities,
        recommendedActions: ai.recommendedActions,
        rawResponse: ai.rawResponse as object,
      },
    });

    return NextResponse.json({
      programId: program.id,
      uploadId: upload.id,
      normalized,
      analysis: ai,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
