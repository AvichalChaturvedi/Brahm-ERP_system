'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProgramDeleteButton({ programId }: { programId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const ok = window.confirm('Delete this program and all related data? This cannot be undone.');
    if (!ok) return;
    setLoading(true);
    const res = await fetch(`/api/programs/${programId}`, { method: 'DELETE' });
    setLoading(false);
    if (!res.ok) {
      alert('Failed to delete program.');
      return;
    }
    router.push('/projects');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete Program'}
    </button>
  );
}
