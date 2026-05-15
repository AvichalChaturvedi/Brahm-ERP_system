'use client';

export default function StepPreviewPlaceholder() {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-sm text-ink-muted">
      STEP/STP preview requires conversion to glTF or STL. Analysis can still run from metadata and provided manufacturing context.
    </div>
  );
}
