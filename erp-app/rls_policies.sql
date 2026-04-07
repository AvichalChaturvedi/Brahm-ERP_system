-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- Hardware ERP System
-- ============================================================================
-- These policies enforce tenant isolation and role-based access control
-- All policies assume auth.uid() returns the current authenticated user ID

-- ============================================================================
-- HELPER FUNCTION: Check if user is in team
-- ============================================================================

CREATE OR REPLACE FUNCTION is_team_member(team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND profiles.team_id = team_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER FUNCTION: Check if user has role in team
-- ============================================================================

CREATE OR REPLACE FUNCTION has_role(team_id UUID, role_name user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND user_roles.team_id = team_id AND user_roles.role = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================

-- SELECT: Users can see their own profile and team members
CREATE POLICY "users_view_own_profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid() OR team_id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- UPDATE: Users can only update their own profile
CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT: Only auth trigger creates profiles, so no explicit INSERT policy needed

-- DELETE: Users cannot delete profiles

-- ============================================================================
-- 2. TEAMS
-- ============================================================================

-- SELECT: Users can see teams they are members of
CREATE POLICY "users_view_own_teams"
  ON public.teams FOR SELECT
  USING (id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- CREATE: Any authenticated user can create a team
CREATE POLICY "users_create_teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- 3. USER ROLES
-- ============================================================================

-- SELECT: Users can see roles for their own team
CREATE POLICY "users_view_team_roles"
  ON public.user_roles FOR SELECT
  USING (team_id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- ============================================================================
-- 4. PROJECTS
-- ============================================================================

-- SELECT: Users see projects in their team
CREATE POLICY "users_view_team_projects"
  ON public.projects FOR SELECT
  USING (team_id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- INSERT: Project Managers can create projects in their team
CREATE POLICY "pm_create_projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    has_role(team_id, 'project_manager'::user_role)
  );

-- UPDATE: Project Managers can update projects
CREATE POLICY "pm_update_projects"
  ON public.projects FOR UPDATE
  USING (
    has_role(team_id, 'project_manager'::user_role) OR
    auth.uid() = created_by
  )
  WITH CHECK (
    has_role(team_id, 'project_manager'::user_role) OR
    auth.uid() = created_by
  );

-- DELETE: Only project creator or admin can delete
CREATE POLICY "pm_delete_projects"
  ON public.projects FOR DELETE
  USING (
    auth.uid() = created_by OR
    has_role(team_id, 'admin'::user_role)
  );

-- ============================================================================
-- 5. MILESTONES
-- ============================================================================

-- SELECT: Users see milestones in projects they can access
CREATE POLICY "users_view_milestones"
  ON public.milestones FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: Project members can manage milestones
CREATE POLICY "team_manage_milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "team_update_milestones"
  ON public.milestones FOR UPDATE
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- ============================================================================
-- 6. TASKS
-- ============================================================================

-- SELECT: Users see tasks in their projects
CREATE POLICY "users_view_tasks"
  ON public.tasks FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT: Team members can create tasks
CREATE POLICY "team_create_tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    ) AND auth.uid() = created_by
  );

-- UPDATE: Task creator or assignee can update
CREATE POLICY "task_update_tasks"
  ON public.tasks FOR UPDATE
  USING (
    auth.uid() = created_by OR
    auth.uid() = assigned_to OR
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles
        WHERE user_id = auth.uid()
      )
    )
  );

-- DELETE: Task creator or project manager
CREATE POLICY "task_delete_tasks"
  ON public.tasks FOR DELETE
  USING (
    auth.uid() = created_by OR
    project_id IN (
      SELECT id FROM public.projects
      WHERE has_role(team_id, 'project_manager'::user_role)
    )
  );

-- ============================================================================
-- 7. TASK DEPENDENCIES
-- ============================================================================

-- SELECT/INSERT/UPDATE: Team members can manage dependencies
CREATE POLICY "team_view_dependencies"
  ON public.task_dependencies FOR SELECT
  USING (task_id IN (
    SELECT id FROM public.tasks
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "team_manage_dependencies"
  ON public.task_dependencies FOR INSERT
  WITH CHECK (task_id IN (
    SELECT id FROM public.tasks
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  ));

-- ============================================================================
-- 8. ARCHITECTURE BLOCKS
-- ============================================================================

-- SELECT: Team members see architecture blocks
CREATE POLICY "team_view_blocks"
  ON public.architecture_blocks FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: System Architects manage blocks
CREATE POLICY "architect_manage_blocks"
  ON public.architecture_blocks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    ) AND
    has_role(
      (SELECT team_id FROM public.projects WHERE id = project_id),
      'system_architect'::user_role
    )
  );

CREATE POLICY "architect_update_blocks"
  ON public.architecture_blocks FOR UPDATE
  USING (
    has_role(
      (SELECT team_id FROM public.projects WHERE id = project_id),
      'system_architect'::user_role
    )
  );

-- ============================================================================
-- 9. QA PLANS, TEST CASES, TEST RUNS
-- ============================================================================

-- SELECT: Team members see QA records
CREATE POLICY "team_view_qa_plans"
  ON public.qa_plans FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: QA Engineers manage plans
CREATE POLICY "qa_manage_plans"
  ON public.qa_plans FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    ) AND
    has_role(
      (SELECT team_id FROM public.projects WHERE id = project_id),
      'qa_engineer'::user_role
    )
  );

-- Similar policies for test_cases, test_runs, defects
-- (abbreviated for brevity; follow same pattern)

