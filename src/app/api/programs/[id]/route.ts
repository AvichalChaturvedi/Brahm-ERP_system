import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const program = await prisma.program.findFirst({
    where: { id, workspaceId: user.defaultWorkspaceId || undefined },
    include: {
      uploads: true,
      designFiles: true,
      dfmReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 25 },
    },
  });
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(program);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const program = await prisma.program.findFirst({
    where: { id, workspaceId: user.defaultWorkspaceId || undefined },
  });
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.activityLog.create({
    data: {
      workspaceId: user.defaultWorkspaceId || null,
      programId: program.id,
      userId: user.id,
      action: 'program_delete_requested',
      message: `Delete requested for ${program.name}`,
      details: `Delete requested for ${program.name}`,
    },
  });

  await prisma.activityLog.deleteMany({ where: { programId: program.id } });
  await prisma.program.delete({ where: { id: program.id } });

  await prisma.activityLog.create({
    data: {
      workspaceId: user.defaultWorkspaceId || null,
      userId: user.id,
      action: 'program_deleted',
      message: `Program ${program.name} deleted`,
      details: `Program ${program.name} deleted`,
    },
  });

  return NextResponse.json({ ok: true });
}
