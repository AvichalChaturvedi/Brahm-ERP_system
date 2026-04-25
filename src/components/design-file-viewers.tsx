'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import { StlViewer } from 'react-19-stl-viewer';

type ViewerMode = 'none' | 'gerber' | 'stl';

export default function DesignFileViewers() {
  const [mode, setMode] = useState<ViewerMode>('none');
  const [stlUrl, setStlUrl] = useState<string>('');
  const [gerberSvg, setGerberSvg] = useState<string>('');
  const [status, setStatus] = useState<string>('Ingest Gerber ZIP or STL to preview securely.');

  const stlStyle = useMemo(
    () => ({
      width: '100%',
      height: '420px',
      borderRadius: '0.75rem',
      background: '#130d20',
    }),
    []
  );

  const onFileChange = async (file?: File) => {
    if (!file) return;

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
        if (!res.ok || !data.svg) {
          throw new Error(data.error || 'Unable to render Gerber');
        }

        setGerberSvg(data.svg);

        setMode('gerber');
        setStatus(`Rendered Gerber file: ${file.name}`);
      } catch (e) {
        console.error(e);
        setStatus('Unable to render Gerber file. Please provide a valid .gbr/.ger file.');
      }
      return;
    }

    setStatus('Unsupported file type. Use Gerber (.gbr/.ger) or STL (.stl).');
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="rounded-premium border border-primary/25 bg-black/25 p-4">
          <label className="mb-2 block text-sm font-medium text-primary">Select Design Files (Gerber GBR/GER or STL)</label>
          <input
            type="file"
            accept=".gbr,.ger,.gerber,.stl"
            onChange={(e) => onFileChange(e.target.files?.[0])}
            className="block w-full text-sm"
          />
          <p className="mt-2 text-xs text-zinc-300">{status}</p>
        </div>

        {mode === 'gerber' && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-primary">Gerber Viewer (Free)</h3>
            <div
              className="h-[420px] w-full overflow-auto rounded-premium border border-primary/25 bg-black/30 p-2"
              dangerouslySetInnerHTML={{ __html: gerberSvg }}
            />
          </div>
        )}

        {mode === 'stl' && stlUrl && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-primary">3D STL Viewer (Free)</h3>
            <StlViewer style={stlStyle} orbitControls shadows showAxes url={stlUrl} />
          </div>
        )}
      </div>
    </Card>
  );
}
