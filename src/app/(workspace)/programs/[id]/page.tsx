import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { PageHeader, EmptyState } from '@/components/premium';
import { Card } from '@/components/ui';
import Link from 'next/link';
import ProgramDeleteButton from '@/components/program-delete-button';
import DesignFileViewers from '@/components/design-file-viewers';
import BOMAnalysisSlice from '@/components/bom-analysis-slice';

type ActivityLogItem = {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
};

type ProgramView = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  selectedServices: string[];
  uploads: { id: string; fileName: string; createdAt: Date; analyses: { id: string; summary: string; createdAt: Date }[] }[];
  designFiles: { id: string }[];
  dfmReviews: { score: number; riskLevel: string }[];
  activityLogs: ActivityLogItem[];
};

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = (await prisma.program.findUnique({
    where: { id },
    include: {
      uploads: { include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } } },
      designFiles: true,
      dfmReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })) as ProgramView | null;

  if (!program) return notFound();

  const activityLogs = program.activityLogs as ActivityLogItem[];
  const latestUploadWithAnalysis = program.uploads.find((u) => u.analyses?.[0]);

  return (
    <div className="space-y-5">
      <PageHeader
        title={program.name}
        sub={program.description || 'Program overview and execution intelligence.'}
        action={<ProgramDeleteButton programId={program.id} />}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-ink-muted">Created</p><p className="mt-2 text-xl font-semibold">{new Date(program.createdAt).toLocaleDateString()}</p></Card>
        <Card><p className="text-xs text-ink-muted">Status</p><p className="mt-2 text-xl font-semibold">{program.status}</p></Card>
        <Card><p className="text-xs text-ink-muted">BOM Uploads</p><p className="mt-2 text-xl font-semibold">{program.uploads.length}</p></Card>
        <Card><p className="text-xs text-ink-muted">Design Files</p><p className="mt-2 text-xl font-semibold">{program.designFiles.length}</p></Card>
        <Card><p className="text-xs text-ink-muted">Last Updated</p><p className="mt-2 text-xl font-semibold">{new Date(program.updatedAt).toLocaleDateString()}</p></Card>
      </div>
      <Card>
        <h3 className="font-semibold">Selected Services</h3>
        {program.selectedServices.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {program.selectedServices.map((s: string) => <span key={s} className="rounded-xl border border-border bg-surfaceMuted px-3 py-1 text-xs">{s}</span>)}
          </div>
        ) : <p className="mt-2 text-sm text-ink-muted">No services selected.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {program.selectedServices.includes('BOM Analysis') ? <Link href="/bom-analysis" className="rounded-xl bg-primary px-3 py-2 text-xs text-white">Go to BOM Analysis</Link> : null}
          {program.selectedServices.includes('DFM Review') ? <Link href="/design-review" className="rounded-xl bg-primary px-3 py-2 text-xs text-white">Go to Design Review</Link> : null}
          {program.selectedServices.includes('Quote Optimization') ? <Link href="/quote-optimization" className="rounded-xl bg-primary px-3 py-2 text-xs text-white">Go to Quote Optimization</Link> : null}
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Latest Analysis Status</h3>
        <p className="mt-2 text-sm text-ink-muted">{program.dfmReviews[0] ? `DFM score ${program.dfmReviews[0].score}/100 (${program.dfmReviews[0].riskLevel})` : 'No DFM analysis yet.'}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/quote-optimization" className="rounded-xl bg-primary px-3 py-2 text-xs text-white">Get Quote</Link>
          <a href="#project-design-viewer" className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-ink">Get DFM Report</a>
        </div>
      </Card>
      <BOMAnalysisSlice programId={program.id} />
      <Card>
        <h3 className="font-semibold">Latest BOM Analysis Report</h3>
        {latestUploadWithAnalysis?.analyses?.[0] ? (
          <div className="mt-2 text-sm">
            <p className="text-xs text-ink-muted">Source: {latestUploadWithAnalysis.fileName}</p>
            <p className="mt-2">{latestUploadWithAnalysis.analyses[0].summary}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">No BOM analysis yet. Use the BOM Upload & Analysis panel above.</p>
        )}
      </Card>
      <div id="project-design-viewer">
        <DesignFileViewers initialProgramId={program.id} />
      </div>
      {activityLogs.length ? (
        <Card>
          <h3 className="font-semibold">Activity Log</h3>
          <div className="mt-3 space-y-2 text-sm">
            {activityLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-border bg-surfaceMuted p-2">
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-ink-muted">{log.details || 'No details'} · {new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState title="No activity yet" sub="Program activity will appear once BOM, DFM, and optimization workflows begin." />
      )}
    </div>
  );
}
