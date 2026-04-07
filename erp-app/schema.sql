-- ============================================================================
-- HARDWARE ERP SYSTEM - POSTGRESQL SCHEMA
-- ============================================================================
-- This schema provides the complete data model for the Hardware ERP system
-- All tables have Row Level Security enabled for multi-tenant safety

-- ============================================================================
-- 1. CORE IDENTITY & TEAM MANAGEMENT
-- ============================================================================

-- Profiles: Extended user information linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  team_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teams: Organization unit
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK after teams table exists
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_team_id
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Roles: Enumeration of user roles
CREATE TYPE user_role AS ENUM (
  'project_manager',
  'system_architect',
  'qa_engineer',
  'firmware_engineer',
  'ui_ux_engineer',
  'pcb_engineer',
  'procurement_manager',
  'wiring_resource',
  'admin'
);

-- User Roles: User -> Team -> Role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, team_id, role)
);

-- ============================================================================
-- 2. PROJECT MANAGEMENT
-- ============================================================================

CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'blocked', 'review', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE milestone_status AS ENUM ('planning', 'in_progress', 'at_risk', 'completed', 'cancelled');

-- Projects: Top-level project container
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'planning',
  start_date TIMESTAMPTZ,
  target_date TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Milestones: Major project milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status milestone_status DEFAULT 'planning',
  target_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Work Breakdown Structure
CREATE TABLE IF NOT EXISTS public.wbs_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.wbs_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sequence_number INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks: Work items with ownership and status
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  wbs_item_id UUID REFERENCES public.wbs_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'not_started',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Task Dependencies: Model task blocking relationships
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependency_type TEXT CHECK (dependency_type IN ('blocks', 'blocked_by', 'related_to')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. SYSTEM ARCHITECTURE
-- ============================================================================

-- Architecture Blocks: System building blocks
CREATE TABLE IF NOT EXISTS public.architecture_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  block_type TEXT, -- e.g., 'microcontroller', 'wireless', 'sensor', 'interface'
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Interfaces: Connections between blocks
CREATE TABLE IF NOT EXISTS public.interfaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  from_block_id UUID NOT NULL REFERENCES public.architecture_blocks(id) ON DELETE CASCADE,
  to_block_id UUID NOT NULL REFERENCES public.architecture_blocks(id) ON DELETE CASCADE,
  interface_type TEXT, -- e.g., 'SPI', 'I2C', 'UART', 'CAN', 'wireless'
  protocol TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Integration Matrix: Track integration status
CREATE TABLE IF NOT EXISTS public.integration_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  from_component TEXT NOT NULL,
  to_component TEXT NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'integrated', 'testing', 'complete')),
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Requirements: System requirements tracking
CREATE TABLE IF NOT EXISTS public.requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  req_id TEXT NOT NULL, -- e.g., REQ-001
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'functional', 'performance', 'safety'
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, req_id)
);

-- Design Decisions: Record architectural decisions
CREATE TABLE IF NOT EXISTS public.design_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context TEXT,
  decision TEXT,
  consequences TEXT,
  status TEXT DEFAULT 'proposed',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Risks: Architecture and project risks
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'technical', 'schedule', 'resource'
  likelihood TEXT, -- 'low', 'medium', 'high'
  impact TEXT,    -- 'low', 'medium', 'high'
  mitigation_plan TEXT,
  owner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'identified',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. QUALITY ASSURANCE & RELEASE
-- ============================================================================

CREATE TYPE qa_status AS ENUM ('not_started', 'in_progress', 'passed', 'failed', 'blocked');
CREATE TYPE defect_severity AS ENUM ('minor', 'major', 'critical', 'blocker');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'changes_requested');

-- Quality Plans
CREATE TABLE IF NOT EXISTS public.qa_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scope TEXT,
  status qa_status DEFAULT 'not_started',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- QA Checklists
CREATE TABLE IF NOT EXISTS public.qa_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qa_plan_id UUID NOT NULL REFERENCES public.qa_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sequence_number INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- QA Checklist Items
CREATE TABLE IF NOT EXISTS public.qa_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES public.qa_checklists(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  is_critical BOOLEAN DEFAULT FALSE,
  sequence_number INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Test Cases
CREATE TABLE IF NOT EXISTS public.test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  qa_plan_id UUID REFERENCES public.qa_plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  steps TEXT,
  expected_result TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Test Runs: Execution records
CREATE TABLE IF NOT EXISTS public.test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
  executed_by UUID NOT NULL REFERENCES auth.users(id),
  status qa_status NOT NULL,
  notes TEXT,
  evidence_url TEXT,
  executed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Test Results
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_run_id UUID NOT NULL REFERENCES public.test_runs(id) ON DELETE CASCADE,
  result_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Defects / Non-Conformances
CREATE TABLE IF NOT EXISTS public.defects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  test_run_id UUID REFERENCES public.test_runs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity defect_severity DEFAULT 'major',
  status TEXT CHECK (status IN ('open', 'investigating', 'in_progress', 'resolved', 'verified', 'closed')),
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CAPA Records: Corrective/Preventive Actions
CREATE TABLE IF NOT EXISTS public.capa_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  defect_id UUID NOT NULL REFERENCES public.defects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  target_date TIMESTAMPTZ,
  owner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Release Gates: Quality gates for releases
CREATE TABLE IF NOT EXISTS public.release_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id),
  gate_name TEXT NOT NULL,
  description TEXT,
  criteria TEXT,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. FIRMWARE DEVELOPMENT
