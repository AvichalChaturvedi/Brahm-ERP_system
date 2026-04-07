# RLS (Row Level Security) Documentation

## Overview

Row Level Security (RLS) is enforced at the PostgreSQL level to ensure users only access data they are authorized for. This is the foundation of security in this ERP system.

## Core Principles

1. **Team Isolation**: Primary security boundary
   - Users belong to exactly one team
   - All data is scoped to a team
   - Users can only see their team's data

2. **Project Context**: Secondary boundary
   - Most data belongs to a project
   - Users in a team can access all projects in that team
   - Future: Project-level assignment could restrict further

3. **Role-Based Access**: Operation-level control
   - Certain operations require specific roles
   - Example: Only QA Engineers can create test runs
   - Roles are team-specific

4. **Ownership Model**: Individual record control
   - Users can always manage their own records (created_by = auth.uid())
   - Others can read if team/project rules allow
   - Some entities allow read-only access based on role

## RLS Helper Functions

### `is_team_member(team_id UUID) → BOOLEAN`

Check if current user is in a specific team.

```sql
-- Usage in policy
USING (is_team_member(team_id))
```

### `has_role(team_id UUID, role_name user_role) → BOOLEAN`

Check if current user has a specific role in a team.

```sql
-- Usage in policy
WITH CHECK (
  has_role(team_id, 'qa_engineer'::user_role)
)
```

## Policy Structure by Table

### Tier 1: Core Identity

**profiles**: Users can see their own profile and team members
- SELECT: `user_id = auth.uid() OR team membership`
- UPDATE: `user_id = auth.uid()` (self only)
- DELETE: Disabled

**teams**: Users see teams they belong to
- SELECT: User's team only
- INSERT: Authenticated users can create teams
- UPDATE/DELETE: Disabled

**user_roles**: Users see team roles
- SELECT: `team_id = user's team`
- INSERT/UPDATE/DELETE: Admin only

### Tier 2: Projects & Planning

**projects**: Team-wide visibility with PM management
- SELECT: All team members
- INSERT: Project Managers only
- UPDATE: Project Managers or creator
- DELETE: Creator or Admin

**tasks**: Team-wide with role-specific operations
- SELECT: All team members in project
- INSERT: Team members (creator must be assigned)
- UPDATE: Creator, assignee, or PM
- DELETE: Creator or PM

**milestones**: Team-wide visibility
- SELECT: All team members
- INSERT/UPDATE: Team members
- DELETE: Restricted

### Tier 3: Specialized Modules

Each module (QA, firmware, PCB, procurement) follows similar pattern:

**Visibility**: All team members
**Create**: Specific role required
**Update**: Creator + role, or owner
**Delete**: Creator + role, or PM

Example for QA:
```sql
-- Only QA Engineers can create test plans
INSERT WITH CHECK (
  has_role(team_id, 'qa_engineer'::user_role)
)
```

### Tier 4: Supporting Data

**comments, approvals, activity_logs**: 
- Can involve multiple users
- Visibility tied to parent entity access
- Update/delete restricted to owner

## Common RLS Patterns

### Pattern 1: Team-Based Access
```sql
-- User can access if in same team
USING (team_id IN (
  SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
))
```

### Pattern 2: Project-Based Access
```sql
-- User can access if project is in their team
USING (project_id IN (
  SELECT id FROM public.projects
  WHERE team_id IN (
    SELECT team_id FROM public.profiles WHERE user_id = auth.uid()
  )
))
```

### Pattern 3: Role-Based Operation
```sql
-- User must have specific role to insert
WITH CHECK (
  has_role(
    (SELECT team_id FROM projects WHERE id = project_id),
    'qa_engineer'::user_role
  )
)
```

### Pattern 4: Ownership or Role
```sql
-- Owner can always update, or must have PM role
USING (
  auth.uid() = created_by OR
  has_role(team_id, 'project_manager'::user_role)
)
```

## Testing RLS Policies

### Test as Different User

Use Supabase CLI to test:
```bash
supabase migration new test_rls_policies
```

### Manual Testing

1. Sign in as User A (PM)
2. Verify can see all projects in team
3. Create a task
4. Sign in as User B (QA)
5. Verify can see User A's task
6. Try to delete: should fail (unless policy allows)

### Unit Tests Example

```typescript
// Test: QA Engineer can create test runs
const { data, error } = await supabase
  .from('test_runs')
  .insert([{ test_case_id: tc_id, executed_by: qa_user_id, status: 'passed' }]);

expect(error).toBeNull();
```

### Integration Tests Example

```typescript
// Test: Firmware Engineer cannot create QA plans
const { error } = await supabase
  .from('qa_plans')
  .insert([{ project_id, title: 'Test' }]);

expect(error?.message).toMatch(/permission denied/);
```

## Debugging RLS Issues

### Check Policy Application

```sql
-- View all policies on a table
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

### Test Policy in SQL

```sql
-- Switch to test user context
SET LOCAL SESSION AUTHORIZATION 'user-id'::uuid;

-- Try the query
SELECT * FROM tasks WHERE project_id = 'proj-id';
```

### Common Issues

1. **"No rows found"**: User doesn't have access
   - Check team membership
   - Check role for operation
   - Check project assignment

2. **"Permission denied"**: Policy blocks operation
   - Verify policy allows operation
   - Check role requirements
   - Verify ownership/assignment

3. **Performance issues**: Too many policies
   - Optimize policy conditions
   - Use SECURITY DEFINER functions
   - Consider caching strategy

## Future Enhancements

### Project-Level Assignment

Could restrict team members to specific projects:

```sql
-- Create project_members table
CREATE TABLE project_members (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES auth.users(id),
  UNIQUE(project_id, user_id)
);

-- Update policy
USING (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
)
```

### Granular Role Permissions

Define explicit permissions per role:

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role user_role,
  resource TEXT, -- 'tasks', 'qa_plans', etc.
  action TEXT, -- 'create', 'update', 'delete'
  UNIQUE(role, resource, action)
);
```

### Time-Based Access Control

Expire user access after project completion:

```sql
-- Check project status
USING (
  project_id IN (
    SELECT id FROM projects
    WHERE status IN ('active', 'on_hold')
  )
)
```

## Best Practices

1. **Always test RLS policies** before merging to main
2. **Use helper functions** for complex permission logic
3. **Keep policies readable** - use consistent patterns
4. **Document exceptions** - why does this policy allow X?
5. **Audit access patterns** - log sensitive operations
6. **Review quarterly** - ensure policies match current roles

## References

- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- This Project: See `rls_policies.sql`
