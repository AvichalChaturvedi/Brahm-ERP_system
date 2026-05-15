import Link from 'next/link';
import { PageHeader } from '@/components/premium';
import { Button } from '@/components/ui';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type ProgramCard = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  updatedAt: Date;
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const programs: ProgramCard[] = user?.defaultWorkspaceId
    ? await prisma.program.findMany({
        where: { workspaceId: user.defaultWorkspaceId },
        orderBy: { updatedAt: 'desc' },
      })
    : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hardware Programs"
        sub="Manage product development lifecycles from design validation through production."
        action={<Button asChild><Link href="/projects/new">Initiate Program</Link></Button>}
      />
      <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[1.4fr_.8fr_.8fr]">
        <input
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
          placeholder="Search programs, suppliers, or components..."
        />
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink-soft">Refine Results</button>
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink-soft">Program Timeline</button>
      </div>
      {!programs.length ? (
        <div className="rounded-2xl border border-dashed border-borderStrong bg-surface p-8 text-center">
          <p className="text-lg font-medium text-ink">No programs yet</p>
          <p className="mt-1 text-sm text-ink-muted">Create your first hardware program to start BOM analysis, DFM, and optimization workflows.</p>
          <Button asChild className="mt-4"><Link href="/projects/new">Initialize Program</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <Link key={program.id} href={`/programs/${program.id}`} className="rounded-2xl border border-border bg-surface p-5 transition hover:shadow-premium">
              <p className="text-xs text-ink-muted">{program.status}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{program.name}</h3>
              <p className="mt-1 text-sm text-ink-muted line-clamp-2">{program.description || 'No description yet.'}</p>
              <p className="mt-4 text-xs text-ink-faint">Updated {new Date(program.updatedAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
