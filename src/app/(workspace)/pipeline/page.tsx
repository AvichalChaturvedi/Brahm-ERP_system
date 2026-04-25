'use client';

import { Card, Heading } from '@/components/ui';
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const spend = [
  { m: 'Jan', spend: 90, save: 14 },
  { m: 'Feb', spend: 110, save: 18 },
  { m: 'Mar', spend: 130, save: 21 },
  { m: 'Apr', spend: 125, save: 25 },
];

const lead = [
  { m: 'Jan', days: 28 },
  { m: 'Feb', days: 24 },
  { m: 'Mar', days: 20 },
  { m: 'Apr', days: 16 },
];

export default function PipelinePage() {
  return (
    <div className="space-y-4">
      <Heading title="Operational Intelligence Dashboard" sub="Analyze cost efficiency, production timelines, and supplier performance across all programs." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-80">
          <p className="mb-2 text-xs text-ink-muted">Monthly Procurement Spend</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spend" fill="#24468E" />
              <Bar dataKey="save" fill="#55A8D2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <p className="mb-2 text-xs text-ink-muted">Production Lead Time Trends</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lead}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="days" stroke="#24468E" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <p className="text-sm text-ink-muted">Total Cost Savings Realized</p>
        <p className="mt-1 text-xs text-ink-faint">Lead Time Reduction · Manufacturing Reliability Score</p>
        <p className="mt-2 text-3xl font-semibold text-ink">96.4</p>
      </Card>
    </div>
  );
}