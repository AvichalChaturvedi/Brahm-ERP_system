import { Card, Button } from '@/components/ui';
import { PageHeader, StatusBadge } from '@/components/premium';
import { quoteOptimizationFlow } from '@/ai';

export default async function QuoteOptimizationPage() {
  const res = await quoteOptimizationFlow({ supplierQuotes: 'Supplier A: 120k, Supplier B: 112k' });

  return (
    <div className="space-y-5">
      <PageHeader title="Procurement Optimization Engine" sub="Generate cost-efficient sourcing strategies using supplier benchmarking and batch optimization." action={<Button>Optimize Procurement Strategy</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-0">
          <div className="border-b border-border px-4 py-3 text-sm font-medium text-ink">Supplier Quotations</div>
          {[
            ['Supplier A', '₹120,000', '28 days', 'Medium'],
            ['Supplier B', '₹112,000', '35 days', 'High'],
            ['Supplier C', '₹118,500', '22 days', 'Low'],
          ].map(([s, c, l, r]) => (
            <div key={s} className="grid grid-cols-4 border-t border-border px-4 py-3 text-sm">
              <span>{s}</span><span>{c}</span><span>{l}</span><StatusBadge tone={r === 'Low' ? 'good' : r === 'High' ? 'danger' : 'warn'}>{r}</StatusBadge>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="font-semibold">AI Optimized Procurement Strategy</h3>
          <p className="mt-2 text-sm">{res.optimizedStrategy}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {res.negotiationPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="mt-3 rounded-xl border border-border bg-surfaceMuted p-3 text-xs text-ink-muted">
            <p>Optimal Cost Scenario: Supplier C with phased lot allocation.</p>
            <p className="mt-1">Projected Cost Reduction: ₹4.6L</p>
          </div>
        </Card>
      </div>
    </div>
  );
}