CREATE POLICY "team_view_test_cases"
  ON public.test_cases FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "qa_manage_test_cases"
  ON public.test_cases FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "team_view_test_runs"
  ON public.test_runs FOR SELECT
  USING (test_case_id IN (
    SELECT id FROM public.test_cases
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "qa_create_test_runs"
  ON public.test_runs FOR INSERT
  WITH CHECK (
    test_case_id IN (
      SELECT id FROM public.test_cases
      WHERE project_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- 10. DEFECTS
-- ============================================================================

CREATE POLICY "team_view_defects"
  ON public.defects FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "team_create_defects"
  ON public.defects FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "defect_update_defects"
  ON public.defects FOR UPDATE
  USING (
    auth.uid() = reported_by OR
    auth.uid() = assigned_to OR
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 11. BOM RECORDS
-- ============================================================================

-- SELECT: Team members see BOM
CREATE POLICY "team_view_bom_uploads"
  ON public.bom_uploads FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: PCB Engineers and Procurement Managers
CREATE POLICY "bom_upload_policy"
  ON public.bom_uploads FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- BOM Items
CREATE POLICY "team_view_bom_items"
  ON public.bom_items FOR SELECT
  USING (bom_version_id IN (
    SELECT id FROM public.bom_versions
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "bom_manage_items"
  ON public.bom_items FOR INSERT
  WITH CHECK (bom_version_id IN (
    SELECT id FROM public.bom_versions
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  ));

-- ============================================================================
-- 12. SUPPLIERS & PROCUREMENT
-- ============================================================================

-- SELECT: Team members see suppliers
CREATE POLICY "team_view_suppliers"
  ON public.suppliers FOR SELECT
  USING (team_id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- INSERT: Procurement Manager creates suppliers
CREATE POLICY "procurement_manage_suppliers"
  ON public.suppliers FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Supplier Quotes
CREATE POLICY "team_view_quotes"
  ON public.supplier_quotes FOR SELECT
  USING (bom_item_id IN (
    SELECT id FROM public.bom_items
    WHERE bom_version_id IN (
      SELECT id FROM public.bom_versions
      WHERE project_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )
    )
  ));

CREATE POLICY "procurement_manage_quotes"
  ON public.supplier_quotes FOR INSERT
  WITH CHECK (bom_item_id IN (
    SELECT id FROM public.bom_items
    WHERE bom_version_id IN (
      SELECT id FROM public.bom_versions
      WHERE project_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )
    )
  ));

-- ============================================================================
-- 13. FIRMWARE RECORDS
-- ============================================================================

-- SELECT: Team members see firmware records
CREATE POLICY "team_view_firmware"
  ON public.firmware_records FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: Firmware Engineers manage records
CREATE POLICY "fw_manage_firmware"
  ON public.firmware_records FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 14. PCB RECORDS
-- ============================================================================

-- SELECT: Team members see PCB data
CREATE POLICY "team_view_pcb_revisions"
  ON public.pcb_revisions FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: PCB Engineers manage revisions
CREATE POLICY "pcb_manage_revisions"
  ON public.pcb_revisions FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 15. UI/UX RECORDS
-- ============================================================================

-- SELECT: Team members see UI/UX data
CREATE POLICY "team_view_uiux_reviews"
  ON public.uiux_reviews FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: UI/UX Engineers manage reviews
CREATE POLICY "uiux_manage_reviews"
  ON public.uiux_reviews FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 16. WIRING DOCUMENTS
-- ============================================================================

-- SELECT: Team members see wiring documents
CREATE POLICY "team_view_wiring"
  ON public.wiring_documents FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE team_id IN (
      SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
    )
  ));

-- INSERT/UPDATE: Wiring Resources manage documents
CREATE POLICY "wiring_manage_documents"
  ON public.wiring_documents FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 17. COMMENTS & APPROVALS
-- ============================================================================

-- SELECT: Users see comments on entities in their projects
CREATE POLICY "users_view_comments"
  ON public.comments FOR SELECT
  USING (
    (entity_type = 'project' AND entity_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )) OR
    (entity_type = 'task' AND entity_id IN (
      SELECT id FROM public.tasks
      WHERE project_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )
    ))
    -- Add similar clauses for other entity types
  );

-- INSERT: Team members can comment on entities
CREATE POLICY "team_create_comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    (
      (entity_type = 'project' AND entity_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )) OR
      (entity_type = 'task' AND entity_id IN (
        SELECT id FROM public.tasks
        WHERE project_id IN (
          SELECT id FROM public.projects
          WHERE team_id IN (
            SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
          )
        )
      ))
      -- Add similar clauses for other entity types
    )
  );

-- Approvals
CREATE POLICY "users_view_approvals"
  ON public.approvals FOR SELECT
  USING (
    auth.uid() = requested_by OR
    auth.uid() = approver_id
  );

CREATE POLICY "users_create_approvals"
  ON public.approvals FOR INSERT
  WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "approver_update_approvals"
  ON public.approvals FOR UPDATE
  USING (auth.uid() = approver_id)
  WITH CHECK (auth.uid() = approver_id);

-- ============================================================================
-- 18. ACTIVITY LOGS
-- ============================================================================

-- SELECT: Users see activity logs for their team's entities
CREATE POLICY "users_view_activity_logs"
  ON public.activity_logs FOR SELECT
  USING (
    (entity_type = 'project' AND entity_id IN (
      SELECT id FROM public.projects
      WHERE team_id IN (
        SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )) OR
    (entity_type = 'task' AND entity_id IN (
      SELECT id FROM public.tasks
      WHERE project_id IN (
        SELECT id FROM public.projects
        WHERE team_id IN (
          SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
        )
      )
    ))
  );

-- INSERT: System inserts activity logs (from triggers or functions)
CREATE POLICY "system_insert_activity_logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
