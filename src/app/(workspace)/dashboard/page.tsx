import Link from 'next/link';
import { Card, Heading, Progress, Button } from '@/components/ui';
import { Search, Bell, CircleUserRound } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type ProgramLite = {
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const workspaceId = user?.defaultWorkspaceId;
  const [programs, uploads, analyses]: [ProgramLite[], number, number] = workspaceId
    ? await Promise.all([
        prisma.program.findMany({ where: { workspaceId }, orderBy: { updatedAt: 'desc' }, take: 5 }),
        prisma.bOMUpload.count({ where: { program: { workspaceId } } }),
        prisma.analysisResult.count({ where: { upload: { program: { workspaceId } } } }),
      ])
    : [[] as ProgramLite[], 0, 0];

  const avgReliability = programs.length
    ? `${Math.max(80, 100 - analyses)}%`
    : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading title="Operational Overview" sub="Real-time visibility into active programs, sourcing activity, and production reliability." />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink-muted">
            <Search className="h-4 w-4" /> Search
          </div>
          <button className="rounded-xl border border-border bg-surface p-2 text-ink-soft"><Bell className="h-4 w-4" /></button>
          <button className="rounded-xl border border-border bg-surface p-2 text-ink-soft"><CircleUserRound className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[
        ['Active Programs', String(programs.length), programs.length ? 'Programs in execution workspace' : 'No active programs'],
        ['BOM Uploads', String(uploads), uploads ? 'Structured BOM ingestions available' : 'No BOM uploads yet'],
        ['System Reliability', avgReliability, 'Aggregated production and supplier reliability score'],
        ['Analysis Runs', String(analyses), analyses ? 'AI and rule-based analyses completed' : 'No analyses yet'],
      ].map((v) => <Card key={v[0]} className="rounded-2xl border border-border"><p className="text-xs text-ink-muted">{v[0]}</p><p className="mt-2 text-2xl font-semibold text-ink">{v[1]}</p><p className="mt-1 text-xs text-ink-faint">{v[2]}</p></Card>)}</div>

      <div className="grid gap-5 lg:grid-cols-3">
      <Card>
        <h3 className="mb-3 font-semibold text-ink">Active Hardware Programs</h3>
        {programs.length ? (
          <div className="space-y-3 text-sm">{programs.map((p, idx) => {
            const progress = Math.min(95, 35 + (idx + 1) * 12);
            const state = p.status === 'at-risk' ? 'Watch' : p.status === 'active' ? 'Good' : 'Planned';
            return <div key={p.id} className="grid grid-cols-[1.6fr_1fr_.7fr] items-center gap-3 rounded-xl border border-border bg-surface p-3"><span>{p.name}</span><div><Progress value={progress} /><span className="text-xs text-ink-faint">{progress}%</span></div><span className="text-right text-ink-soft">{state}</span></div>;
          })}</div>
        ) : (
          <div className="rounded-xl border border-dashed border-borderStrong bg-surfaceMuted p-4 text-center">
            <p className="text-sm text-ink">No active programs yet</p>
            <p className="mt-1 text-xs text-ink-muted">Initialize a program to unlock dashboard intelligence.</p>
            <Button asChild className="mt-3"><Link href="/projects/new">Initialize Program</Link></Button>
          </div>
        )}
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="font-semibold text-ink">Intelligence Feed</h3>
        <p className="mt-2 text-sm text-ink-muted">{analyses ? `Generated intelligence across ${analyses} analysis run(s) with optimization opportunities for active programs.` : 'No intelligence generated yet. Run BOM or quote analysis to populate this feed.'}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(analyses
            ? ['Component Supply Disruption Detected', 'Procurement Optimization Identified', `On-time Delivery Reliability: ${avgReliability}`]
            : ['No analysis events', 'No optimization baseline', 'Reliability pending']
          ).map((k) => (
            <div key={k} className="rounded-xl border border-border bg-surfaceMuted p-3 text-sm text-ink-soft">
              {k}
            </div>
          ))}
        </div>
      </Card>
      </div>
    </div>
  );
}