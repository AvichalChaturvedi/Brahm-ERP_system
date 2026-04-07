import { supabase } from './supabase';
import type { Profile, Project, Task, Milestone } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) console.error('Profile fetch error:', error);
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const projectService = {
  async getProjects(teamId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    if (error) console.error('Project fetch error:', error);
    return data;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getTask(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    if (error) console.error('Task fetch error:', error);
    return data;
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    if (error) throw error;
  },
};

export const milestoneService = {
  async getProjectMilestones(projectId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('target_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createMilestone(milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMilestone(milestoneId: string, updates: Partial<Milestone>) {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const activityService = {
  async logActivity(entityType: string, entityId: string, action: string, userId: string, changes?: Record<string, any>) {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{ entity_type: entityType, entity_id: entityId, action, created_by: userId, changes }]);
    if (error) console.error('Activity log error:', error);
  },

  async getEntityActivity(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    if (error) console.error('Activity fetch error:', error);
    return data || [];
  },
};
