'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui';
import { StatusBadge } from '@/components/premium';

type Project = {
  name: string;
  type: string;
  status: string;
  owner: string;
  health: 'good' | 'warn' | 'danger';
  budget: string;
  timeline: string;
  startDate: string;
  targetCompletion: string;
  lastActivity: string;
};

const rows: Project[] = [
  { name: 'BMS Rev-C', type: 'Electronics', status: 'Design Validation', owner: 'Arjun', health: 'good', budget: '₹24L', timeline: 'Q2', startDate: '12 Jan 2026', targetCompletion: '30 Jun 2026', lastActivity: '2h ago' },
  { name: 'EV Charger Enclosure', type: 'Mechanical', status: 'Sourcing Phase', owner: 'Suhani', health: 'warn', budget: '₹16L', timeline: 'Q3', startDate: '05 Feb 2026', targetCompletion: '22 Sep 2026', lastActivity: '5h ago' },
  { name: 'Sensor Node X2', type: 'Embedded', status: 'In Production', owner: 'Nikhil', health: 'good', budget: '₹11L', timeline: 'Q2', startDate: '18 Mar 2026', targetCompletion: '15 Jul 2026', lastActivity: '1d ago' },
  { name: 'Power Board X12', type: 'Power', status: 'Procurement', owner: 'Karan', health: 'danger', budget: '₹32L', timeline: 'Q4', startDate: '02 Apr 2026', targetCompletion: '10 Nov 2026', lastActivity: '3d ago' },
];

const c = createColumnHelper<Project>();
const columns = [
  c.accessor('name', { header: 'Program Name' }),
  c.accessor('type', { header: 'Type' }),
  c.accessor('status', { header: 'Status' }),
  c.accessor('owner', { header: 'Owner' }),
  c.accessor('health', {
    header: 'Reliability',
    cell: (ctx) => <StatusBadge tone={ctx.getValue()}>{ctx.getValue()}</StatusBadge>,
  }),
  c.accessor('budget', { header: 'Allocated Budget' }),
  c.accessor('timeline', { header: 'Program Timeline' }),
  c.accessor('startDate', { header: 'Start Date' }),
  c.accessor('targetCompletion', { header: 'Target Completion' }),
  c.accessor('lastActivity', { header: 'Last Activity' }),
  c.display({
    id: 'action',
    header: 'Action',
    cell: () => <Button className="px-3 py-1.5 text-xs">View Program</Button>,
  }),
];

export default function ProjectsTable() {
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="min-w-full text-sm">
        <thead className="bg-surfaceMuted">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-4 py-3 text-left font-medium text-ink-soft">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              {r.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-ink-muted">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
