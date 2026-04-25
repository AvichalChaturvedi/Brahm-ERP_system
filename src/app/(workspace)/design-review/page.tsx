import { Card } from '@/components/ui';
import { PageHeader, StatusBadge } from '@/components/premium';
import DesignFileViewers from '@/components/design-file-viewers';

export default function DesignReviewPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Design Validation & DFM Analysis" sub="Evaluate manufacturability, tolerance feasibility, and process readiness." />
      <Card>
        <p className="text-sm text-ink-muted">Design Data Ingestion</p>
        <p className="mt-2 text-sm text-ink-muted">Select design files (STEP, STL, and Gerber) for automated manufacturability analysis. All files are encrypted at rest and in transit.</p>
        <div className="mt-4 text-lg font-semibold text-primary">Manufacturability Score: 84/100</div>
        <p className="mt-1 text-xs text-ink-faint">Calculated based on tolerance feasibility, machining complexity, and manufacturing process compatibility.</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surfaceMuted px-3 py-2"><span>Tolerance Constraint Risk Identified</span><StatusBadge tone="warn">Medium</StatusBadge></div>
          <div className="rounded-xl border border-border bg-surfaceMuted px-3 py-2">
            <div className="flex items-center justify-between"><span>Trace clearance issue near high-current region</span><StatusBadge tone="danger">Critical</StatusBadge></div>
            <p className="mt-1 text-xs text-ink-faint">Introduces elevated machining cost and rejection probability. Recommended adjustment: increase clearance and reroute high-current traces.</p>
          </div>
        </div>
      </Card>
      <DesignFileViewers />
    </div>
  );
}