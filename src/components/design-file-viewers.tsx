'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GerberLayerInspector, { GerberInspectionSummary, type GerberLayer } from '@/components/design-viewers/gerber-layer-inspector';
import GerberPCBViewer from '@/components/design-viewers/gerber-pcb-viewer';
import STLViewerPanel from '@/components/design-viewers/stl-viewer-panel';
import StepPreviewPlaceholder from '@/components/design-viewers/step-preview-placeholder';
import UnsupportedFilePreview from '@/components/design-viewers/unsupported-file-preview';

type ViewerMode = 'none' | 'gerber' | 'stl' | 'step' | 'unsupported';

type StoredFile = {
  id: string;
  fileName: string;
  originalName?: string;
  fileType: string;
  fileExtension?: string;
  fileUrl: string;
  storagePath?: string;
  fileSize?: number;
  uploadedAt?: string;
  createdAt: string;
  inspections?: Array<{ detectedLayers?: string[]; missingLayers?: string[]; drillFiles?: string[]; rawMetadata?: { layers?: GerberLayer[] } }>;
};

function buildLayersFromInspection(raw: StoredFile['inspections'] | undefined): GerberLayer[] {
  const insp = raw?.[0];
  if (!insp) return [];
  if (insp.rawMetadata?.layers?.length) return insp.rawMetadata.layers;
  const detected = insp.detectedLayers || [];
  return detected.map((d, i) => ({
    layerName: d,
    fileName: `Detected layer ${i + 1}`,
    layerType: d,
    detected: true,
    warnings: [],
  }));
}

