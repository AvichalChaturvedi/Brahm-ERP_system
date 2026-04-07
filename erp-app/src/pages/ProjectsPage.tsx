import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Topbar } from '../components/Topbar';
import { Card, Button, EmptyState, LoadingSpinner, Input, Select, StatusBadge } from '../components/UI';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';

export const ProjectsPage: React.FC = () => {
  const { profile } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectTargetDate, setNewProjectTargetDate] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!profile?.team_id) return;

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('team_id', profile.team_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [profile?.team_id]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !profile?.id || !profile?.team_id) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from('projects').insert([
        {
          team_id: profile.team_id,
          name: newProjectName,
          description: newProjectDescription,
          status: 'planning',
          start_date: now,
          target_date: newProjectTargetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: profile.id,
        },
      ]);

      if (error) throw error;
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectTargetDate('');
      setShowNewProject(false);

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('team_id', profile.team_id)
        .order('created_at', { ascending: false });
      setProjects(data || []);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Topbar title="Projects" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all your hardware development projects</p>
          </div>
          <Button onClick={() => setShowNewProject(!showNewProject)}>
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {showNewProject && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Project</h3>
            <div className="space-y-4">
              <Input
                value={newProjectName}
                onChange={setNewProjectName}
                placeholder="Project name"
              />
              <Input
                value={newProjectDescription}
                onChange={setNewProjectDescription}
                placeholder="Description"
              />
              <Input
                type="date"
                value={newProjectTargetDate}
                onChange={setNewProjectTargetDate}
                placeholder="Target date"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateProject}>Create</Button>
                <Button variant="secondary" onClick={() => setShowNewProject(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <Card>
            <EmptyState
              title="No projects yet"
              description="Create your first project to get started with project planning and execution"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition h-full">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{project.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <StatusBadge status={project.status} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(project.target_date).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
