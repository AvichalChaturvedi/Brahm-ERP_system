import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const context = String(body.context || '').trim();
  const inspectionMetadata = body.inspectionMetadata ?? null;

  const file = await prisma.designFile.findUnique({
    where: { id },
    include: { inspections: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  if (!file) return NextResponse.json({ error: 'Design file not found' }, { status: 404 });

  const inspection = file.inspections[0];
  const hasMissing = Array.isArray((inspection?.missingLayers as string[] | undefined)) && (inspection?.missingLayers as string[]).length > 0;
  const score = file.fileType.includes('stl') ? 82 : hasMissing ? 68 : 78;
  const riskLevel = score >= 80 ? 'low' : score >= 70 ? 'medium' : 'high';
  const issues = hasMissing
    ? ['Gerber layer set appears incomplete from filename-based detection.']
    : ['No geometric checks performed; metadata-based review only.'];
  const recommendations = [
    'Confirm full manufacturing package includes drill, mask, and silkscreen layers.',
    'Validate trace/spacing in CAM tool before fabrication release.',
  ];

  const review = await prisma.dFMReview.create({
    data: {
      programId: file.programId,
      designFileId: file.id,
      score,
      riskLevel,
      summary: `AI-assisted review generated from metadata for ${file.fileName}. ${context ? `Context: ${context}` : ''}`,
      issues,
      recommendations,
      provider: process.env.AI_PROVIDER || 'rules+ai',
      model: process.env.DEFAULT_AI_MODEL || 'metadata-review-v1',
      rawResponse: {
        confidence: 0.62,
        note: 'No exact geometric trace/drill extraction performed in this MVP path.',
        inspection,
        inspectionMetadata,
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: user.defaultWorkspaceId || null,
      programId: file.programId,
      userId: user.id,
      action: 'dfm_review_generated',
      message: `DFM review generated for ${file.fileName}`,
      details: `DFM review generated for ${file.fileName}`,
    },
  });

  return NextResponse.json(review);
}
