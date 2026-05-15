'use client';

export type GerberLayer = {
  layerName: string;
  fileName: string;
  layerType: string;
  detected: boolean;
  warnings: string[];
};

export default function GerberLayerInspector({ layers }: { layers: GerberLayer[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">Gerber Layer Inspector</h4>
      <div className="space-y-1">
        {layers.map((l) => (
          <div key={l.fileName} className="flex items-center justify-between rounded-lg border border-border bg-surfaceMuted px-2 py-1 text-xs">
            <span>{l.fileName}</span>
            <span className={`rounded px-2 py-0.5 ${l.detected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{l.layerType}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GerberInspectionSummary({
  totalFiles,
  drillFiles,
  unknownFiles,
  missingLayers,
  warnings,
}: {
  totalFiles: number;
  drillFiles: string[];
  unknownFiles: string[];
  missingLayers: string[];
  warnings: string[];
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-2 text-xs space-y-1">
      <p><b>Total files:</b> {totalFiles}</p>
      <p><b>Drill files:</b> {drillFiles.length ? drillFiles.join(', ') : 'None detected'}</p>
      <p><b>Unknown files:</b> {unknownFiles.length ? unknownFiles.join(', ') : 'None'}</p>
      <p><b>Missing common layers:</b> {missingLayers.length ? missingLayers.join(', ') : 'None'}</p>
      {warnings.length ? <p><b>Warnings:</b> {warnings.join(' | ')}</p> : null}
    </div>
  );
}
