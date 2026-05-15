import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/storage';

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params;
  const rel = decodeURIComponent((p.path || []).join('/'));
  if (!rel) return NextResponse.json({ error: 'Missing file path' }, { status: 400 });

  if ((process.env.STORAGE_PROVIDER || 's3').toLowerCase() === 's3') {
    const storagePath = rel.startsWith('s3://') ? rel : `s3://${rel}`;
    const storage = getStorageProvider();
    if (storage.readBuffer) {
      try {
        const data = await storage.readBuffer(storagePath);
        return new NextResponse(new Uint8Array(data), { status: 200, headers: { 'Content-Type': 'application/octet-stream' } });
      } catch {
        // fallback to local path read below
      }
    }
  }

  const full = path.join(process.cwd(), 'uploads', rel);
  try {
    const data = await fs.readFile(full);
    return new NextResponse(data, {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
