import React from 'react';
import { formatDate, getStatusColor, getPriorityColor } from '../utils';

export const StatusBadge: React.FC<{ status: string; label?: string }> = ({ status, label }) => {
  const colorClass = getStatusColor(status);
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {label || status.replace(/_/g, ' ')}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: string; label?: string }> = ({ priority, label }) => {
  const colorClass = getPriorityColor(priority);
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {label || priority.replace(/_/g, ' ')}
    </span>
  );
};

export const DateBadge: React.FC<{ date?: string; label?: string }> = ({ date, label }) => {
  if (!date) return null;
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      {label || formatDate(date)}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
  const baseClasses = 'font-medium rounded-lg transition flex items-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}> = ({ value, onChange, placeholder, type = 'text', className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}> = ({ value, onChange, options, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
