# Hardware ERP System - Complete Implementation Guide

## Project Overview

A production-ready internal ERP system for embedded hardware product development teams. Covers project management, QA, firmware, PCB design, procurement, and more.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel (frontend) / Supabase (backend)
- **Security**: Row Level Security on all tables

## Phase 1 Implementation (COMPLETE)

✓ App shell with React Router navigation  
✓ Supabase Auth integration (signup/login)  
✓ Sidebar and top navigation  
✓ Dashboard with role-aware widgets  
✓ Projects module (CRUD, list, detail)  
✓ Tasks module (assignment, status, priority)  
✓ Milestones management  
✓ Project 360 detail page  
✓ Dark mode support  
✓ Initial RLS policies  

## Phase 2 Implementation (IN PROGRESS)

- [ ] QA/QC module
- [ ] Firmware module
- [ ] UI/UX module
- [ ] PCB engineering module
- [ ] Wiring module
- [ ] Module-specific RLS

## Phase 3 Implementation (PLANNED)

- [ ] BOM import and versioning
- [ ] Line-by-line BOM review
- [ ] Supplier comparison
- [ ] Costing and lead-time tracking
- [ ] Procurement workflow
- [ ] Integration adapters (Octopart/DigiKey)

## Phase 4 Implementation (PLANNED)

- [ ] Approvals workflow
- [ ] Audit log and compliance
- [ ] RLS hardening
- [ ] Supabase Storage file uploads
- [ ] Edge Functions for external APIs
- [ ] Demo data seeding

## Project Structure

```
erp-app/
├── src/
│   ├── components/
│   │   ├── UI.tsx              # Reusable UI components
│   │   ├── Sidebar.tsx         # Left navigation
│   │   └── Topbar.tsx          # Top bar
│   ├── pages/
│   │   ├── LoginPage.tsx       # Auth
│   │   ├── DashboardPage.tsx   # Home
│   │   ├── ProjectsPage.tsx    # Project list
│   │   └── ProjectDetailsPage.tsx
│   ├── services/
│   │   ├── supabase.ts         # Supabase client
│   │   └── api.ts              # API service layer
│   ├── hooks/
│   │   └── index.ts            # React hooks
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   └── index.ts            # Utility functions
│   ├── store/
│   │   └── index.ts            # Zustand stores
│   ├── App.tsx                 # Main router
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── schema.sql                  # Database schema
├── rls_policies.sql            # RLS policies
├── SETUP.md                    # Setup instructions
└── vite.config.ts              # Build config
```

## Key Files

### Database Schema (schema.sql)
- 50+ tables for complete ERP coverage
- Includes core identity, projects, QA, firmware, BOM, procurement
- All tables have RLS enabled
- Comprehensive indexes for performance

### RLS Policies (rls_policies.sql)
- Team-based access control
- Role-based permissions
- Project-aware data isolation
- Helper functions for permission checks

### Frontend Components

**App.tsx**: Main router with protected routes
- Handles auth state and navigation
- Redirects unauthenticated users to login

**Sidebar.tsx**: Left navigation
- Shows all modules
- Highlights current page
- Logout button

**Topbar.tsx**: Top bar
- Title display
- Sidebar toggle
- Dark mode toggle

**UI.tsx**: Reusable components
- StatusBadge, PriorityBadge
- Button, Input, Select
- Card, Modal
- EmptyState, LoadingSpinner

## Database Tables

### Core (5)
- profiles
- teams
- user_roles
- general_documents
- activity_logs

### Projects (4)
- projects
- milestones
- wbs_items
- tasks
- task_dependencies

### Architecture (6)
- architecture_blocks
- interfaces
- integration_matrix
- requirements
- design_decisions
- risks

### QA (9)
- qa_plans
- qa_checklists
- test_cases
- test_runs
- test_results
- defects
- capa_records
- release_gates

