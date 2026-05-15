import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function detectLayers(fileName: string) {
  const n = fileName.toLowerCase();
  const layers: string[] = [];
  if (/top|gtl|f\.cu/.test(n)) layers.push('top copper');
  if (/bottom|gbl|b\.cu/.test(n)) layers.push('bottom copper');
  if (/mask|gts|gbs/.test(n)) layers.push('solder mask');
  if (/silk|gto|gbo/.test(n)) layers.push('silkscreen');
  const drill = /drl|drill|xln/.test(n);
  return { layers, drill };
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const file = await prisma.designFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: 'Design file not found' }, { status: 404 });

  const detected = detectLayers(file.fileName);
  const required = ['top copper', 'bottom copper', 'solder mask', 'silkscreen'];
  const missing = required.filter((x) => !detected.layers.includes(x));

  const inspection = await prisma.gerberInspection.create({
    data: {
      designFileId: id,
      detectedLayers: detected.layers,
      missingLayers: missing,
      drillFiles: detected.drill ? ['drill detected from filename'] : [],
      rawMetadata: { fileName: file.fileName, fileType: file.fileType, source: 'filename heuristics' },
    },
  });

  return NextResponse.json(inspection);
}
