import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const displayName = String(body.displayName || '').trim();

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Email and password (min 8 chars) are required.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    const workspace = await prisma.workspace.create({
      data: { name: displayName ? `${displayName}'s Workspace` : 'BrahmForge Workspace' },
    });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        displayName: displayName || null,
        defaultWorkspaceId: workspace.id,
      },
    });

    const emailResult = await sendWelcomeEmail(user.email);
    await prisma.activityLog.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        action: 'welcome_email',
        message: emailResult.ok ? 'Welcome email sent' : 'Welcome email not sent',
        details: emailResult.ok ? 'Welcome email sent' : emailResult.reason,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
