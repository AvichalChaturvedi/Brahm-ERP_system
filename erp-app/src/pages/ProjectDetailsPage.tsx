import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Topbar } from '../components/Topbar';
import { Card, Button, EmptyState, LoadingSpinner, Input, Select, StatusBadge } from '../components/UI';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';
import { useTasks, useMilestones } from '../hooks';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { profile } = useAuthStore();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const { tasks, loading: tasksLoading } = useTasks(projectId);
  const { milestones } = useMilestones(projectId);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !projectId || !profile?.id) return;

    try {
      const { error } = await supabase.from('tasks').insert([
        {
          project_id: projectId,
          title: newTaskTitle,
          priority: newTaskPriority,
          due_date: newTaskDueDate || null,
          status: 'not_started',
          created_by: profile.id,
        },
      ]);

      if (error) throw error;
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowNewTask(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Topbar title={project.name} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{project.description}</p>
              <div className="flex gap-4 mt-4">
                <StatusBadge status={project.status} />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Target: {new Date(project.target_date).toLocaleDateString()}
                </span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks</h3>
                <Button size="sm" onClick={() => setShowNewTask(!showNewTask)}>
                  <Plus size={16} />
                  New Task
                </Button>
              </div>

              {showNewTask && (
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mb-6 space-y-4">
                  <Input
                    value={newTaskTitle}
                    onChange={setNewTaskTitle}
                    placeholder="Task title"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={newTaskPriority}
                      onChange={setNewTaskPriority}
                      options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                        { label: 'Critical', value: 'critical' },
                      ]}
                    />
                    <Input
                      type="date"
                      value={newTaskDueDate}
                      onChange={setNewTaskDueDate}
                      placeholder="Due date"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateTask}>
                      Create
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setShowNewTask(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {tasksLoading ? (
                <LoadingSpinner />
              ) : tasks.length === 0 ? (
                <EmptyState title="No tasks yet" description="Create your first task to get started" />
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                          <div className="flex gap-2 mt-2">
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                        <StatusBadge status={task.priority} />
                      </div>
                      {task.due_date && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Milestones</h3>
              {milestones.length === 0 ? (
                <EmptyState title="No milestones" description="Create a milestone to track progress" />
              ) : (
                <div className="space-y-2">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg"
                    >
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{m.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {new Date(m.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Status</p>
                  <StatusBadge status={project.status} />
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Start Date</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(project.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Target Date</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(project.target_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
