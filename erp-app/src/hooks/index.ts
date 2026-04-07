import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);

  return user;
};

export const useProject = (projectId: string | undefined) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      setLoading(true);
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

  return { project, loading };
};

export const useTasks = (projectId: string | undefined) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('due_date', { ascending: true });
        
        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // FREE TIER: Use polling instead of realtime subscriptions
    // This saves money on Supabase free tier
    const pollingInterval = parseInt(import.meta.env.VITE_POLLING_INTERVAL || '30000');
    const interval = setInterval(fetchTasks, pollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, [projectId]);

  return { tasks, loading };
};

export const useMilestones = (projectId: string | undefined) => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('target_date', { ascending: true });
        
        if (error) throw error;
        setMilestones(data || []);
      } catch (err) {
        console.error('Error fetching milestones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId]);

  return { milestones, loading };
};
