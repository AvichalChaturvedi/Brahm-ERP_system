import { NextResponse } from 'next/server';
import { analyzeBOMWithAI, type NormalizedBOMItem } from '@/lib/ai';
import Papa from 'papaparse';
import { getCurrentUser } from '@/lib/auth';

type BomRequest = {
  programId?: string;
  programName?: string;
  fileName?: string;
  sourceType?: string;
  rawText?: string;
  items?: Array<{
    partNumber: string;
    description?: string;
    quantity: number;
    supplier?: string;
    unitCost?: number;
    category?: string;
  }>;
};

const demoSupplierHints: Record<string, { supplyRisk: 'low' | 'medium' | 'high'; availabilityRisk: 'low' | 'medium' | 'high' }> = {
  digikey: { supplyRisk: 'low', availabilityRisk: 'low' },
  mouser: { supplyRisk: 'low', availabilityRisk: 'low' },
  lcsc: { supplyRisk: 'medium', availabilityRisk: 'medium' },
  broker: { supplyRisk: 'high', availabilityRisk: 'high' },
};

type InputBomItem = {
  partNumber: string;
  description?: string;
  quantity: number;
  supplier?: string;
  unitCost?: number;
  category?: string;
};

function parseBomRows(rawText: string): InputBomItem[] {
  const parsed = Papa.parse<Record<string, string>>(rawText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return (parsed.data || []).map((r) => ({
    partNumber: String(r.partnumber || r.part || r.pn || r.mpn || '').trim(),
    description: String(r.description || r.desc || '').trim() || undefined,
    quantity: Number(r.quantity || r.qty || 0) || 0,
    supplier: String(r.supplier || r.vendor || '').trim() || undefined,
    unitCost: r.unitcost || r.cost || r.price ? Number(r.unitcost || r.cost || r.price) : undefined,
    category: String(r.category || r.type || '').trim() || undefined,
  })).filter((x) => x.partNumber && x.quantity > 0);
}

function deterministicRisk(item: InputBomItem): NormalizedBOMItem {
  const desc = `${item.description || ''} ${item.category || ''}`.toLowerCase();
  const isSensitive = /(semiconductor|mcu|ic|sensor)/.test(desc);
  const highQty = item.quantity > 5000;
  const lineCost = (item.unitCost || 0) * item.quantity;

  const hint = item.supplier ? demoSupplierHints[item.supplier.toLowerCase()] : undefined;
  const supplyRisk: 'low' | 'medium' | 'high' =
    hint?.supplyRisk || (!item.supplier ? 'medium' : isSensitive || highQty ? 'high' : 'low');

  const costRisk: 'low' | 'medium' | 'high' | 'unknown' =
    item.unitCost == null ? 'unknown' : lineCost > 200000 ? 'high' : lineCost > 50000 ? 'medium' : 'low';

  const availabilityRisk: 'low' | 'medium' | 'high' =
    hint?.availabilityRisk || (isSensitive ? 'high' : highQty ? 'medium' : 'low');

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
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = (await request.json()) as BomRequest;
    const sourceItems: InputBomItem[] = payload.items?.length ? payload.items : (payload.rawText ? parseBomRows(payload.rawText) : []);
    const normalized = sourceItems.map(deterministicRisk);

    if (!normalized.length) {
      return NextResponse.json({ error: 'No BOM items received' }, { status: 400 });
    }

    const ai = await analyzeBOMWithAI(normalized).catch(() => ({
      executiveSummary: `Rule-based analysis completed for ${normalized.length} BOM items.`,
      criticalRisks: normalized.filter((n) => n.supplyRisk === 'high' || n.availabilityRisk === 'high').map((n) => `${n.partNumber}: elevated sourcing risk`),
      costOpportunities: normalized.filter((n) => n.costRisk === 'high' || n.costRisk === 'medium').map((n) => `${n.partNumber}: negotiate better volume pricing`),
      recommendedActions: [
        'Dual-source high-risk semiconductors',
        'Create safety stock plan for long lead-time items',
      ],
      confidence: 0.61,
      provider: 'fallback-rules',
      model: 'deterministic-v1',
      rawResponse: { fallback: true },
    }));

    const program = payload.programId
      ? await prisma.program.findUnique({ where: { id: payload.programId } })
      : await prisma.program.create({
          data: {
            workspaceId: user.defaultWorkspaceId,
            createdById: user.id,
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
        rawText: payload.rawText || JSON.stringify(sourceItems),
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

    await prisma.activityLog.create({
      data: {
        workspaceId: user.defaultWorkspaceId || null,
        programId: program.id,
        userId: user.id,
        action: 'bom_analysis_completed',
        details: `BOM analyzed: ${normalized.length} items from ${payload.fileName || 'manual input'}`,
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
