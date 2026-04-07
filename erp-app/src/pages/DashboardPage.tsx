import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Clock, CheckCircle, Zap } from 'lucide-react';
import { Card, StatusBadge, EmptyState, LoadingSpinner } from '../components/UI';
import { Topbar } from '../components/Topbar';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!profile?.team_id) return;

        const [projectRes, taskRes, qaRes] = await Promise.all([
          supabase
            .from('projects')
            .select('id, status')
            .eq('team_id', profile.team_id),
          supabase
            .from('tasks')
            .select('id, status, priority')
            .eq('status', 'in_progress'),
          supabase
            .from('qa_plans')
            .select('id, status'),
        ]);

        const activeProjects = projectRes.data?.filter((p) => p.status === 'active').length || 0;
        const activeTasks = taskRes.data?.length || 0;
        const qaInProgress = qaRes.data?.filter((q) => q.status === 'in_progress').length || 0;

        setStats({
          activeProjects,
          activeTasks,
          qaInProgress,
          totalProjects: projectRes.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile?.team_id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Topbar title="Dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome, {profile?.full_name || 'User'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Here's your project and operations overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.activeProjects || 0}
                </p>
              </div>
              <TrendingUp size={32} className="text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.activeTasks || 0}
                </p>
              </div>
              <Clock size={32} className="text-orange-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">QA In Progress</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.qaInProgress || 0}
                </p>
              </div>
              <Zap size={32} className="text-yellow-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.totalProjects || 0}
                </p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <EmptyState
              title="No Recent Activity"
              description="Activity log will appear here as you work on projects"
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Pending Approvals
            </h3>
            <EmptyState
              title="No Pending Approvals"
              description="You're all caught up"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
