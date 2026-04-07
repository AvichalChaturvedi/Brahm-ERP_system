export type UserRole = 'project_manager' | 'system_architect' | 'qa_engineer' | 'firmware_engineer' | 'ui_ux_engineer' | 'pcb_engineer' | 'procurement_manager' | 'wiring_resource' | 'admin';

export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type MilestoneStatus = 'planning' | 'in_progress' | 'at_risk' | 'completed' | 'cancelled';

export type QAStatus = 'not_started' | 'in_progress' | 'passed' | 'failed' | 'blocked';
export type DefectSeverity = 'minor' | 'major' | 'critical' | 'blocker';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export type BOMImportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  team_id: string;
  role: UserRole;
  assigned_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  target_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  target_date: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by: string;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: 'blocks' | 'blocked_by' | 'related_to';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes?: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface Comment {
  id: string;
  entity_type: string;
  entity_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  entity_type: string;
  entity_id: string;
  requested_by: string;
  approver_id: string;
  status: ApprovalStatus;
  notes?: string;
  requested_at: string;
  responded_at?: string;
}
