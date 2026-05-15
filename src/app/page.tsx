import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PackageSearch, BadgeDollarSign, ShieldCheck, FolderKanban, Upload, ScanSearch, SlidersHorizontal, Factory } from 'lucide-react';
import { Button } from '@/components/ui';

const metrics = [
  { label: 'Procurement cost reduction', value: '18%' },
  { label: 'Faster sourcing cycles', value: '32%' },
  { label: 'Lead-time improvement', value: '21%' },
];

const capabilities = [
  {
    title: 'Reduce BOM risk before it becomes delay',
    description: 'Detect lifecycle and sourcing exposure early, with actionable alternates.',
    Icon: PackageSearch,
  },
  {
    title: 'Negotiate supplier quotes with confidence',
    description: 'Compare cost, lead time, and reliability in one optimization view.',
    Icon: BadgeDollarSign,
  },
  {
    title: 'Improve DFM readiness at every revision',
    description: 'Flag manufacturability issues early and prevent expensive rework loops.',
    Icon: ShieldCheck,
  },
  {
    title: 'Protect hardware IP by default',
    description: 'Secure workspace controls, auditability, and governed collaboration.',
    Icon: FolderKanban,
  },
];

const flow = [
  { title: 'Ingest Data', desc: 'BOM, CAD, supplier data', icon: '/upload_icon.png', Icon: Upload },
  { title: 'Run Analysis', desc: 'AI risk + DFM intelligence', icon: '/analyze_icon.png', Icon: ScanSearch },
  { title: 'Optimize', desc: 'Quote and sourcing strategy', icon: '/Optimize_icon.png', Icon: SlidersHorizontal },
  { title: 'Manufacture', desc: 'Execute with live visibility', icon: '/Manufacture_icon.png', Icon: Factory },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827]">
      <header className="w-full border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-3 lg:px-10">
          <Image src="/Brahm-Forge-LOGO.png" alt="BrahmForge" width={700} height={350} className="h-20 w-auto object-contain drop-shadow-sm lg:h-24 xl:h-[7rem]" priority />
          <nav className="hidden items-center gap-8 text-sm text-[#6B7280] md:flex">
            <a href="#platform">Platform</a>
            <a href="#showcase">Solutions</a>
            <a href="#security">Security</a>
            <a href="#resources">Resources</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] shadow-none hover:bg-[#F9FAFB]">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] shadow-none hover:bg-[#F9FAFB]">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[#111827] shadow-none hover:bg-[#F9FAFB]">
              <Link href="/contact-sales">Book Demo</Link>
            </Button>
            <Button asChild className="rounded-xl bg-[#F97316] px-4 py-2 text-white hover:bg-[#EA580C]">
              <Link href="/projects/new">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[90rem] space-y-14 px-4 py-10 md:px-6 md:py-14">
        <section id="platform" className="grid items-center gap-10 py-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF3E0] px-3 py-1 text-xs font-medium text-[#9A3412]">Enterprise Hardware Intelligence Platform</span>
            <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">The Operating System for Modern Hardware Development</h1>
            <p className="mt-4 text-base text-[#6B7280]">Unify design validation, supply chain intelligence, and manufacturing execution in one platform.</p>
            <p className="mt-2 text-base text-[#6B7280]">Ingest Data. Run Analysis. Optimize. Manufacture.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-[#F97316] px-5 py-2.5 text-white hover:bg-[#EA580C]"><Link href="/projects/new">Get Started</Link></Button>
              <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-[#111827] shadow-none hover:bg-[#F9FAFB]"><Link href="/auth/signup">Create Account</Link></Button>
              <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-[#111827] shadow-none hover:bg-[#F9FAFB]"><Link href="/contact-sales">Request Demo</Link></Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-lg">
            <Image src="/hero_dashboard.png" alt="BrahmForge product dashboard" width={1400} height={900} className="h-auto w-full rounded-xl object-cover" />
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <p className="text-3xl font-semibold text-[#F97316]">{m.value}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="showcase" className="space-y-6">
          {[{
            title: 'Keep complex hardware programs on-track end to end.',
            description: 'Manage milestones, ownership, files, and execution status in one lifecycle view for faster, cleaner handoffs.',
          }, {
            title: 'Identify BOM risk before it impacts cost and timelines.',
            description: 'AI-driven BOM intelligence surfaces exposure, alternate parts, and sourcing recommendations instantly.',
          }, {
            title: 'Optimize supplier and manufacturing decisions with confidence.',
            description: 'Compare quote scenarios, balance lead time and risk, and execute with measurable outcomes.',
          }].map((s, i) => (
            <div key={s.title} className="grid items-center gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm lg:grid-cols-2">
              <div className={i % 2 ? 'lg:order-2' : ''}>
                <h2 className="text-2xl font-semibold leading-tight md:text-3xl">{s.title}</h2>
                <p className="mt-3 text-base text-[#6B7280]">{s.description}</p>
              </div>
              <div className={i % 2 ? 'lg:order-1' : ''}>
                <Image src="/hero_dashboard.png" alt={s.title} width={1200} height={800} className="h-auto w-full rounded-xl border border-[#E5E7EB] object-cover" />
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(({ title, description, Icon }) => (
              <div key={title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-xl">
                <Icon className="h-5 w-5 text-[#F97316]" />
                <p className="mt-3 text-sm font-semibold leading-snug">{title}</p>
                <p className="mt-2 text-xs text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">How BrahmForge works</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
            {flow.map(({ title, desc, icon, Icon }, i) => (
              <div key={title} className="contents">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#FFF3E0]">
                    <Image src={icon} alt={title} width={24} height={24} className="hidden h-6 w-6 object-contain md:block" />
                    <Icon className="h-5 w-5 text-[#F97316] md:hidden" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-[#6B7280]">{desc}</p>
                  </div>
                </div>
                {i < 3 ? <ArrowRight className="hidden h-4 w-4 text-[#9CA3AF] md:block" /> : null}
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Operational intelligence at a glance</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {['Spend Trend', 'Lead Time Trend', 'Supplier Health'].map((title) => (
                <div key={title} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <p className="text-xs text-[#6B7280]">{title}</p>
                  <div className="mt-3 rounded-lg border border-[#E5E7EB] bg-white p-2">
                    <Image src="/chart.png" alt={title} width={500} height={300} className="h-20 w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF8EF] p-6 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-[#F97316]" />
            <h3 className="mt-3 text-lg font-semibold">Built for sensitive hardware IP.</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Secure uploads, role-based access, and full audit visibility protect your designs from concept to production.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {['NDA Enforcement', 'Encrypted Storage', 'Access Logs', 'Watermarked Exports'].map((item) => (
                <span key={item} className="rounded-full border border-[#FED7AA] bg-white px-2.5 py-1 text-[#9A3412]">{item}</span>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#FED7AA] bg-[#FFEBD5] p-2">
              <Image src="/Security-LOGO.png" alt="Security illustration" width={300} height={300} className="h-24 w-full rounded-lg object-contain" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <h3 className="text-3xl font-semibold tracking-tight">Turn hardware complexity into predictable execution.</h3>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#6B7280]">See how BrahmForge helps your team reduce risk, speed sourcing, and scale manufacturing decisions.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-xl bg-[#F97316] px-5 py-2.5 text-white hover:bg-[#EA580C]"><Link href="/projects/new">Get Started</Link></Button>
            <Button asChild className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-[#111827] shadow-none hover:bg-[#F9FAFB]"><Link href="/contact-sales">Talk to Sales</Link></Button>
          </div>
        </section>
      </main>
    </div>
  );
}
