import { Card, Heading } from '@/components/ui';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Heading title="Initiate New Hardware Program" sub="Define a new hardware program, including scope, components, and execution requirements." />
      <Card className="rounded-2xl border border-border bg-surface">
        <form className="grid gap-5">
          <div>
            <label className="text-sm font-medium">Program Name</label>
            <input className="mt-2 w-full rounded-xl border border-border p-3" placeholder="EV Powertrain Controller Rev-D" />
          </div>
          <div>
            <label className="text-sm font-medium">Customer / Business Unit</label>
            <input className="mt-2 w-full rounded-xl border border-border p-3" placeholder="Industrial Mobility Division" />
          </div>
          <div>
            <label className="text-sm font-medium">Service Scope</label>
            <div className="mt-2 grid gap-2 rounded-xl border border-border bg-white p-3 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" /> Fabrication</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" /> Procurement</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" /> Electronics Design</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-xl bg-primary/10 px-2.5 py-1.5">Premium Service: Mechanical Redesign</span><span className="rounded-xl bg-accent/20 px-2.5 py-1.5">Premium Service: Electronics Redesign</span></div>
          <div className="rounded-xl border-2 border-dashed border-borderStrong p-8 text-sm">Secure Ingest Data: STP / STEP / STL / GBR / ZIP</div>
          <button className="w-fit rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Initialize Program</button>
        </form>
      </Card>
    </div>
  );
}