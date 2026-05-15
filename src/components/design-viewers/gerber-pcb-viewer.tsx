'use client';

import { useMemo, useState } from 'react';

type Layer = { id: string; name: string; layerType: string; svg?: string };

export default function GerberPCBViewer({ layers, warnings }: { layers: Layer[]; warnings: string[] }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const effective = useMemo(
    () => layers.filter((l) => (visible[l.id] ?? true) && !!l.svg),
    [layers, visible]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 text-xs">
        <button type="button" className="rounded border px-2 py-1" onClick={() => setZoom((z) => Math.min(5, z + 0.2))}>Zoom +</button>
        <button type="button" className="rounded border px-2 py-1" onClick={() => setZoom((z) => Math.max(0.2, z - 0.2))}>Zoom -</button>
        <button type="button" className="rounded border px-2 py-1" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
        <button type="button" className="rounded border px-2 py-1" onClick={() => { setZoom(0.9); setPan({ x: 0, y: 0 }); }}>Fit</button>
      </div>

      <div className="flex flex-wrap gap-1 text-[11px]">
        {layers.map((l) => (
          <label key={l.id} className="inline-flex items-center gap-1 rounded border px-2 py-1">
            <input type="checkbox" checked={visible[l.id] ?? true} onChange={(e) => setVisible((v) => ({ ...v, [l.id]: e.target.checked }))} />
            <span>{l.layerType}</span>
          </label>
        ))}
      </div>

      {warnings.length ? <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs">{warnings.join(' | ')}</div> : null}

      <div className="h-[460px] overflow-auto rounded-xl border border-border bg-white">
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
          {effective.length ? (
            effective.map((l) => (
              <div key={l.id} className="opacity-90" dangerouslySetInnerHTML={{ __html: l.svg || '' }} />
            ))
          ) : (
            <p className="p-3 text-xs text-ink-muted">Visual rendering failed. Layer inspection is still available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
