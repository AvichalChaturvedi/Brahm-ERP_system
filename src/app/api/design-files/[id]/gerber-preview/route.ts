import { NextResponse } from 'next/server';
import gerberToSvg from 'gerber-to-svg';
import JSZip from 'jszip';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getStorageProvider } from '@/lib/storage';

export const runtime = 'nodejs';

function streamToString(stream: NodeJS.ReadWriteStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let out = '';
    stream.on('data', (chunk) => {
      out += chunk.toString();
    });
    stream.on('end', () => resolve(out));
    stream.on('error', reject);
  });
}

function classifyLayer(path: string) {
  const n = path.toLowerCase();
  const base = n.split('/').pop() || n;
  if (/gtl|top|f\.cu/.test(base)) return 'top copper';
  if (/gbl|bottom|b\.cu/.test(base)) return 'bottom copper';
  if (/gts|mask_top|topmask|f\.mask/.test(base)) return 'solder mask';
  if (/gbs|mask_bottom|bottommask|b\.mask/.test(base)) return 'solder mask';
  if (/gto|topsilk|f\.silk/.test(base)) return 'silkscreen';
  if (/gbo|bottomsilk|b\.silk/.test(base)) return 'silkscreen';
  if (/drl|xln|drill/.test(base)) return 'drill';
  if (/gko|gm1|edge|outline|board.?out/.test(base)) return 'outline';
  return 'unknown';
}

async function renderGerber(content: string) {
  const converter = gerberToSvg(content) as any;
  converter.end();
  return streamToString(converter as NodeJS.ReadWriteStream);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const file = await prisma.designFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: 'Design file not found' }, { status: 404 });
  if (!file.storagePath) {
    return NextResponse.json({ error: 'Preview source not available for this record', layers: [] }, { status: 200 });
  }

  const storage = getStorageProvider();
  const readBuffer = storage.readBuffer;
  if (!readBuffer) {
    return NextResponse.json({ error: 'Current storage provider does not support server-side preview', layers: [] }, { status: 200 });
  }

  const raw = await readBuffer(file.storagePath);

  const fileName = file.fileName.toLowerCase();
  const warnings: string[] = [];
  const layers: Array<{ id: string; name: string; layerType: string; svg?: string }> = [];

  try {
    if (fileName.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(raw);
      const entries = Object.keys(zip.files).filter((k) => !zip.files[k].dir);
      for (const entry of entries) {
        const layerType = classifyLayer(entry);
        const ext = (entry.split('.').pop() || '').toLowerCase();
        const isGerber = ['gbr', 'ger', 'gtl', 'gbl', 'gts', 'gbs', 'gto', 'gbo', 'gko', 'gm1', 'pho'].includes(ext) || layerType !== 'unknown';
        if (!isGerber) continue;
        let svg: string | undefined;
        if (layerType !== 'drill') {
          const txt = await zip.files[entry].async('string').catch(() => '');
          if (txt) {
            svg = await renderGerber(txt).catch(() => undefined);
          }
        }
        layers.push({ id: entry, name: entry, layerType, svg });
      }
    } else {
      const txt = raw.toString('utf8');
      const svg = await renderGerber(txt).catch(() => undefined);
      layers.push({ id: file.id, name: file.fileName, layerType: classifyLayer(file.fileName), svg });
    }

    if (!layers.length) warnings.push('No Gerber-renderable layers found in this file/package.');
    if (!layers.some((l) => l.svg)) warnings.push('Visual rendering failed for all detected layers. Layer inspection is still available.');

    return NextResponse.json({
      fileId: file.id,
      fileName: file.fileName,
      layers,
      warnings,
    });
  } catch {
    return NextResponse.json({
      fileId: file.id,
      fileName: file.fileName,
      layers: [],
      warnings: ['Visual rendering failed. Layer inspection is still available.'],
    });
  }
}
