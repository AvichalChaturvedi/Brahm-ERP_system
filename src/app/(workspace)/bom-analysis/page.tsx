import { Card, Button } from '@/components/ui';
import { PageHeader, StatusBadge } from '@/components/premium';
import { bomAnalysisFlow } from '@/ai';

export default async function BomAnalysisPage() {
  const aiResult = await bomAnalysisFlow({ bomText: 'Part,Qty\nMCU,1000' });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Supply Chain Intelligence Engine"
        sub="Analyze bill of materials to identify sourcing risk, cost inefficiencies, and supplier dependencies."
        action={<Button>Run Supply Chain Analysis</Button>}
      />
      <Card className="rounded-2xl border border-border bg-surface">
        <textarea className="min-h-40 w-full rounded-xl border border-border p-3" defaultValue="Paste structured BOM data (PN, description, quantity, supplier...)" />
        <p className="mt-2 text-xs text-ink-faint">Analyzing component availability, pricing volatility, and supplier risk...</p>
      </Card>

      <Card className="rounded-2xl border border-border bg-surface p-0">
        <div className="border-b border-border px-4 py-3 text-sm font-medium text-ink">Parsed BOM Preview</div>
        <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs text-ink-muted">
          <span>Part</span><span>Qty</span><span>Lifecycle</span><span>Availability</span><span>Supply Risk Level</span>
        </div>
        {[
          ['STM32F4', '1000', 'Active', 'Medium', 'warn'],
          ['TPS5430', '2000', 'NRND', 'Low', 'danger'],
          ['ESP32-WROOM', '1500', 'Active', 'High', 'good'],
        ].map(([part, qty, life, avail, risk]) => (
          <div key={part} className="grid grid-cols-5 gap-2 border-t border-border px-4 py-3 text-sm">
            <span>{part}</span><span>{qty}</span><span>{life}</span><span>{avail}</span>
            <StatusBadge tone={risk as 'good' | 'warn' | 'danger'}>{risk}</StatusBadge>
          </div>
        ))}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="font-semibold">Sourcing Intelligence</h3>
          <p className="mt-2 text-sm">{aiResult.sourcingInsights}</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Unit Cost Benchmark</h3>
          <p className="mt-2 text-sm">{aiResult.supplyChainRisks}</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Qualified Alternatives</h3>
          <p className="mt-2 text-sm">{aiResult.suggestedAlternatives}</p>
        </Card>
      </div>
      <Card>
        <p className="text-sm text-ink-muted">No analysis available. Ingest BOM data to generate sourcing intelligence.</p>
      </Card>
    </div>
  );
}