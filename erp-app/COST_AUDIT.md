# Cost Audit & Free-Tier Rework - Hardware ERP System

## Current Architecture Cost Analysis

### 🔴 Current Setup (Problematic Costs)

| Component | Tier | Monthly Cost | Issue |
|-----------|------|--------------|-------|
| **Vercel** | Pro/Hobby | $0-20 | Not free for custom domains |
| **Supabase** | Free | $0 (with limits) | ✅ Free tier available |
| **Realtime subscriptions** | N/A | $0-50 | Heavy on free tier |
| **Email notifications** | N/A | $0-10 | Potential paid service |
| **Storage (file uploads)** | N/A | $0-5 | 1GB free, then $5/100GB |
| **Total (ideal)** | All free | $0 | ✅ Achievable |

### Issue Assessment

**CRITICAL**: Vercel free tier doesn't support custom domains. For internal teams wanting stability:
- Free Vercel preview deployments expire/change
- Enterprise needs custom domain → must pay
- GitHub Pages/Cloudflare Pages are truly free + stable

**MODERATE**: Supabase free tier has limits:
- 500MB database (not for large attachments)
- 1GB storage
- 500K realtime connections/month
- Rate limiting (soft caps)
- Good enough for 5-15 internal users

**LOW**: Current features are mostly safe on free tier
- RLS policies: free
- Auth: free
- Basic CRUD: free
- Comments/activity: free

---

## ✅ Recommended Free-First Architecture

### **Best Option: Supabase + GitHub Pages**

**Why this combination:**
- GitHub Pages: truly free, custom domain support, stable
- Supabase: free tier is generous for small teams
- No hidden costs, clear upgrade path
- Perfect for 5-15 internal users
- $0/month possible

**Architecture:**
```
GitHub Pages (Free)          Supabase (Free Tier)
  ↓                                ↓
- Static React build       PostgreSQL (500MB free)
- CDN included             Auth (unlimited users)
- Custom domain free       Storage (1GB free)
- No cold starts           RLS security included
  ↓                                ↓
  └────────→ REST API ←────────┘
             (Rate limited but free)
```

---

## Component-by-Component Classification

### Frontend Deployment

| Option | Cost | Custom Domain | Suitable |
|--------|------|---------------|----------|
| **Vercel Free** | $0 | ❌ No | ❌ Not recommended |
| **GitHub Pages** | $0 | ✅ Yes | ✅ **PICK THIS** |
| **Cloudflare Pages** | $0 | ✅ Yes | ✅ Alternative |
| **Netlify Free** | $0 | ❌ After paid | ⚠️ Limited |

**RECOMMENDATION: GitHub Pages**
- Deploy on every git push
- Free forever, no paid upgrade path required
- Works with custom domains
- Includes HTTPS and CDN

### Backend / Database

| Component | Free Tier | Limits | Status |
|-----------|-----------|--------|--------|
| **Supabase Auth** | Unlimited | 50,000 users | ✅ Free now |
| **PostgreSQL DB** | 500MB | Plenty for 5-15 users | ✅ Free now |
| **Realtime** | 500K events/mo | ~40K/user/month | ⚠️ Monitor usage |
| **Storage** | 1GB | Photos/docs only | ⚠️ Don't upload large files |
| **REST API** | Unlimited calls | Rate limited | ✅ Free now |
| **Row Level Security** | Included | Part of DB | ✅ Free now |

**RECOMMENDATION: Use all Supabase free tier**
- Perfect for small teams
- Clear upgrade path when you hit limits
- No vendor lock-in

### Feature Classification

| Feature | Cost | Recommendation |
|---------|------|-----------------|
| Auth (email/password) | Free | ✅ Enable |
| Auth (GitHub OAuth) | Free | ✅ Enable |
| Projects/Tasks/Milestones | Free | ✅ Enable |
| Comments | Free | ✅ Enable |
| Activity logs | Free | ✅ Enable |
| Real-time updates | ~$5-50/mo if heavy | ⚠️ Disable by default |
| File uploads | ~$5/mo per GB | ⚠️ Disable/limit to 1GB |
| Email notifications | $0-20/mo | ❌ Disable for now |
| External API integrations | Varies | ❌ Disable for now |
| Edge Functions | Free tier tiny | ⚠️ Don't use yet |

---

## Free-Tier Limits Explained

### Supabase Free Tier (Actual Limits)

```
Database: 500MB total
  → Phase 1 schema is ~5-10MB
  → Plenty of room for data
  → Limit is on stored data, not queries

Auth: 50,000 users
  → You only have ~15 users
  → No problem

Storage: 1GB total
  → Current schema has no required file uploads
  → Attachments are optional (Phase 2+)
  → Keep file uploads small/disabled initially

Realtime: 500K concurrent connections/month
  → Each user connection counts as 1
  → 15 users × 8 hours/day = ~3,600 connections
  → Well below 500K/month
  → Safe to use

REST API: Unlimited requests
  → Rate limiting applies (friendly limits)
  → Small team usage won't hit it
  → Safe to use
```

### What You Can Safely Do

✅ **Safe on free tier:**
- 15 concurrent users
- 1000 projects
- 100,000 tasks
- Unlimited comments
- Full RLS and auth
- Real-time updates
- Activity logging

❌ **Not suitable for free tier:**
- Large file uploads (>100MB total)
- 100+ concurrent users
- Heavy real-time polling
- High-volume API integrations

---

## Phase 1 Rework for Zero Cost

### Keep (Already free-tier safe)
- ✅ Auth system (email/password + GitHub OAuth)
- ✅ Projects CRUD
- ✅ Tasks and milestones
- ✅ Comments and activity logs
- ✅ RLS and security
- ✅ Dashboard
- ✅ Dark mode

