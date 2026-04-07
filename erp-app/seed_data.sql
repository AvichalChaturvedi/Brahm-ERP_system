-- ============================================================================
-- SAMPLE SEED DATA FOR HARDWARE ERP
-- Run this after schema and RLS are set up
-- ============================================================================

-- Note: In production, use proper seeding through application UI
-- This is for demo/testing purposes only

-- First, you need to create auth users manually in Supabase Auth
-- Then use their IDs in the INSERT statements below

-- Example: Replace these UUIDs with real users from your auth table
-- SELECT id, email FROM auth.users;

-- For demo purposes, we'll show the structure with placeholder UUIDs

-- ============================================================================
-- 1. CREATE DEMO TEAM
-- ============================================================================

INSERT INTO public.teams (id, name, description, created_by, created_at, updated_at)
VALUES (
  'team-demo-001'::uuid,
  'Acme Embedded Systems',
  'Hardware product development team',
  'user-pm-001'::uuid,
  now(),
  now()
);

-- ============================================================================
-- 2. CREATE DEMO USERS & PROFILES
-- ============================================================================

-- Project Manager
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-pm-001'::uuid,
  'user-pm-001'::uuid,
  'pm@acme.dev',
  'Sarah Chen',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- System Architect
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-arch-001'::uuid,
  'user-arch-001'::uuid,
  'architect@acme.dev',
  'James Rodriguez',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- QA Engineer
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-qa-001'::uuid,
  'user-qa-001'::uuid,
  'qa@acme.dev',
  'Lisa Wang',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- Firmware Engineer
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-fw-001'::uuid,
  'user-fw-001'::uuid,
  'firmware@acme.dev',
  'Marcus Johnson',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- PCB Engineer
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-pcb-001'::uuid,
  'user-pcb-001'::uuid,
  'pcb@acme.dev',
  'Emma Zhang',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- Procurement Manager
INSERT INTO public.profiles (id, user_id, email, full_name, team_id, created_at, updated_at)
VALUES (
  'profile-proc-001'::uuid,
  'user-proc-001'::uuid,
  'procurement@acme.dev',
  'Robert Taylor',
  'team-demo-001'::uuid,
  now(),
  now()
);

-- ============================================================================
-- 3. ASSIGN ROLES
-- ============================================================================

INSERT INTO public.user_roles (id, user_id, team_id, role, assigned_at) VALUES
  ('role-pm-001'::uuid, 'user-pm-001'::uuid, 'team-demo-001'::uuid, 'project_manager', now()),
  ('role-arch-001'::uuid, 'user-arch-001'::uuid, 'team-demo-001'::uuid, 'system_architect', now()),
  ('role-qa-001'::uuid, 'user-qa-001'::uuid, 'team-demo-001'::uuid, 'qa_engineer', now()),
  ('role-fw-001'::uuid, 'user-fw-001'::uuid, 'team-demo-001'::uuid, 'firmware_engineer', now()),
  ('role-pcb-001'::uuid, 'user-pcb-001'::uuid, 'team-demo-001'::uuid, 'pcb_engineer', now()),
  ('role-proc-001'::uuid, 'user-proc-001'::uuid, 'team-demo-001'::uuid, 'procurement_manager', now());

-- ============================================================================
-- 4. CREATE DEMO PROJECT
-- ============================================================================

INSERT INTO public.projects (id, team_id, name, description, status, start_date, target_date, created_by, created_at, updated_at)
VALUES (
  'proj-sensor-hub'::uuid,
  'team-demo-001'::uuid,
  'IoT Environmental Sensor Hub',
  'Wireless environmental sensor platform with cloud integration',
  'active',
  '2024-01-15',
  '2024-06-30',
  'user-pm-001'::uuid,
  now(),
  now()
);

-- ============================================================================
-- 5. CREATE MILESTONES
-- ============================================================================

INSERT INTO public.milestones (id, project_id, name, description, status, target_date, created_at, updated_at) VALUES
  ('ms-001'::uuid, 'proj-sensor-hub'::uuid, 'System Architecture', 'Define system blocks and interfaces', 'completed', '2024-02-15', now(), now()),
  ('ms-002'::uuid, 'proj-sensor-hub'::uuid, 'PCB Design Complete', 'Finalize PCB schematic and layout', 'in_progress', '2024-03-31', now(), now()),
  ('ms-003'::uuid, 'proj-sensor-hub'::uuid, 'Firmware Alpha Release', 'Core firmware functionality ready', 'planning', '2024-04-30', now(), now()),
  ('ms-004'::uuid, 'proj-sensor-hub'::uuid, 'Quality Gate 1', 'Pass initial testing and QA', 'planning', '2024-05-15', now(), now()),
  ('ms-005'::uuid, 'proj-sensor-hub'::uuid, 'Production Ready', 'Full release candidate', 'planning', '2024-06-30', now(), now());

