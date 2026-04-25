import ProjectsTable from '@/components/projects-table';
import { PageHeader } from '@/components/premium';
import { Button } from '@/components/ui';

export default function ProjectsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Hardware Programs"
        sub="Manage product development lifecycles from design validation through production."
        action={<Button>Initiate Program</Button>}
      />
      <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-[1.4fr_.8fr_.8fr]">
        <input
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
          placeholder="Search programs, suppliers, or components..."
        />
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink-soft">Refine Results</button>
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink-soft">Program Timeline</button>
      </div>
      <ProjectsTable />
    </div>
  );
}
