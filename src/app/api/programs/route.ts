import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const workspaceId = user.defaultWorkspaceId;
  if (!workspaceId) return NextResponse.json([]);

  const programs = await prisma.program.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(programs);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const workspaceId = user.defaultWorkspaceId;
  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace missing for user' }, { status: 400 });
  }

  const body = await request.json();
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();
  const customerUnit = String(body.customerUnit || '').trim();
  const selectedServices = Array.isArray(body.selectedServices)
    ? body.selectedServices.map((s: unknown) => String(s)).filter(Boolean)
    : [];

  if (!name) {
    return NextResponse.json({ error: 'Program name is required' }, { status: 400 });
  }

  const program = await prisma.program.create({
    data: {
      workspaceId,
      createdById: user.id,
      name,
      description: description || null,
      customerUnit: customerUnit || null,
      status: 'planning',
      selectedServices,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId,
      programId: program.id,
      userId: user.id,
      action: 'program_created',
      details: `Program ${program.name} initialized.`,
    },
  });

  return NextResponse.json(program, { status: 201 });
}
