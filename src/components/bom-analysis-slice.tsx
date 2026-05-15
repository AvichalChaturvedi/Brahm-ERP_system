'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BOMAnalysisSlice({ programId }: { programId: string }) {
  const router = useRouter();
  const [rawText, setRawText] = useState('partNumber,description,quantity,supplier,unitCost,category\nSTM32F4,MCU,1000,DigiKey,4.5,Semiconductor');
  const [fileName, setFileName] = useState('bom-input.csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/ai/bom-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId, fileName, sourceType: 'csv', rawText }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Failed to analyze BOM');
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
      <h3 className="text-sm font-semibold">BOM Upload & Analysis (Phase 1 MVP)</h3>
      <input className="w-full rounded border border-border px-2 py-1 text-xs" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="bom-file-name.csv" />
      <textarea className="min-h-32 w-full rounded border border-border p-2 text-xs" value={rawText} onChange={(e) => setRawText(e.target.value)} />
      <button type="button" onClick={run} disabled={loading} className="rounded bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50">{loading ? 'Analyzing...' : 'Run Supply Chain Analysis'}</button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