### Disable/Defer (Potential costs)
- ❌ Real-time subscriptions → Use polling instead
- ❌ File uploads → Remove from Phase 1
- ❌ Email notifications → Disable
- ❌ External API integrations → Document only

### Simplify (Reduce complexity)
- Polling instead of subscriptions (cheaper, simpler)
- No edge functions (remove until needed)
- No storage features (remove until needed)
- Manual approvals instead of workflows

---

## Exact Free-Tier Deployment Path

### Step 0: Assess Free Tier Suitability

**Your team:**
- [ ] 5-15 users? → ✅ Free tier OK
- [ ] < 500MB data initially? → ✅ Free tier OK
- [ ] < 1GB file uploads needed? → ✅ Free tier OK
- [ ] <500K monthly realtime events? → ✅ Free tier OK

If ALL checked: **Proceed with free tier**

### Step 1: Frontend on GitHub Pages (5 min)

```bash
# 1. Create GitHub repo
git init
git remote add origin https://github.com/your-org/hardware-erp
git branch -M main
git push -u origin main

# 2. Enable GitHub Pages
# Go to repo Settings > Pages
# Source: Deploy from a branch
# Branch: main, folder: / (root)

# 3. Update vite.config.ts for GitHub Pages
# (See updated config below)

# 4. Build and push
npm run build
git add dist/
git commit -m "Build: initial deploy"
git push
```

### Step 2: Supabase Free (5 min)

```bash
# 1. Create project (free tier)
# supabase.com/dashboard > New Project
# Keep on free tier

# 2. Run schema and RLS
# SQL Editor > paste schema.sql > Execute
# SQL Editor > paste rls_policies.sql > Execute

# 3. Get API keys
# Settings > API
# Copy URL and anon key
```

### Step 3: Environment Setup

```bash
cp .env.example .env.local

# Edit .env.local
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_ENV=free-tier
VITE_DISABLE_REALTIME=true
VITE_DISABLE_FILE_UPLOAD=true
```

### Step 4: Deploy Frontend

```bash
npm run build
# GitHub automatically deploys from dist/ on main branch
# Your app is live at: https://your-org.github.io/hardware-erp
# Or: custom domain (free DNS)
```

**Total time: 15 minutes, Total cost: $0**

---

## What Changes in Code

### Disable Real-Time (Cost Reduction)

**Current (uses realtime):**
```typescript
const channel = supabase
  .channel(`tasks:${projectId}`)
  .on('postgres_changes', ...)
  .subscribe();
```

**New (use polling):**
```typescript
useEffect(() => {
  const interval = setInterval(fetchTasks, 30000); // Poll every 30s
  return () => clearInterval(interval);
}, [projectId]);
```

**Benefit:** 
- Eliminates realtime subscription cost
- Slightly less responsive (30s delay)
- Perfect for small internal teams
- Can enable realtime later

### Disable File Upload (Cost Reduction)

**Remove from Phase 1:**
- Storage features
- File attachment tables
- Upload UI

**Keep documentation:**
- How to add storage later
- Path for upgrade

### Remove Email Notifications

**Remove from Phase 1:**
- Email trigger functions
- Notification settings
- Mail service config

**Benefit:**
- No email service needed
- Much simpler setup
- Can add later

---

## Updated Vite Config for GitHub Pages

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/hardware-erp/', // Match your repo name
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Smaller build
  },
});
```

---

## Environment Variables (Free Tier)

```bash
# .env.example - Updated for free tier

# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Config (Free tier specific)
VITE_APP_ENV=free-tier
VITE_DISABLE_REALTIME=true           # Disable expensive realtime
VITE_DISABLE_FILE_UPLOAD=true        # Disable storage features
VITE_DISABLE_EMAIL=true               # Disable email notifications
VITE_POLLING_INTERVAL=30000           # Poll every 30s instead

# Optional (don't use yet)
# VITE_GITHUB_TOKEN=...              # Enable later
# VITE_FIGMA_TOKEN=...               # Enable later
```

---

## Migration Path: Free → Paid

When you're ready to upgrade (and only if you need to):

### When to Pay

| Trigger | Service | Cost | Action |
|---------|---------|------|--------|
| >500MB data | Supabase | $25/mo | Upgrade project |
| >1GB storage | Supabase | $5/mo per 100GB | Add storage |
| >15 users | N/A | $0 | Monitor usage |
| Need realtime | N/A | $0-20 | Enable realtime |
| Domain exhausted | GitHub Pages | $0 | Use subdomain |

### Upgrade Checklist

```
[ ] Database exceeds 500MB
[ ] Storage exceeds 1GB
[ ] Realtime polling feels slow
[ ] Need email notifications
[ ] Need API integrations
[ ] Need edge functions
[ ] Supabase sends warning email
```

If none checked: **Stay on free tier**

---

## Cost Guarantee

### Phase 1 on Free Tier: $0/month

**Guaranteed costs:**
- GitHub: $0 (no paid tier needed)
- Supabase: $0 (free tier is stable)
- Domain: $0 (GitHub Pages included)
- **Total: $0**

**Conditions:**
- 5-15 users
- < 500MB data
- < 1GB storage
- No paid add-ons
- Monitor for 12+ months

### If You Need to Pay

**When paying becomes reasonable:**
- Growing past 20 users → $25/mo Supabase
- Need more storage → +$5/mo per 100GB
- Need real-time → included in plan
- Need backups → included in plan

**Worst case (heavy usage):** ~$50-75/mo

---