export default function DesignFileViewers({ initialProgramId }: { initialProgramId?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<ViewerMode>('none');
  const [programId, setProgramId] = useState(initialProgramId || '');
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([]);
  const [stlUrl, setStlUrl] = useState<string>('');
  const [gerberSvg, setGerberSvg] = useState<string>('');
  const [status, setStatus] = useState<string>('Ingest Gerber ZIP or STL to preview securely.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [designFileId, setDesignFileId] = useState('');
  const [inspection, setInspection] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [activeFile, setActiveFile] = useState<StoredFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [renderable, setRenderable] = useState(true);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectError, setInspectError] = useState('');
  const [inspectData, setInspectData] = useState<{
    totalFiles?: number;
    layers?: GerberLayer[];
    drillFiles?: string[];
    unknownFiles?: string[];
    missingLayers?: string[];
    warnings?: string[];
  } | null>(null);
  const [gerberPreview, setGerberPreview] = useState<{ layers: Array<{ id: string; name: string; layerType: string; svg?: string }>; warnings: string[] } | null>(null);

  useEffect(() => {
    fetch('/api/programs')
      .then((r) => r.json())
      .then((data) => {
        setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => setPrograms([]));
  }, []);

  const loadProgramFiles = async (pid: string) => {
    if (!pid) {
      setStoredFiles([]);
      return;
    }
    const files = await fetch(`/api/design-files?programId=${encodeURIComponent(pid)}`).then((r) => r.json());
    setStoredFiles(Array.isArray(files) ? files : []);
  };

  useEffect(() => {
    if (programId) loadProgramFiles(programId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  useEffect(() => {
    if (!activeFile && storedFiles.length > 0) {
      void openStoredFile(storedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedFiles]);

  const openStoredFile = async (file: StoredFile) => {
    setActiveFile(file);
    setDesignFileId(file.id);
    setInspection(file.inspections?.[0] || null);
    setGerberSvg('');

    const ext = `${file.fileExtension || ''} ${file.fileType || ''} ${file.fileName || ''}`.toLowerCase();
    if (ext.includes('stl')) {
      if (!file.fileUrl?.startsWith('data:') && !file.fileUrl?.startsWith('blob:') && !file.fileUrl?.startsWith('http')) {
        setRenderable(false);
        setMode('stl');
        setStatus('STL binary not available for old upload record. Re-upload once to enable inline preview.');
        return;
      }
      setRenderable(true);
      setStlUrl(file.fileUrl);
      setMode('stl');
      setStatus(`Loaded stored STL: ${file.fileName}`);
      return;
    }
    if (ext.match(/zip|gbr|ger|gerber/)) {
      setMode('gerber');
      setRenderable(true);
      setInspectLoading(true);
      setInspectError('');
      setGerberPreview(null);
      const inspected = await fetch(`/api/design-files/${file.id}/inspect`).then((r) => r.json()).catch(() => null);
      setInspectLoading(false);
      if (inspected?.layers) setInspectData(inspected);
      if (!inspected) setInspectError('Failed to inspect Gerber ZIP.');
      const preview = await fetch(`/api/design-files/${file.id}/gerber-preview`).then((r) => r.json()).catch(() => null);
      if (preview?.layers) setGerberPreview({ layers: preview.layers, warnings: preview.warnings || [] });
      if (file.fileName.toLowerCase().match(/gbr|ger|gerber/) && file.fileUrl.startsWith('data:')) {
        try {
          const content = atob(file.fileUrl.split(',')[1] || '');
          const res = await fetch('/api/gerber/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gerber: content }),
          });
          const data = await res.json();
          if (res.ok && data.svg) setGerberSvg(data.svg);
        } catch {
          // noop
        }
      }
      setStatus(`Loaded Gerber package: ${file.fileName}`);
      return;
    }
    if (ext.match(/stp|step/)) {
      setMode('step');
      setStatus('STEP/STP preview requires conversion to glTF or STL.');
      return;
    }
    setMode('unsupported');
  };

  const onFileChange = async (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
    setSubmitted(false);

    const name = file.name.toLowerCase();

    if (name.endsWith('.stl')) {
      if (stlUrl) URL.revokeObjectURL(stlUrl);
      const url = URL.createObjectURL(file);
      setStlUrl(url);
      setMode('stl');
      setStatus(`Loaded STL: ${file.name}`);
      return;
    }

    if (name.endsWith('.gbr') || name.endsWith('.ger') || name.endsWith('.gerber')) {
      try {
        setStatus('Rendering Gerber...');
        const content = await file.text();
        const res = await fetch('/api/gerber/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gerber: content }),
        });
        const data = (await res.json()) as { svg?: string; error?: string };
        if (!res.ok || !data.svg) throw new Error(data.error || 'Unable to render Gerber');
        setGerberSvg(data.svg);
        setMode('gerber');
        setStatus(`Rendered Gerber file: ${file.name}`);
      } catch (e) {
        console.error(e);
        setStatus('Unable to render Gerber file. Please provide a valid .gbr/.ger file.');
      }
      return;
    }

    if (name.endsWith('.zip')) {
      setMode('gerber');
      setStatus(`Gerber ZIP selected: ${file.name}. Layer inspector will appear after upload.`);
      return;
    }

    if (name.endsWith('.step') || name.endsWith('.stp')) {
      setMode('step');
      setStatus(`File received: ${file.name}. STEP/STP preview requires conversion.`);
      return;
    }

    if (name.endsWith('.pdf')) {
      setMode('unsupported');
      setStatus('PDF not supported for design preview.');
      return;
    }

    setMode('unsupported');
    setStatus('Unsupported file type. Use Gerber ZIP/GBR/GER, STL, STEP/STP.');
  };

  const onSubmitForAnalysis = async () => {
    if (!selectedFile) {
      setStatus('Select a design file before submitting for DFM analysis.');
      return;
    }
    if (!programId) {
      setStatus('Select a program before submitting analysis.');
      return;
    }
    const form = new FormData();
    form.append('programId', programId);
    form.append('file', selectedFile);

    fetch('/api/design-files', {
      method: 'POST',
      body: form,
    })
      .then((r) => r.json())
      .then(async (file) => {
        setDesignFileId(file.id || '');
        await loadProgramFiles(programId);
        setActiveFile(file);
        router.refresh();
        if (String(selectedFile.name).toLowerCase().match(/\.g(br|er|erber|zip)$/)) {
          const insp = await fetch(`/api/design-files/${file.id}/gerber-inspect`, { method: 'POST' }).then((r) => r.json());
          setInspection(insp);
        }
      })
      .catch(() => undefined);
    setSubmitted(true);
    setStatus(`Submitted ${selectedFile.name} for Design Validation & DFM analysis.`);
  };

  const runAnalysis = async () => {
    if (!designFileId) {
      setStatus('Upload/submit a file first.');
      return;
    }
    setIsAnalyzing(true);
    const result = await fetch(`/api/design-files/${designFileId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: 'Manufacturing review from Design Validation page',
        inspectionMetadata: inspectData,
      }),
    }).then((r) => r.json());
    setIsAnalyzing(false);
    setReport(result);
    setStatus('DFM report generated and saved to database.');
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dfm-report-${report.id || 'latest'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="space-y-3 md:col-span-4 rounded-premium border border-primary/25 bg-black/25 p-4">
          <label className="mb-2 block text-sm font-medium text-primary">Select Design Files (Gerber GBR/GER or STL)</label>
          <select value={programId} onChange={(e) => setProgramId(e.target.value)} className="mb-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-900">
            <option value="">Select Program</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {storedFiles.length ? (
            <div className="mb-2 rounded-xl border border-border bg-surface p-2">
              <p className="text-[11px] text-ink-muted">Uploaded files in selected program</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {storedFiles.map((f) => (
                  <div key={f.id} className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] ${activeFile?.id === f.id ? 'border-primary bg-primary/10' : 'border-border bg-white'}`}>
                    <span>{f.originalName || f.fileName}</span>
                    <button type="button" onClick={() => openStoredFile(f)} className="rounded border border-border px-1.5 py-0.5 text-[10px]">
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => (activeFile ? void openStoredFile(activeFile) : undefined)}
            disabled={!activeFile}
            className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Preview Design
          </button>
          <input
            type="file"
            accept=".gbr,.ger,.gerber,.stl,.zip,.stp,.step,.pdf"
            onChange={(e) => onFileChange(e.target.files?.[0])}
            className="block w-full text-sm"
          />
          <p className="mt-2 text-xs text-zinc-300">{status}</p>
          <button
            type="button"
            onClick={onSubmitForAnalysis}
            className="mt-3 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white"
          >
            Submit for DFM Analysis
          </button>
          <button type="button" onClick={runAnalysis} disabled={!designFileId || isAnalyzing} className="ml-2 mt-3 rounded-xl border border-primary px-4 py-2 text-xs font-medium text-primary disabled:opacity-50">{isAnalyzing ? 'Analyzing...' : 'Run Design Analysis'}</button>
          <Link
            href="/quote-optimization"
            className="ml-2 mt-3 inline-flex rounded-xl border border-border bg-white px-4 py-2 text-xs font-medium text-ink"
          >
            Get Quote
          </Link>
          {submitted ? <p className="mt-2 text-xs text-emerald-300">DFM job queued successfully.</p> : null}
          {activeFile ? (
            <div className="rounded-xl border border-border bg-surface p-2 text-[11px] text-ink-muted">
              <p><b>Name:</b> {activeFile.originalName || activeFile.fileName}</p>
              <p><b>Type:</b> {activeFile.fileExtension || activeFile.fileType}</p>
              <p><b>Size:</b> {activeFile.fileSize ? `${Math.round(activeFile.fileSize / 1024)} KB` : 'N/A'}</p>
              <p><b>Uploaded:</b> {new Date(activeFile.uploadedAt || activeFile.createdAt).toLocaleString()}</p>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-8 rounded-xl border border-border bg-surface p-3">
          {!activeFile && mode === 'none' ? <p className="text-sm text-ink-muted">Select a design file to preview</p> : null}
          {mode === 'gerber' ? (
            <div className="space-y-2">
            <h3 className="mb-2 text-sm font-semibold text-primary">Gerber Viewer</h3>
            {inspectLoading ? <p className="text-xs text-ink-muted">Inspecting Gerber ZIP...</p> : null}
            {inspectError ? <p className="text-xs text-red-600">{inspectError}</p> : null}
            {(inspectData?.layers?.length || buildLayersFromInspection(activeFile?.inspections || (inspection ? [inspection] : undefined)).length) ? (
              <GerberLayerInspector layers={(inspectData?.layers as GerberLayer[]) || buildLayersFromInspection(activeFile?.inspections || (inspection ? [inspection] : undefined))} />
            ) : null}
            {inspectData ? (
              <GerberInspectionSummary
                totalFiles={inspectData.totalFiles || 0}
                drillFiles={inspectData.drillFiles || []}
                unknownFiles={inspectData.unknownFiles || []}
                missingLayers={inspectData.missingLayers || []}
                warnings={inspectData.warnings || []}
              />
            ) : null}
            {gerberPreview?.layers?.some((l) => !!l.svg) ? (
              <GerberPCBViewer layers={gerberPreview.layers} warnings={gerberPreview.warnings || []} />
            ) : null}
            {gerberSvg && !gerberPreview?.layers?.some((l) => !!l.svg) ? (
              <div className="h-[420px] w-full overflow-auto rounded-premium border border-primary/25 bg-black/30 p-2" dangerouslySetInnerHTML={{ __html: gerberSvg }} />
            ) : (
              !gerberPreview?.layers?.some((l) => !!l.svg) ? <p className="text-xs text-ink-faint">Visual rendering failed. Layer inspection is still available.</p> : null
            )}
          </div>
          ) : null}

        {mode === 'stl' && stlUrl ? (
          <div className="space-y-2">
            <h3 className="mb-2 text-sm font-semibold text-primary">3D STL Viewer</h3>
            {renderable ? <STLViewerPanel url={stlUrl} /> : <p className="text-xs text-ink-faint">STL preview unavailable for this old record. Re-upload the STL to enable inline 3D preview.</p>}
            <button type="button" onClick={() => { if (stlUrl) URL.revokeObjectURL(stlUrl); setStlUrl(''); setMode('none'); }} className="mt-2 rounded-xl border border-border px-3 py-1 text-xs">Reset View</button>
            <a href="https://sharecad.org/" target="_blank" rel="noreferrer" className="ml-2 mt-2 inline-block rounded-xl border border-border px-3 py-1 text-xs">Open advanced CAD viewer (ShareCAD)</a>
          </div>
        ) : null}

        {mode === 'step' ? <StepPreviewPlaceholder /> : null}
        {mode === 'unsupported' ? <UnsupportedFilePreview /> : null}
        </div>

        {report ? (
          <div className="md:col-span-12 rounded-xl border border-border bg-surface p-3 text-sm">
            <h3 className="font-semibold">DFM / PCB Analysis Report</h3>
            <p className="mt-1 text-xs">Manufacturability score: {report.score}/100</p>
            <p className="text-xs">Risk level: {report.riskLevel}</p>
            <p className="mt-1 text-xs">Summary: {report.summary}</p>
            <p className="mt-1 text-xs">Issues: {(report.issues || []).join(' | ')}</p>
            <p className="mt-1 text-xs">Recommendations: {(report.recommendations || []).join(' | ')}</p>
            <p className="mt-1 text-xs">Generated: {new Date(report.createdAt).toLocaleString()}</p>
            <button type="button" onClick={downloadReport} className="mt-2 rounded-xl border border-border px-3 py-1 text-xs">Download Report</button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
