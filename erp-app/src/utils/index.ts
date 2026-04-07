export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDatetime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getInitials = (name: string | undefined): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'not_started': 'bg-slate-100 text-slate-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'blocked': 'bg-red-100 text-red-800',
    'review': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'planning': 'bg-slate-100 text-slate-800',
    'at_risk': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-slate-200 text-slate-700',
    'active': 'bg-green-100 text-green-800',
    'on_hold': 'bg-yellow-100 text-yellow-800',
    'pending': 'bg-slate-100 text-slate-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'changes_requested': 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-slate-100 text-slate-800';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'low': 'bg-slate-100 text-slate-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-slate-100 text-slate-800';
};

export const clsx = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter((c) => typeof c === 'string').join(' ');
};
