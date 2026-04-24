import { Card, Heading } from '@/components/ui';
import { bomAnalysisFlow } from '@/ai';

export default async function BomAnalysisPage() {
  const aiResult = await bomAnalysisFlow({ bomText: 'Part,Qty\nMCU,1000' });

  return (
    <div className="space-y-4">
      <Heading title="BOM Analysis & Sourcing" />
      <Card>
        <textarea
          className="min-h-40 w-full rounded-premium border border-primary/20 p-3"
          defaultValue="Paste CSV / spreadsheet BOM data"
        />
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="font-semibold">Sourcing Insights</h3>
          <p className="mt-2 text-sm">{aiResult.sourcingInsights}</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Supply Chain Risks</h3>
          <p className="mt-2 text-sm">{aiResult.supplyChainRisks}</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Suggested Alternatives</h3>
          <p className="mt-2 text-sm">{aiResult.suggestedAlternatives}</p>
        </Card>
      </div>
    </div>
  );
}