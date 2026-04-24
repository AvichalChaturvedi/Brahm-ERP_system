import { Card, Heading } from '@/components/ui';
import DesignFileViewers from '@/components/design-file-viewers';

export default function DesignReviewPage() {
  return (
    <div className="space-y-4">
      <Heading title="Design Review & DFM" sub="AI-guided manufacturability screening" />
      <Card>
        <p className="text-sm">Secure design upload portal</p>
        <div className="mt-4 text-lg font-semibold text-primary">DFM Health Score: 84/100</div>
        <ul className="mt-3 list-disc pl-6 text-sm text-slate-600">
          <li>Tolerance stack-up risk in bracket assembly</li>
          <li>Trace clearance issue near high-current region</li>
        </ul>
      </Card>
      <DesignFileViewers />
    </div>
  );
}