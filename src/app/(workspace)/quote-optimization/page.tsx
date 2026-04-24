import { Card, Heading } from '@/components/ui';
import { quoteOptimizationFlow } from '@/ai';

export default async function QuoteOptimizationPage() {
  const res = await quoteOptimizationFlow({ supplierQuotes: 'Supplier A: 120k, Supplier B: 112k' });

  return (
    <div className="space-y-4">
      <Heading title="Quote Optimization Engine" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Supplier Quote Comparison</h3>
          <div className="mt-2 text-sm">A: ₹120,000 vs B: ₹112,000</div>
        </Card>
        <Card>
          <h3 className="font-semibold">AI Optimized Strategy</h3>
          <p className="mt-2 text-sm">{res.optimizedStrategy}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {res.negotiationPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}