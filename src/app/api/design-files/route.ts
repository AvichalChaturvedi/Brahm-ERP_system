import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { detectDesignFileType, inspectGerberZip, type GerberInspectionResult } from '@/lib/design-files';
import { getStorageProvider } from '@/lib/storage';

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 50 * 1024 * 1024);
const allowedExtensions = new Set(['zip', 'gbr', 'ger', 'gerber', 'stp', 'step', 'csv', 'xlsx']);

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const programId = String(searchParams.get('programId') || '');
  if (!programId) return NextResponse.json({ error: 'programId is required' }, { status: 400 });

  const program = await prisma.program.findFirst({
    where: { id: programId, workspaceId: user.defaultWorkspaceId || undefined },
  });
  if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

  const files = await prisma.designFile.findMany({
    where: { programId },
    orderBy: { createdAt: 'desc' },
    include: { inspections: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  return NextResponse.json(files);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const programId = String(form.get('programId') || '');
  const uploaded = form.get('file');

  if (!(uploaded instanceof File)) {
    return NextResponse.json({ error: 'file is required (multipart/form-data)' }, { status: 400 });
  }

  const fileName = uploaded.name;
  const fileType = uploaded.type || 'application/octet-stream';
  const fileSize = uploaded.size;
  const originalName = uploaded.name;
  const fileExtension = String(fileName.includes('.') ? fileName.split('.').pop() : '').toLowerCase();

  if (!allowedExtensions.has(fileExtension)) {
    return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: `File exceeds upload limit (${MAX_UPLOAD_BYTES} bytes).` }, { status: 413 });
  }

  if (!programId || !fileName || !fileType) {
    return NextResponse.json({ error: 'programId, fileName, fileType are required' }, { status: 400 });
  }

  const program = await prisma.program.findFirst({
    where: { id: programId, workspaceId: user.defaultWorkspaceId || undefined },
  });
  if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

  const storage = getStorageProvider();
  const buffer = Buffer.from(await uploaded.arrayBuffer());
  const uploadResult = await storage.upload({
    buffer,
    fileName,
    contentType: fileType,
    programId,
  });

  const designFile = await prisma.designFile.create({
    data: {
      programId,
      fileName,
      originalName: originalName || null,
      fileType,
      fileExtension: fileExtension || null,
      fileUrl: uploadResult.url,
      storagePath: uploadResult.storagePath,
      fileSize: Number.isFinite(fileSize) ? fileSize : null,
      uploadedBy: user.id,
    },
  });

  if (detectDesignFileType(fileName, fileType) === 'gerber_zip') {
    const asDataUrl = `data:${fileType};base64,${buffer.toString('base64')}`;
    const inspected: GerberInspectionResult | null = await inspectGerberZip(asDataUrl, fileName).catch(() => null);
    if (inspected) {
      await prisma.gerberInspection.create({
        data: {
          designFileId: designFile.id,
          detectedLayers: inspected.layers.filter((l) => l.detected).map((l) => l.layerType),
          missingLayers: inspected.missingLayers,
          drillFiles: inspected.drillFiles,
          rawMetadata: inspected,
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      workspaceId: user.defaultWorkspaceId || null,
      programId,
      userId: user.id,
      action: 'design_file_uploaded',
      message: `Uploaded ${fileName}`,
      details: `Uploaded ${fileName}`,
    },
  });

  return NextResponse.json(designFile, { status: 201 });
}