-- ============================================================================
-- 6. CREATE TASKS
-- ============================================================================

INSERT INTO public.tasks (id, project_id, milestone_id, title, description, status, priority, assigned_to, created_by, start_date, due_date, estimated_hours, created_at, updated_at) VALUES
  -- Architecture tasks
  ('task-001'::uuid, 'proj-sensor-hub'::uuid, 'ms-001'::uuid, 'Define system blocks', 'Identify main system blocks: MCU, wireless, sensor interface', 'completed', 'high', 'user-arch-001'::uuid, 'user-pm-001'::uuid, '2024-01-15', '2024-02-05', 16, now(), now()),
  ('task-002'::uuid, 'proj-sensor-hub'::uuid, 'ms-001'::uuid, 'Document interfaces', 'Document MCU<->Wireless, MCU<->Sensor interfaces', 'completed', 'high', 'user-arch-001'::uuid, 'user-pm-001'::uuid, '2024-02-01', '2024-02-15', 20, now(), now()),

  -- PCB tasks
  ('task-003'::uuid, 'proj-sensor-hub'::uuid, 'ms-002'::uuid, 'Schematic entry', 'Create schematic in Fusion 360', 'in_progress', 'high', 'user-pcb-001'::uuid, 'user-pm-001'::uuid, '2024-02-16', '2024-03-15', 40, now(), now()),
  ('task-004'::uuid, 'proj-sensor-hub'::uuid, 'ms-002'::uuid, 'Layout and routing', 'PCB layout with high-speed routing', 'in_progress', 'high', 'user-pcb-001'::uuid, 'user-pm-001'::uuid, '2024-03-10', '2024-03-30', 60, now(), now()),
  ('task-005'::uuid, 'proj-sensor-hub'::uuid, 'ms-002'::uuid, 'DFM review', 'Design for manufacturing checks with vendor', 'blocked', 'medium', 'user-pcb-001'::uuid, 'user-pm-001'::uuid, '2024-03-25', '2024-04-10', 12, now(), now()),

  -- Firmware tasks
  ('task-006'::uuid, 'proj-sensor-hub'::uuid, 'ms-003'::uuid, 'Sensor driver development', 'Implement I2C driver for environmental sensors', 'in_progress', 'high', 'user-fw-001'::uuid, 'user-pm-001'::uuid, '2024-02-20', '2024-04-15', 32, now(), now()),
  ('task-007'::uuid, 'proj-sensor-hub'::uuid, 'ms-003'::uuid, 'Wireless stack integration', 'Integrate LoRaWAN or WiFi stack', 'not_started', 'high', 'user-fw-001'::uuid, 'user-pm-001'::uuid, '2024-04-01', '2024-04-30', 48, now(), now()),

  -- QA tasks
  ('task-008'::uuid, 'proj-sensor-hub'::uuid, 'ms-004'::uuid, 'Create test plan', 'Define test cases and acceptance criteria', 'in_progress', 'high', 'user-qa-001'::uuid, 'user-pm-001'::uuid, '2024-03-01', '2024-03-31', 24, now(), now()),
  ('task-009'::uuid, 'proj-sensor-hub'::uuid, 'ms-004'::uuid, 'Unit testing', 'Execute firmware unit tests', 'not_started', 'high', 'user-qa-001'::uuid, 'user-pm-001'::uuid, '2024-04-15', '2024-05-15', 40, now(), now()),

  -- Procurement tasks
  ('task-010'::uuid, 'proj-sensor-hub'::uuid, 'ms-002'::uuid, 'BOM creation and review', 'Import BOM from PCB, get quotes, approve suppliers', 'not_started', 'high', 'user-proc-001'::uuid, 'user-pm-001'::uuid, '2024-03-20', '2024-04-30', 36, now(), now());

-- ============================================================================
-- 7. CREATE TASK DEPENDENCIES
-- ============================================================================

INSERT INTO public.task_dependencies (id, task_id, depends_on_task_id, dependency_type, created_at) VALUES
  ('dep-001'::uuid, 'task-004'::uuid, 'task-003'::uuid, 'blocks', now()),
  ('dep-002'::uuid, 'task-005'::uuid, 'task-004'::uuid, 'blocks', now()),
  ('dep-003'::uuid, 'task-007'::uuid, 'task-006'::uuid, 'related_to', now()),
  ('dep-004'::uuid, 'task-010'::uuid, 'task-004'::uuid, 'blocks', now());

