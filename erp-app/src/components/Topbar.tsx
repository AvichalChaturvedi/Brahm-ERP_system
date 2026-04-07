import React from 'react';
import { Menu, X, BarChart3, Moon, Sun } from 'lucide-react';
import { useUIStore } from '../store';

export const Topbar: React.FC<{ title?: string }> = ({ title = 'ERP System' }) => {
  const { sidebarOpen, setSidebarOpen, darkMode, setDarkMode } = useUIStore();

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};
