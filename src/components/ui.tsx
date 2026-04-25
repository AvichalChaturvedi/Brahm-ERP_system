import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('glass-card relative overflow-hidden p-5', className)}>{children}</div>;
}

export function Button({
  className,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'rounded-premium bg-primary px-4 py-2 text-sm font-medium text-white shadow-premium transition hover:bg-primary/90',
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('rounded-premium border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary', className)}>{children}</span>;
}

export function Progress({ value = 0 }: { value?: number }) {
  return (
    <ProgressPrimitive.Root className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
      <ProgressPrimitive.Indicator className="h-full bg-accent transition-all" style={{ transform: `translateX(-${100 - value}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn('inline-flex rounded-premium bg-white p-1 shadow-sm', className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn('rounded-premium px-3 py-1 text-sm text-slate-700 data-[state=active]:bg-primary data-[state=active]:text-white', className)}
    {...props}
  />
);
export const TabsContent = TabsPrimitive.Content;

export function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h1>
      {sub ? <p className="text-base text-ink-muted">{sub}</p> : null}
    </div>
  );
}