'use client';

import { useMemo } from 'react';
import { StlViewer } from 'react-19-stl-viewer';

export default function STLViewerPanel({ url }: { url: string }) {
  const style = useMemo(() => ({ width: '100%', height: '420px', background: '#111827', borderRadius: '0.75rem' }), []);
  return <StlViewer style={style} orbitControls shadows showAxes url={url} />;
}