-- ============================================================================

-- Firmware Records: Firmware development tracking
CREATE TABLE IF NOT EXISTS public.firmware_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  target_mcu TEXT NOT NULL, -- e.g., 'STM32F4', 'ESP32'
  version TEXT,
  description TEXT,
  status TEXT DEFAULT 'development',
  github_repo_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Firmware Targets: MCU/board definitions
CREATE TABLE IF NOT EXISTS public.firmware_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  target_name TEXT NOT NULL, -- e.g., 'Main Board', 'Sensor Node'
  mcu_type TEXT,
  architecture TEXT, -- 'ARM', 'RISC-V', etc.
  flash_size INT,
  ram_size INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GitHub Links: Link tasks to GitHub repos/issues
CREATE TABLE IF NOT EXISTS public.github_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'firmware_record', 'task', etc.
  entity_id UUID NOT NULL,
  github_url TEXT NOT NULL,
  repo_owner TEXT,
  repo_name TEXT,
  issue_number INT,
  pr_number INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Build Logs: Build/compilation tracking
CREATE TABLE IF NOT EXISTS public.build_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firmware_record_id UUID NOT NULL REFERENCES public.firmware_records(id) ON DELETE CASCADE,
  build_timestamp TIMESTAMPTZ,
  status TEXT, -- 'success', 'failed'
  log_output TEXT,
  compiler_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Firmware Versions: Version matrix across hardware revisions
CREATE TABLE IF NOT EXISTS public.firmware_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firmware_record_id UUID NOT NULL REFERENCES public.firmware_records(id) ON DELETE CASCADE,
  pcb_revision TEXT,
  fw_version TEXT NOT NULL,
  release_notes TEXT,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 6. UI/UX ENGINEERING
-- ============================================================================

-- UI/UX Reviews: Design review records
CREATE TABLE IF NOT EXISTS public.uiux_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  figma_file_url TEXT,
  status TEXT DEFAULT 'draft',
  reviewed_by UUID REFERENCES auth.users(id),
  feedback TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Design Files: Figma file metadata
CREATE TABLE IF NOT EXISTS public.design_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  figma_file_id TEXT,
  figma_url TEXT,
  file_name TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Handoff Checklists: UI to dev handoff
CREATE TABLE IF NOT EXISTS public.handoff_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uiux_review_id UUID NOT NULL REFERENCES public.uiux_reviews(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 7. PCB ENGINEERING
-- ============================================================================

-- PCB Revisions: Track PCB versions
CREATE TABLE IF NOT EXISTS public.pcb_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  revision_number TEXT NOT NULL, -- e.g., 'Rev A', 'Rev B.1'
  description TEXT,
  status TEXT DEFAULT 'draft',
  designed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, revision_number)
);

-- Fusion 360 References: CAD file references
CREATE TABLE IF NOT EXISTS public.fusion_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pcb_revision_id UUID REFERENCES public.pcb_revisions(id) ON DELETE CASCADE,
  fusion_file_id TEXT,
  fusion_url TEXT,
  file_name TEXT,
  uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Design Review Checklist: PCB design review
CREATE TABLE IF NOT EXISTS public.design_review_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pcb_revision_id UUID NOT NULL REFERENCES public.pcb_revisions(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DFM/DFC Checks: Design for manufacturing/testability
CREATE TABLE IF NOT EXISTS public.dfm_dfc_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pcb_revision_id UUID NOT NULL REFERENCES public.pcb_revisions(id) ON DELETE CASCADE,
  check_type TEXT, -- 'dfm', 'dfc', 'thermal', etc.
  description TEXT,
  status TEXT DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PCB Issues: Track design issues
CREATE TABLE IF NOT EXISTS public.pcb_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pcb_revision_id UUID NOT NULL REFERENCES public.pcb_revisions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity defect_severity DEFAULT 'major',
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 8. BOM & PROCUREMENT
-- ============================================================================

CREATE TYPE bom_import_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- BOM Uploads: File-based BOM imports
CREATE TABLE IF NOT EXISTS public.bom_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pcb_revision_id UUID REFERENCES public.pcb_revisions(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size INT,
  import_status bom_import_status DEFAULT 'pending',
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  import_error TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- BOM Versions: Versioned BOMs
CREATE TABLE IF NOT EXISTS public.bom_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pcb_revision_id UUID REFERENCES public.pcb_revisions(id),
  bom_upload_id UUID REFERENCES public.bom_uploads(id),
  version_number INT,
  description TEXT,
  total_units INT,
  total_cost_estimated NUMERIC,
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved'
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, version_number)
);

