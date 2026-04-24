import Link from 'next/link';
import type { ReactNode } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  FlaskConical,
  FileSearch,
  PackageSearch,
  BadgeDollarSign,
  BarChart3,
  Settings,
  Phone,
} from 'lucide-react';

const items = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['New Project', '/projects/new', FlaskConical],
  ['Design Review & DFM', '/design-review', FileSearch],
  ['BOM Analysis', '/bom-analysis', PackageSearch],
  ['Quote Optimization', '/quote-optimization', BadgeDollarSign],
  ['Pipeline Analytics', '/pipeline', BarChart3],
  ['Settings', '/settings', Settings],
  ['Contact Sales', '/contact-sales', Phone],
] as const;

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[270px_1fr]">
      <aside className="border-r border-primary/10 bg-white/70 p-4 backdrop-blur">
        <Link href="/" className="mb-6 flex items-center gap-2 font-semibold text-primary">
          <Image src="/brahmforge-logo.svg" alt="BrahmForge" width={150} height={30} priority />
        </Link>
        <Link
          href="/"
          className="mb-4 inline-flex rounded-premium bg-primary px-3 py-2 text-xs font-medium text-white"
        >
          Back to Home
        </Link>
        <nav className="space-y-2">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-premium px-3 py-2 text-sm text-slate-700 transition hover:bg-primary/10"
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}