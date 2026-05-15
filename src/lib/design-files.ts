import 'server-only';
import JSZip from 'jszip';
import { prisma } from '@/lib/db';

export type DesignKind = 'gerber_zip' | 'stl' | 'step' | 'pdf' | 'unknown';

export type GerberInspectionResult = {
  fileName: string;
  totalFiles: number;
  layers: Array<{
    layerName: string;
    fileName: string;
    layerType: string;
    detected: boolean;
    warnings: string[];
  }>;
  drillFiles: string[];
  unknownFiles: string[];
  missingLayers: string[];
  warnings: string[];
};

export function detectDesignFileType(fileName: string, fileType?: string): DesignKind {
  const n = `${fileName} ${fileType || ''}`.toLowerCase();
  if (n.includes('.zip')) return 'gerber_zip';
  if (n.includes('.stl')) return 'stl';
  if (n.includes('.stp') || n.includes('.step')) return 'step';
  if (n.includes('.pdf')) return 'pdf';
  return 'unknown';
}

export async function inspectGerberZip(dataUrl: string, fileName = 'gerber.zip'): Promise<GerberInspectionResult> {
  const base64 = dataUrl.split(',')[1] || '';
  const buf = Buffer.from(base64, 'base64');
  const zip = await JSZip.loadAsync(buf);
  const entries = Object.keys(zip.files).filter((k) => !zip.files[k].dir);
  const warnings: string[] = [];
  const map = entries.map((f) => {
    const n = f.replaceAll('\\', '/').toLowerCase();
    const base = n.split('/').pop() || n;
    const ext = base.includes('.') ? base.split('.').pop() || '' : '';
    let layerType = 'unknown';
    if (/gtl|top|f\.cu/.test(base) || ext === 'gtl') layerType = 'top copper';
    else if (/gbl|bottom|b\.cu/.test(base) || ext === 'gbl') layerType = 'bottom copper';
    else if (/gts|mask_top|topmask|f\.mask/.test(base) || ext === 'gts') layerType = 'solder mask';
    else if (/gbs|mask_bottom|bottommask|b\.mask/.test(base) || ext === 'gbs') layerType = 'solder mask';
    else if (/gto|topsilk|f\.silk/.test(base) || ext === 'gto') layerType = 'silkscreen';
    else if (/gbo|bottomsilk|b\.silk/.test(base) || ext === 'gbo') layerType = 'silkscreen';
    else if (/drl|xln|drill/.test(base) || ['drl', 'txt', 'xln'].includes(ext) && /drill|pth|npth/.test(base)) layerType = 'drill files';
    else if (/gko|gm1|edge|outline|board.?out/.test(base) || ['gko', 'gm1'].includes(ext)) layerType = 'outline';
    else if (['ger', 'gbr', 'pho'].includes(ext) && /top/.test(base)) layerType = 'top copper';
    else if (['ger', 'gbr', 'pho'].includes(ext) && /bottom/.test(base)) layerType = 'bottom copper';
    return { layerName: f, fileName: f, layerType, detected: layerType !== 'unknown', warnings: [] as string[] };
  });

  const required = [
    'top copper',
    'bottom copper',
    'solder mask',
    'silkscreen',
    'outline',
  ];
  const detectedLayerTypes = Array.from(new Set(map.filter((m) => m.detected).map((m) => m.layerType)));
  const missingLayers = required.filter((r) => !detectedLayerTypes.includes(r));
  const drillFiles = map.filter((m) => m.layerType === 'drill files').map((m) => m.fileName);
  const unknownFiles = map.filter((m) => !m.detected).map((m) => m.fileName);
  if (!drillFiles.length) warnings.push('No drill file detected from ZIP naming patterns.');

  return {
    fileName,
    totalFiles: entries.length,
    layers: map,
    drillFiles,
    unknownFiles,
    missingLayers,
    warnings,
  };
}

export async function getDesignFileMetadata(fileId: string) {
  return prisma.designFile.findUnique({
    where: { id: fileId },
    include: {
      inspections: { orderBy: { createdAt: 'desc' }, take: 1 },
      dfmReviews: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });
}