-- BOM Items: Individual line items
CREATE TABLE IF NOT EXISTS public.bom_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_version_id UUID NOT NULL REFERENCES public.bom_versions(id) ON DELETE CASCADE,
  line_number INT,
  reference_designator TEXT, -- e.g., 'R1', 'C2', 'U3'
  description TEXT,
  manufacturer_part_number TEXT,
  quantity INT NOT NULL,
  unit_of_measure TEXT DEFAULT 'pcs',
  unit_cost NUMERIC,
  total_cost NUMERIC,
  status TEXT DEFAULT 'pending_review',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BOM Item Revisions: Track BOM changes
CREATE TABLE IF NOT EXISTS public.bom_item_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_item_id UUID NOT NULL REFERENCES public.bom_items(id) ON DELETE CASCADE,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  change_reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- Suppliers: Approved vendor list
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Supplier Quotes: Price quotes for parts
CREATE TABLE IF NOT EXISTS public.supplier_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bom_item_id UUID NOT NULL REFERENCES public.bom_items(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  moq INT, -- Minimum Order Quantity
  unit_price NUMERIC,
  lead_time_days INT,
  availability_status TEXT, -- 'in_stock', 'limited', 'lead_time', 'obsolete'
  is_approved BOOLEAN DEFAULT FALSE,
  quote_notes TEXT,
  quoted_at TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ
);

-- Approved Parts: Approved part/supplier combinations
CREATE TABLE IF NOT EXISTS public.approved_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  bom_item_id UUID REFERENCES public.bom_items(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  manufacturer_part_number TEXT NOT NULL,
  alternate_part_number TEXT,
  approval_date TIMESTAMPTZ DEFAULT now(),
  approved_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Procurement Items: PO line items
CREATE TABLE IF NOT EXISTS public.procurement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  bom_item_id UUID REFERENCES public.bom_items(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  manufacturer_part_number TEXT,
  quantity_ordered INT,
  unit_price NUMERIC,
  total_price NUMERIC,
  lead_time_days INT,
  expected_delivery TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'ordered', 'in_transit', 'delivered'
  po_number TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  po_number TEXT NOT NULL UNIQUE,
  total_amount NUMERIC,
  status TEXT DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 9. WIRING & ASSEMBLY
-- ============================================================================

-- Wiring Documents: Wiring diagrams
CREATE TABLE IF NOT EXISTS public.wiring_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT, -- 'schematic', 'block_diagram', 'pinout'
  file_path TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wiring Revisions: Document versions
CREATE TABLE IF NOT EXISTS public.wiring_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wiring_document_id UUID NOT NULL REFERENCES public.wiring_documents(id) ON DELETE CASCADE,
  revision_number TEXT,
  description TEXT,
  file_path TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wiring Approvals: Sign-off records
CREATE TABLE IF NOT EXISTS public.wiring_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wiring_revision_id UUID NOT NULL REFERENCES public.wiring_revisions(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  status approval_status DEFAULT 'pending',
  feedback TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Manufacturing Checklists
CREATE TABLE IF NOT EXISTS public.manufacturing_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Manufacturing Checklist Items
CREATE TABLE IF NOT EXISTS public.manufacturing_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES public.manufacturing_checklists(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  sequence_number INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 10. DOCUMENTS & WORKFLOW
-- ============================================================================

-- General Documents: Central document register
CREATE TABLE IF NOT EXISTS public.general_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT,
  file_path TEXT,
  version INT DEFAULT 1,
  status TEXT DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Approvals: Multi-step approval workflow
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  status approval_status DEFAULT 'pending',
  notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comments: Collaborative feedback
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Logs: Audit trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'approved'
  changes JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_team_id ON public.profiles(team_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_team_id ON public.user_roles(team_id);

CREATE INDEX idx_projects_team_id ON public.projects(team_id);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_milestones_project_id ON public.milestones(project_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_milestone_id ON public.tasks(milestone_id);

CREATE INDEX idx_bom_items_bom_version_id ON public.bom_items(bom_version_id);
CREATE INDEX idx_bom_versions_project_id ON public.bom_versions(project_id);
CREATE INDEX idx_supplier_quotes_bom_item_id ON public.supplier_quotes(bom_item_id);
CREATE INDEX idx_procurement_items_project_id ON public.procurement_items(project_id);

CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX idx_approvals_entity ON public.approvals(entity_type, entity_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wbs_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architecture_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firmware_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firmware_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firmware_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uiux_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handoff_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pcb_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fusion_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_review_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dfm_dfc_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pcb_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_item_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiring_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiring_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiring_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturing_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturing_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