-- ============================================================================
-- 8. CREATE ARCHITECTURE
-- ============================================================================

INSERT INTO public.architecture_blocks (id, project_id, name, description, block_type, owner_id, created_at, updated_at) VALUES
  ('block-mcu'::uuid, 'proj-sensor-hub'::uuid, 'STM32F4 Microcontroller', 'Main processor for sensor hub', 'microcontroller', 'user-fw-001'::uuid, now(), now()),
  ('block-wireless'::uuid, 'proj-sensor-hub'::uuid, 'LoRaWAN Module', 'Long-range wireless communication', 'wireless', 'user-fw-001'::uuid, now(), now()),
  ('block-sensors'::uuid, 'proj-sensor-hub'::uuid, 'Environmental Sensors', 'Temperature, humidity, pressure sensors', 'sensor', 'user-pcb-001'::uuid, now(), now()),
  ('block-power'::uuid, 'proj-sensor-hub'::uuid, 'Power Management', 'Battery charging and regulation', 'power', 'user-pcb-001'::uuid, now(), now());

INSERT INTO public.interfaces (id, project_id, from_block_id, to_block_id, interface_type, protocol, description, created_at, updated_at) VALUES
  ('iface-001'::uuid, 'proj-sensor-hub'::uuid, 'block-mcu'::uuid, 'block-sensors'::uuid, 'I2C', 'I2C', 'Sensor data readout', now(), now()),
  ('iface-002'::uuid, 'proj-sensor-hub'::uuid, 'block-mcu'::uuid, 'block-wireless'::uuid, 'UART', 'UART', 'Wireless module control', now(), now()),
  ('iface-003'::uuid, 'proj-sensor-hub'::uuid, 'block-power'::uuid, 'block-mcu'::uuid, 'Power', 'DC', 'MCU power supply', now(), now());

-- ============================================================================
-- 9. CREATE QA PLAN
-- ============================================================================

INSERT INTO public.qa_plans (id, project_id, title, description, scope, status, created_by, created_at, updated_at) VALUES
  ('qa-plan-001'::uuid, 'proj-sensor-hub'::uuid, 'Firmware Validation Plan', 'Test firmware functionality and performance', 'Firmware, wireless, sensors', 'in_progress', 'user-qa-001'::uuid, now(), now());

INSERT INTO public.test_cases (id, project_id, qa_plan_id, title, description, steps, expected_result, created_by, created_at, updated_at) VALUES
  ('tc-001'::uuid, 'proj-sensor-hub'::uuid, 'qa-plan-001'::uuid, 'Sensor reading test', 'Verify sensor data is read correctly', '1. Power on device\n2. Wait 10s for initialization\n3. Read temperature value', 'Temperature within ±1°C of reference', 'user-qa-001'::uuid, now(), now()),
  ('tc-002'::uuid, 'proj-sensor-hub'::uuid, 'qa-plan-001'::uuid, 'Wireless transmission test', 'Verify wireless connectivity and range', '1. Transmit 100 packets\n2. Measure signal strength', 'All packets received, RSSI > -100dBm', 'user-qa-001'::uuid, now(), now());

-- ============================================================================
-- 10. CREATE FIRMWARE RECORDS
-- ============================================================================

INSERT INTO public.firmware_records (id, project_id, target_mcu, version, description, status, github_repo_url, created_by, created_at, updated_at) VALUES
  ('fw-001'::uuid, 'proj-sensor-hub'::uuid, 'STM32F407VG', 'v0.1.0-alpha', 'Core sensor hub firmware', 'development', 'https://github.com/acme/sensor-hub-firmware', 'user-fw-001'::uuid, now(), now());

INSERT INTO public.firmware_targets (id, project_id, target_name, mcu_type, architecture, flash_size, ram_size, created_at) VALUES
  ('target-1'::uuid, 'proj-sensor-hub'::uuid, 'Main Board', 'STM32F407VG', 'ARM Cortex-M4', 1024, 192, now());

-- ============================================================================
-- 11. CREATE PCB RECORDS
-- ============================================================================

INSERT INTO public.pcb_revisions (id, project_id, revision_number, description, status, designed_by, created_at, updated_at) VALUES
  ('pcb-rev-a'::uuid, 'proj-sensor-hub'::uuid, 'Rev A', 'Initial design with main board and power module', 'design_review', 'user-pcb-001'::uuid, now(), now());

-- ============================================================================
-- 12. CREATE SUPPLIERS (for BOM)
-- ============================================================================

