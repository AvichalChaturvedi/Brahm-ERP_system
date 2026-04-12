import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, CheckCircle, Zap } from 'lucide-react';
import { Topbar } from '../components/Topbar';

export const DashboardPage: React.FC = () => {
  const [stats] = useState({
    activeProjects: 1,
    activeTasks: 3,
    qaInProgress: 2,
    totalProjects: 2,
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Topbar title="Dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Here's your project and operations overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.activeProjects}</p>
              </div>
              <TrendingUp size={32} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.activeTasks}</p>
              </div>
              <Clock size={32} className="text-orange-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">QA In Progress</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.qaInProgress}</p>
              </div>
              <Zap size={32} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalProjects}</p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">Activity log will appear here as you work on projects</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pending Approvals</h3>
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">You're all caught up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
