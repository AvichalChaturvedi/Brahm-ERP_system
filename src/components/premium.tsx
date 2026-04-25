'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export function PageHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-1">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h1>
        {sub ? <p className="mt-2 text-base text-ink-muted">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  meta,
}: {
  label: string;
  value: string;
  meta?: string;
}) {
  return (
    <Card className="rounded-2xl border border-border bg-surface">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {meta ? <p className="mt-1 text-xs text-ink-faint">{meta}</p> : null}
    </Card>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: 'neutral' | 'good' | 'warn' | 'danger';
  children: ReactNode;
}) {
  const cls =
    tone === 'good'
      ? 'bg-green-50 text-green-700 border-green-200'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : tone === 'danger'
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-surfaceMuted text-ink-soft border-border';
  return <span className={`rounded-xl border px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

export function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <Card className="rounded-2xl border border-dashed border-borderStrong bg-surface text-center">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{sub}</p>
    </Card>
  );
}
