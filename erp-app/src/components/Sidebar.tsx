import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Folder,
  CheckSquare,
  Zap,
  Layout,
  Cpu,
  Layers,
  Box,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useUIStore } from '../store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <Home size={20} />, section: 'dashboard' },
  { label: 'Projects', href: '/projects', icon: <Folder size={20} />, section: 'projects' },
  { label: 'Tasks', href: '/tasks', icon: <CheckSquare size={20} />, section: 'tasks' },
  { label: 'Quality & Release', href: '/qa', icon: <Zap size={20} />, section: 'qa' },
  { label: 'Firmware', href: '/firmware', icon: <Cpu size={20} />, section: 'firmware' },
  { label: 'UI/UX', href: '/uiux', icon: <Layout size={20} />, section: 'uiux' },
  { label: 'PCB Engineering', href: '/pcb', icon: <Layers size={20} />, section: 'pcb' },
  { label: 'BOM & Procurement', href: '/bom', icon: <Box size={20} />, section: 'bom' },
  { label: 'Documents', href: '/documents', icon: <FileText size={20} />, section: 'documents' },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();

  const handleLogout = () => {
    // No-op logout for demo
  };

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-slate-900 text-white transition-all duration-300 overflow-hidden flex flex-col fixed left-0 top-16 bottom-0 z-30`}
    >
      <nav className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-slate-700 space-y-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
