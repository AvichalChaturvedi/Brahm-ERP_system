import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { SearchCheck, Cpu, Handshake, ShieldCheck } from 'lucide-react';

const capIcons = [SearchCheck, Cpu, Handshake, ShieldCheck];

const capabilities = ['Design Review', 'BOM Sourcing', 'Quote Optimization', 'Managed Quality'];

export default function LandingPage() {
  return (
    <div className="relative">
      <header className="sticky top-0 z-20 border-b border-primary/10 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <img src="/brahmforge-logo.svg" alt="BrahmForge" className="h-8 w-auto" />
          <Button asChild>
            <Link href="/dashboard">Enter Platform</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 p-6 md:grid-cols-2">
        <Card className="border border-primary/15">
          <Badge>FUTURISTIC HARDWARE INTELLIGENCE</Badge>
          <h1 className="mt-3 text-4xl font-semibold text-primary">Premium Operating System for Hardware Procurement</h1>
          <p className="mt-3 text-slate-600">AI-first orchestration from upload to scalable manufacturing.</p>
        </Card>
        <Card className="min-h-64 border border-primary/15 bg-white/70">
          <div className="flex h-64 flex-col justify-between rounded-premium border border-primary/10 bg-[radial-gradient(circle_at_top_right,rgba(85,168,210,0.18),transparent_58%),radial-gradient(circle_at_bottom_left,rgba(36,70,142,0.08),transparent_55%)] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">BrahmForge OS</p>
            <div>
              <p className="text-2xl font-semibold text-primary">Command Center</p>
              <p className="mt-2 text-sm text-slate-600">Design, sourcing, and quality workflows in one secure, AI-assisted workspace.</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {capabilities.map((c, i) => {
            const Icon = capIcons[i];
            return (
              <Card key={c}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <Badge>{c}</Badge>
                </div>
                <p className="text-xs text-slate-600">Premium workflow with AI-assisted quality and speed.</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl p-6">
        <Card>
          <h2 className="mb-3 text-xl font-semibold text-primary">Process: Upload → AI Analysis → Optimize → Scale</h2>
          <div className="grid gap-3 md:grid-cols-4">{['Upload', 'AI Analysis', 'Optimize', 'Scale'].map((s) => <div key={s} className="rounded-premium bg-primary/10 p-3 text-center">{s}</div>)}</div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl p-6">
        <Card>
          <h2 className="text-xl font-semibold text-primary">Hardware IP Protection</h2>
          <p className="mt-2 text-sm text-slate-600">Military-grade encryption, automated NDA enforcement, traceable watermarking, and immutable access logs.</p>
        </Card>
      </section>
    </div>
  );
}