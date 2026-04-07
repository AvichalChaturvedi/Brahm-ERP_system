# Deployment Guide - Hardware ERP System

## Quick Start Deployment (5 minutes)

### Prerequisites
- GitHub account
- Supabase account (free tier)
- Vercel or GitHub Pages account

### Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Name: "hardware-erp"
4. Save the password
5. Wait for deployment (5 min)

### Step 2: Setup Database
1. Open SQL Editor in Supabase dashboard
2. Copy entire contents of `schema.sql`
3. Paste and execute
4. Copy entire contents of `rls_policies.sql`
5. Paste and execute

### Step 3: Get API Keys
1. Go to Settings → API
2. Copy "Project URL" → VITE_SUPABASE_URL
3. Copy "anon public" key → VITE_SUPABASE_ANON_KEY

### Step 4: Setup Frontend Repo
```bash
cd erp-app
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Step 5: Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com/import
3. Select your repo
4. Add environment variables
5. Click Deploy

**Your app is live!** Share the URL with your team.

---

## Detailed Deployment Guide

### Part 1: Supabase Setup

#### 1a. Create Project
```
Provider: Supabase
Region: Closest to your team
Database Name: postgres
```

#### 1b. Configure Authentication
1. Authentication > Providers
2. Email/Password: Enable
3. (Optional) GitHub OAuth:
   - Create GitHub OAuth app
   - Add Client ID and Secret
   - Set redirect: https://your-project.supabase.co/auth/v1/callback

#### 1c. Run Database Migration
```bash
# Connect to Supabase
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Run schema
\i schema.sql

# Run RLS policies
\i rls_policies.sql

# Verify tables
\dt
```

Or use Supabase SQL Editor (easier):
1. SQL Editor > New Query
2. Paste schema.sql, execute
3. Paste rls_policies.sql, execute

#### 1d. Load Sample Data (Optional)
```sql
-- Edit seed_data.sql with real user IDs from auth.users
-- Then execute in SQL Editor
```

### Part 2: Frontend Setup

#### 2a. Install Dependencies
```bash
cd erp-app
npm install
```

#### 2b. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

#### 2c. Test Locally
```bash
npm run dev
```

Open http://localhost:5173
- Sign up with test email
- Verify auth works
- Check console for errors

### Part 3: Deploy to Vercel

#### 3a. Prepare GitHub Repo
```bash
git init
git add .
git commit -m "Initial commit: Hardware ERP"
git branch -M main
git remote add origin https://github.com/username/hardware-erp
git push -u origin main
```

#### 3b. Deploy via Vercel
1. Go to https://vercel.com/new
2. Import from Git
3. Select your repo
4. Project name: hardware-erp
5. Framework: Vite
6. Environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
7. Click Deploy

Wait 2-3 minutes...

#### 3c. Verify Deployment
- Check build logs
- Visit production URL
- Test signup flow
- Check browser console

### Part 4: Post-Deployment

#### 4a. Configure Supabase Auth Redirect
1. Supabase > Authentication > URL Configuration
2. Site URL: https://your-vercel-domain.vercel.app
3. Redirect URLs: https://your-vercel-domain.vercel.app

#### 4b. Setup Email Notifications (Optional)
1. Authentication > Email Templates
2. Customize welcome email
3. Configure sender email

#### 4c. Enable Backups
1. Settings > Backups
2. Enable daily backups
3. Configure retention

#### 4d. Monitor Performance
1. Supabase > Logs > Database
2. Set up alerts for slow queries
3. Monitor auth logs

### Part 5: Team Onboarding

#### Email List
Create accounts for team members:
1. PM: pm@company.com
2. Architect: architect@company.com
3. QA: qa@company.com
4. Firmware: firmware@company.com
5. PCB: pcb@company.com
6. Procurement: procurement@company.com
7. UI/UX: uiux@company.com
8. Wiring: wiring@company.com

#### Share URL
Send Vercel deployment URL to all team members.

#### First Login Guide
1. Click "Sign Up"
2. Enter email address
3. Check email for confirmation link
4. Set password
5. You're in! Dashboard will show

#### Assign Roles
After initial signup:
1. Have PM or Admin log in
2. Go to Settings > Team Management (coming soon in Phase 4)
3. Assign roles to users

---

## Scaling & Maintenance

### Performance Optimization

#### Database
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM tasks WHERE project_id = 'xxx';

-- Create indexes for frequent queries
CREATE INDEX idx_tasks_status ON tasks(status);
```

