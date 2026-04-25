import { Card } from '@/components/ui';
import { PageHeader } from '@/components/premium';

export default function ContactSalesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Engage with BrahmForge" sub="Connect with our team to evaluate how BrahmForge can optimize your hardware development and manufacturing operations." />
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input className="mt-1 w-full rounded-xl border border-border p-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Organization</label>
            <input className="mt-1 w-full rounded-xl border border-border p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Program Requirements / Use Case</label>
            <textarea className="mt-1 min-h-28 w-full rounded-xl border border-border p-2" />
          </div>
        </div>
        <button className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Request Consultation</button>
        <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm text-ink-soft">Phone: +91-80-0000-0000</p>
        <p className="text-sm text-ink-soft">Email: sales@brahmworks.com</p>
        <p className="text-sm text-ink-soft">Headquarters: BrahmWorks, Yeshwanthpur, Bengaluru, India</p>
        </div>
      </Card>
    </div>
  );
}