import { Card, Heading } from '@/components/ui';

export default function NewProjectPage() {
  return (
    <div className="space-y-4">
      <Heading title="Project Initialization" sub="Create a secure premium hardware project" />
      <Card>
        <form className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Service</label>
            <select className="mt-1 w-full rounded-premium border border-primary/20 p-2"><option>Fabrication</option><option>Procurement</option><option>Electronics Design</option></select>
          </div>
          <div className="flex gap-2 text-xs"><span className="rounded-premium bg-primary/10 px-2 py-1">Premium Service: Mechanical Redesign</span><span className="rounded-premium bg-accent/20 px-2 py-1">Premium Service: Electronics Redesign</span></div>
          <div className="rounded-premium border-2 border-dashed border-primary/30 p-6 text-sm">Secure Upload: STP / STEP / STL / GBR / ZIP</div>
        </form>
      </Card>
    </div>
  );
}