"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Heading } from '@/components/ui';

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [ingestFiles, setIngestFiles] = useState<File[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      description: form.get('description'),
      customerUnit: form.get('customerUnit'),
      selectedServices,
      secureIngestFileNames: ingestFiles.map((f) => f.name),
    };
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to initialize program');
      return;
    }
    const program = await res.json();
    router.push(`/programs/${program.id}`);
  };

  return (
    <div className="space-y-6">
      <Heading title="Initiate New Hardware Program" sub="Define a new hardware program, including scope, components, and execution requirements." />
      <Card className="rounded-2xl border border-border bg-surface">
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Program Name</label>
            <input name="name" className="mt-2 w-full rounded-xl border border-border p-3" placeholder="EV Powertrain Controller Rev-D" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" className="mt-2 w-full rounded-xl border border-border p-3" placeholder="Program scope and expected outcomes" />
          </div>
          <div>
            <label className="text-sm font-medium">Customer / Business Unit</label>
            <input name="customerUnit" className="mt-2 w-full rounded-xl border border-border p-3" placeholder="Industrial Mobility Division" />
          </div>
          <div>
            <label className="text-sm font-medium">Service Scope (Multi-select)</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {['BOM Analysis', 'DFM Review', 'Quote Optimization', 'Supplier Sourcing', 'Manufacturing Support'].map((service) => (
                <button
                  type="button"
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${selectedServices.includes(service) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-white text-ink-soft'}`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Mechanical Redesign', 'Electronics Redesign'].map((service) => (
              <button
                type="button"
                key={service}
                onClick={() => toggleService(service)}
                className={`rounded-xl px-2.5 py-1.5 ${selectedServices.includes(service) ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
              >
                Premium Service: {service}
              </button>
            ))}
          </div>
          <div className="rounded-xl border-2 border-dashed border-borderStrong p-8 text-sm">
            <p className="mb-2">Secure Ingest Data: STP / STEP / STL / GBR / ZIP</p>
            <input
              type="file"
              multiple
              accept=".stp,.step,.stl,.gbr,.ger,.gerber,.zip"
              onChange={(e) => setIngestFiles(Array.from(e.target.files || []))}
              className="block w-full text-xs"
            />
            {ingestFiles.length ? (
              <ul className="mt-2 list-disc pl-5 text-xs text-ink-muted">
                {ingestFiles.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-ink-faint">No files selected yet.</p>
            )}
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={submitting} className="w-fit rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{submitting ? 'Initializing...' : 'Initialize Program'}</button>
        </form>
      </Card>
    </div>
  );
}