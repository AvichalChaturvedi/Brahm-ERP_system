import { Card, Heading, Progress } from '@/components/ui';
import { Search, Bell, CircleUserRound } from 'lucide-react';

export default function DashboardPage() {
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
        ['Active Programs', '12', '+2 this week'],
        ['Sourcing Events', '28', 'Active procurement and supplier engagement cycles'],
        ['System Reliability', '99.2%', 'Aggregated production and supplier reliability score'],
        ['Average Lead Time', '16 days', '-3 days QoQ'],
      ].map((v) => <Card key={v[0]} className="rounded-2xl border border-border"><p className="text-xs text-ink-muted">{v[0]}</p><p className="mt-2 text-2xl font-semibold text-ink">{v[1]}</p><p className="mt-1 text-xs text-ink-faint">{v[2]}</p></Card>)}</div>

      <div className="grid gap-5 lg:grid-cols-3">
      <Card>
        <h3 className="mb-3 font-semibold text-ink">Active Hardware Programs</h3>
        <div className="space-y-3 text-sm">{[['BMS Rev-C', 78, 'Good'], ['EV Charger Enclosure', 43, 'Watch'], ['Sensor Node X2', 91, 'Excellent']].map((r) => <div key={r[0]} className="grid grid-cols-[1.6fr_1fr_.7fr] items-center gap-3 rounded-xl border border-border bg-surface p-3"><span>{r[0]}</span><div><Progress value={r[1] as number} /><span className="text-xs text-ink-faint">{r[1]}%</span></div><span className="text-right text-ink-soft">{r[2]}</span></div>)}</div>
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="font-semibold text-ink">Intelligence Feed</h3>
        <p className="mt-2 text-sm text-ink-muted">Potential 11.8% landed-cost reduction identified via supplier consolidation and MOQ renegotiation strategies.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {['Component Supply Disruption Detected', 'Procurement Optimization Identified', 'On-time Delivery Reliability: 96%'].map((k) => (
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