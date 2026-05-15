import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  FileSearch,
  PackageSearch,
  BadgeDollarSign,
  BarChart3,
  Settings,
  Phone,
} from 'lucide-react';

const items = [
  ['Overview', '/dashboard', LayoutDashboard],
  ['Programs', '/projects', FolderKanban],
  ['New Program', '/projects/new', FlaskConical],
  ['Design Review & DFM', '/design-review', FileSearch],
  ['BOM Analysis', '/bom-analysis', PackageSearch],
  ['Quote Optimization', '/quote-optimization', BadgeDollarSign],
  ['Pipeline Analytics', '/pipeline', BarChart3],
  ['Settings', '/settings', Settings],
  ['Contact Sales', '/contact-sales', Phone],
] as const;

export default async function WorkspaceShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[340px_1fr]">
      <aside className="border-r border-sidebarHover bg-sidebar px-6 py-7 text-sidebar-text">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-xl px-1 py-1">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <span className="text-sm font-semibold tracking-tight text-white">BF</span>
          </span>
          <span className="block leading-tight">
            <span className="block text-base font-semibold text-white">BrahmForge</span>
            <span className="mt-0.5 block text-[11px] text-sidebar-text/70">{user?.displayName ? `${user.displayName} · Intelligent Manufacturing` : 'Intelligent Manufacturing'}</span>
          </span>
        </Link>
        <Link
          href="/"
          className="mb-6 inline-flex w-full items-center justify-center rounded-xl border border-sidebarHover bg-sidebarHover px-3 py-2 text-xs font-medium text-sidebar-text"
        >
          Back to Home
        </Link>
        <nav className="space-y-2">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-sidebar-text transition hover:bg-sidebarHover"
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-5 md:p-8 xl:p-10">
        <div className="mx-auto w-full max-w-[90rem]">{children}</div>
      </main>
    </div>
  );
}