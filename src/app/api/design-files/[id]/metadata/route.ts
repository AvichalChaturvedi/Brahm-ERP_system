import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDesignFileMetadata } from '@/lib/design-files';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const file = await getDesignFileMetadata(id);
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(file);
}