#### Frontend Caching
```typescript
// Cache API responses
const cache = new Map();
```

#### CDN
Vercel automatically uses Vercel's edge network for static assets.

### Cost Estimation (Monthly)

| Component | Free Tier | Cost |
|-----------|-----------|------|
| Supabase Database | 500MB | $25/100GB |
| Auth Users | Unlimited | Included |
| Storage | 1GB | $5/100GB |
| Edge Functions | 125,000/month | $0.50/1M |
| Vercel | 100GB | $5-20 |

**Typical small team**: $30-50/month

### Backup & Disaster Recovery

#### Automated Backups
- Supabase: Daily backups, 7-day retention
- Enable in Settings > Backups

#### Manual Export
```bash
# Export database
pg_dump postgresql://user:pass@host/db > backup.sql

# Restore
psql postgresql://user:pass@host/db < backup.sql
```

#### Data Retention Policy
- Keep 30 days of activity logs
- Archive completed projects to cold storage
- GDPR: Export/delete user data on request

### Monitoring & Alerting

#### Supabase Monitoring
1. Go to Logs section
2. Monitor database performance
3. Set alerts for:
   - Failed auth attempts
   - Database errors
   - Slow queries

#### Vercel Monitoring
1. Analytics in Vercel dashboard
2. Monitor response times
3. Check for build failures

#### Application Monitoring (Optional)
```typescript
// Add Sentry or similar
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
});
```

---

## Troubleshooting Deployment

### Problem: "Permission Denied" Errors

**Cause**: RLS policies blocking access

**Solution**:
1. Check user's team membership
2. Verify role assignment
3. Check RLS policy in Supabase console
4. Review RLS_GUIDE.md

### Problem: "CORS Error"

**Cause**: Supabase URL not whitelisted

**Solution**:
1. Supabase > Authentication > URL Configuration
2. Verify Site URL is set
3. Clear browser cache
4. Restart dev server

### Problem: Blank Dashboard

**Cause**: Missing environment variables

**Solution**:
1. Check `.env.local` has both variables
2. Verify values are correct (no extra spaces)
3. Restart dev server
4. Check console for errors

### Problem: Slow Performance

**Cause**: Missing indexes or N+1 queries

**Solution**:
1. Check schema.sql has indexes
2. Use `EXPLAIN ANALYZE` to find slow queries
3. Optimize React component rendering
4. Enable query caching

### Problem: Auth Loop

**Cause**: Redirect URL mismatch

**Solution**:
1. Supabase > Authentication > URL Configuration
2. Verify Site URL matches your domain
3. Update CORS if needed
4. Clear cookies and try again

---

## Rollback Procedure

### If Something Goes Wrong

#### 1. Stop Vercel Deployment
```bash
# Revert to previous commit
git revert HEAD
git push
```

#### 2. Restore Database (if schema changes)
```sql
-- Restore from backup
-- In Supabase: Settings > Backups > Restore
```

#### 3. Check Logs
- Vercel: Deployments tab
- Supabase: Logs section
- Browser: Developer tools console

---

## Advanced Deployment

### Custom Domain

#### 1. Add Domain to Vercel
1. Vercel Project > Settings > Domains
2. Add your domain
3. Update DNS records (instructions provided)
4. Wait for verification

#### 2. Update Supabase Auth URLs
1. Supabase > Authentication > URL Configuration
2. Update Site URL to your domain
3. Update Redirect URLs

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Environment-Specific Configs

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

---

## Support & Help

### Documentation
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com

### Community
- Supabase Discord: https://discord.supabase.com
- GitHub Discussions: [Your repo]
- Stack Overflow: Tag `supabase`

### Reporting Issues
Include:
1. Error message (full text)
2. Steps to reproduce
3. Environment (dev/prod, OS, browser)
4. Logs from console
5. Supabase logs

---

**Deployment Status**: ✓ Ready for Production

Last Updated: 2026-04-06  
Version: 1.0.0