### Firmware (5)
- firmware_records
- firmware_targets
- github_links
- build_logs
- firmware_versions

### UI/UX (3)
- uiux_reviews
- design_files
- handoff_checklists

### PCB (5)
- pcb_revisions
- fusion_references
- design_review_checklist
- dfm_dfc_checks
- pcb_issues

### BOM & Procurement (9)
- bom_uploads
- bom_versions
- bom_items
- bom_item_revisions
- suppliers
- supplier_quotes
- approved_parts
- procurement_items
- purchase_orders

### Wiring (4)
- wiring_documents
- wiring_revisions
- wiring_approvals
- manufacturing_checklists

### Workflow (3)
- approvals
- comments

## Role Permissions

| Role | Primary Modules |
|---|---|
| Project Manager | Projects, tasks, milestones, approvals, cost rollup |
| System Architect | Architecture, requirements, risks, interfaces |
| QA Engineer | QA plans, test cases, defects, release gates |
| Firmware Engineer | Firmware, GitHub links, builds |
| UI/UX Engineer | Design files, reviews, handoff |
| PCB Engineer | PCB revisions, DFM/DFC, BOM linkage |
| Procurement Manager | BOM, suppliers, procurement, costing |
| Wiring Resource | Wiring diagrams, approvals, manufacturing |

## RLS Strategy

All table access is controlled at the database layer using Row Level Security:

1. **Team Isolation**: Users only see data from their team
2. **Project Context**: Most data is scoped to projects
3. **Role Enforcement**: Sensitive operations require specific roles
4. **Ownership Model**: Users can manage their own records
5. **Approval Workflows**: Two-way visibility for approvers

## Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### 2. Clone and Install
```bash
cd erp-app
npm install
```

### 3. Setup Supabase
- Create project on supabase.com
- Copy schema.sql to SQL Editor and run
- Copy rls_policies.sql to SQL Editor and run
- Copy API keys to .env.local

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy
Push to GitHub and deploy via Vercel (automatically).

## API Layer

The `services/api.ts` file provides a clean abstraction:

```typescript
// Fetch projects
const projects = await projectService.getProjects(teamId);

// Create task
const task = await taskService.createTask({
  project_id: projectId,
  title: 'New task',
  // ...
});

// Log activity
await activityService.logActivity(
  'task', task.id, 'created', userId
);
```

## State Management

Zustand stores for global state:

```typescript
// Auth state
const { user, profile } = useAuthStore();

// UI state
const { sidebarOpen, darkMode } = useUIStore();
```

## Hooks

Custom React hooks for data fetching:

```typescript
// Fetch and subscribe to tasks
const { tasks, loading } = useTasks(projectId);

// Fetch milestones
const { milestones } = useMilestones(projectId);

// Fetch project details
const { project } = useProject(projectId);
```

## Next Steps

1. **Phase 2**: Build QA, firmware, UI/UX, PCB, wiring modules
2. **Phase 3**: Implement BOM and procurement with supplier integration
3. **Phase 4**: Add approvals, audit logging, and RLS hardening
4. **Production**: Configure Supabase Storage, set up backups, enable monitoring

## Customization

### Colors and Branding
Edit `tailwind.config.js` theme colors

### Navigation Items
Update `Sidebar.tsx` navItems array

### Module Pages
Create new pages in `src/pages/`

### API Endpoints
Add new services to `src/services/api.ts`

## Security

- All data access enforced by RLS
- Auth tokens stored securely in Supabase
- No secrets in frontend code
- External API calls go through Edge Functions
- File uploads encrypted in Supabase Storage

## Testing

- Unit tests: Jest (add as needed)
- Integration tests: Test database queries with RLS
- E2E tests: Playwright (planned)

## Support & Resources

- Supabase: https://supabase.com/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev

---

**Status**: Phase 1 Complete, Ready for Phase 2  
**Last Updated**: 2026-04-06  
**Version**: 0.1.0-alpha
