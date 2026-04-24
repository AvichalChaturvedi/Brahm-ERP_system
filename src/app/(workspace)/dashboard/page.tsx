import { Card, Heading, Progress } from '@/components/ui';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Heading title="Dashboard Overview" sub="Live hardware operations insights" />
      <div className="grid gap-4 md:grid-cols-4">{['Active Projects: 12', 'Sourcing Events: 28', 'System Health: 99.2%', 'Lead Time: 16 days'].map((v) => <Card key={v} className="border border-primary/15"><p className="font-medium text-slate-800">{v}</p></Card>)}</div>
      <Card>
        <h3 className="mb-3 font-semibold text-primary">Active Hardware Projects</h3>
        <div className="space-y-3 text-sm">{[['BMS Rev-C', 78, 'Good'], ['EV Charger Enclosure', 43, 'Watch'], ['Sensor Node X2', 91, 'Excellent']].map((r) => <div key={r[0]} className="grid grid-cols-3 items-center gap-3 rounded-premium border border-primary/15 bg-white/70 p-3"><span>{r[0]}</span><div><Progress value={r[1] as number} /><span className="text-xs text-slate-500">{r[1]}%</span></div><span>{r[2]}</span></div>)}</div>
      </Card>
      <Card><h3 className="font-semibold text-primary">AI Insights</h3><p className="mt-2 text-sm text-slate-600">Potential 11.8% landed-cost reduction by supplier consolidation and MOQ renegotiation.</p></Card>
    </div>
  );
}