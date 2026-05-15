import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { detectDesignFileType, inspectGerberZip } from '@/lib/design-files';
import { getStorageProvider } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const file = await prisma.designFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: 'Design file not found' }, { status: 404 });

  const kind = detectDesignFileType(file.fileName, file.fileType);

  if (kind === 'gerber_zip') {
    if (!file.storagePath) {
      return NextResponse.json({
        fileId: file.id,
        fileName: file.fileName,
        fileType: kind,
        layers: [],
        drillFiles: [],
        unknownFiles: [],
        missingLayers: [],
        warnings: ['Stored ZIP binary unavailable for this legacy record. Re-upload to inspect layers.'],
      });
    }

    const storage = getStorageProvider();
    const readBuffer = storage.readBuffer;
    if (!readBuffer) {
      return NextResponse.json({
        fileId: file.id,
        fileName: file.fileName,
        fileType: kind,
        layers: [],
        drillFiles: [],
        unknownFiles: [],
        missingLayers: [],
        warnings: ['Current storage provider does not support server-side ZIP inspection.'],
      });
    }

    const zipBuffer = await readBuffer(file.storagePath);
    const mime = file.fileType || 'application/zip';
    const dataUrl = `data:${mime};base64,${zipBuffer.toString('base64')}`;
    const inspected = await inspectGerberZip(dataUrl, file.fileName);
    await prisma.gerberInspection.create({
      data: {
        designFileId: file.id,
        detectedLayers: inspected.layers.filter((l) => l.detected).map((l) => l.layerType),
        missingLayers: inspected.missingLayers,
        drillFiles: inspected.drillFiles,
        rawMetadata: inspected,
      },
    });

    return NextResponse.json({
      fileId: file.id,
      fileName: file.fileName,
      fileType: kind,
      layers: inspected.layers,
      drillFiles: inspected.drillFiles,
      unknownFiles: inspected.unknownFiles,
      missingLayers: inspected.missingLayers,
      warnings: inspected.warnings,
      totalFiles: inspected.totalFiles,
    });
  }

  return NextResponse.json({
    fileId: file.id,
    fileName: file.fileName,
    fileType: kind,
    layers: [],
    drillFiles: [],
    unknownFiles: [],
    missingLayers: [],
    warnings: [],
  });
}