INSERT INTO public.suppliers (id, team_id, name, contact_name, contact_email, contact_phone, website, status, created_at, updated_at) VALUES
  ('supplier-001'::uuid, 'team-demo-001'::uuid, 'Digi-Key Electronics', 'John Doe', 'sales@digikey.com', '+1-555-0100', 'https://www.digikey.com', 'active', now(), now()),
  ('supplier-002'::uuid, 'team-demo-001'::uuid, 'Mouser Electronics', 'Jane Smith', 'sales@mouser.com', '+1-555-0101', 'https://www.mouser.com', 'active', now(), now()),
  ('supplier-003'::uuid, 'team-demo-001'::uuid, 'Arrow Electronics', 'Bob Johnson', 'sales@arrow.com', '+1-555-0102', 'https://www.arrow.com', 'active', now(), now());

-- ============================================================================
-- 13. CREATE BOM
-- ============================================================================

INSERT INTO public.bom_versions (id, project_id, pcb_revision_id, version_number, description, total_units, total_cost_estimated, status, created_by, created_at, updated_at) VALUES
  ('bom-v1'::uuid, 'proj-sensor-hub'::uuid, 'pcb-rev-a'::uuid, 1, 'Initial BOM for Rev A', 100, 2500.00, 'draft', 'user-proc-001'::uuid, now(), now());

INSERT INTO public.bom_items (id, bom_version_id, line_number, reference_designator, description, manufacturer_part_number, quantity, unit_of_measure, unit_cost, total_cost, status, notes, created_at, updated_at) VALUES
  ('bom-item-001'::uuid, 'bom-v1'::uuid, 1, 'U1', 'STM32F407VG Microcontroller', 'STM32F407VGT6', 100, 'pcs', 12.50, 1250.00, 'pending_review', 'ARM Cortex-M4, 1MB Flash', now(), now()),
  ('bom-item-002'::uuid, 'bom-v1'::uuid, 2, 'U2', 'LoRaWAN Module', 'RN2903A-I/RM', 100, 'pcs', 8.75, 875.00, 'pending_review', 'Semtech LoRa chip', now(), now()),
  ('bom-item-003'::uuid, 'bom-v1'::uuid, 3, 'U3,U4', 'Environmental Sensor', 'BME680', 200, 'pcs', 2.50, 500.00, 'pending_review', 'Bosch combined sensor', now(), now()),
  ('bom-item-004'::uuid, 'bom-v1'::uuid, 4, 'C1-C10', 'Capacitor 100nF', 'GRM31CR61A107KA19L', 1000, 'pcs', 0.15, 150.00, 'pending_review', 'MLCC ceramic capacitor', now(), now()),
  ('bom-item-005'::uuid, 'bom-v1'::uuid, 5, 'R1-R5', 'Resistor 10k 1%', 'RNCP0805FTD10K0', 500, 'pcs', 0.10, 50.00, 'pending_review', 'Thin film resistor', now(), now());

-- ============================================================================
-- 14. CREATE SUPPLIER QUOTES
-- ============================================================================

INSERT INTO public.supplier_quotes (id, bom_item_id, supplier_id, moq, unit_price, lead_time_days, availability_status, is_approved, quote_notes, quoted_at, valid_until) VALUES
  ('quote-001'::uuid, 'bom-item-001'::uuid, 'supplier-001'::uuid, 10, 12.50, 7, 'in_stock', true, 'Stock available', now(), now() + interval '30 days'),
  ('quote-002'::uuid, 'bom-item-002'::uuid, 'supplier-002'::uuid, 50, 8.75, 14, 'limited', false, 'Limited availability', now(), now() + interval '30 days'),
  ('quote-003'::uuid, 'bom-item-002'::uuid, 'supplier-001'::uuid, 25, 9.00, 10, 'in_stock', true, 'Better price', now(), now() + interval '30 days');

-- ============================================================================
-- 15. CREATE ACTIVITY LOGS
-- ============================================================================

INSERT INTO public.activity_logs (id, entity_type, entity_id, action, changes, created_by, created_at) VALUES
  ('log-001'::uuid, 'project', 'proj-sensor-hub'::uuid, 'created', null, 'user-pm-001'::uuid, now() - interval '2 months'),
  ('log-002'::uuid, 'milestone', 'ms-001'::uuid, 'completed', '{"status": "completed"}', 'user-arch-001'::uuid, now() - interval '1 month'),
  ('log-003'::uuid, 'task', 'task-003'::uuid, 'updated', '{"status": "in_progress"}', 'user-pcb-001'::uuid, now() - interval '1 week');

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

-- Note: This seed data uses hardcoded UUIDs for demonstration
-- In production, use Supabase or application-level seeding
-- Remember to replace user IDs with actual auth.users IDs
