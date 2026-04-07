# QUICK REFERENCE - Free Tier Deployment

**Print this or bookmark it. Use this when deploying.**

---

## Pre-Deployment Checklist (2 min)

- [ ] Have GitHub account?
- [ ] Have Supabase account?
- [ ] Have Node.js 18+ installed?
- [ ] Have npm installed?
- [ ] Have git installed?
- [ ] Are you in the `erp-app/` folder?

If all checked, proceed.

---

## The 10-Step Deployment (15 min)

### STEP 1: Create GitHub Repo (3 min)

```bash
cd erp-app

git init
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/hardware-erp.git
git add .
git commit -m "Initial: Hardware ERP"
git push -u origin main
```

**Check:**
- [ ] Repo shows on GitHub.com
- [ ] All files visible in GitHub

---

### STEP 2: Enable GitHub Pages (2 min)

1. Go to GitHub repo
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / / (root)
5. Save

**Check:**
- [ ] Wait for "Your site is live at: ..."
- [ ] URL shows in Settings > Pages

---

### STEP 3: Create Supabase (3 min)

1. app.supabase.com
2. New Project
3. Name: hardware-erp
4. Region: closest to you
5. Pricing: Free (default)
6. Create

**Check:**
- [ ] Project created
- [ ] You see dashboard

---

### STEP 4: Run Schema (4 min)

1. SQL Editor > New Query
2. Copy schema.sql (entire file)
3. Paste in SQL editor
4. RUN
5. Wait for ✅

**Check:**
- [ ] No errors
- [ ] Tables appear in Database > Tables

---

### STEP 5: Run RLS (2 min)

1. SQL Editor > New Query
2. Copy rls_policies.sql (entire file)
3. Paste in SQL editor
4. RUN
5. Wait for ✅

**Check:**
- [ ] No errors
- [ ] Policies appear in SQL Editor > Policies

---

### STEP 6: Get Credentials (2 min)

Supabase dashboard:
1. Settings > API
2. Copy Project URL → `VITE_SUPABASE_URL`
3. Copy anon key → `VITE_SUPABASE_ANON_KEY`

Save these.

---

### STEP 7: Setup Frontend (2 min)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Keep free tier settings
VITE_DISABLE_REALTIME=true
VITE_DISABLE_FILE_UPLOAD=true
VITE_POLLING_INTERVAL=30000
```

**Check:**
- [ ] .env.local exists
- [ ] Has both Supabase keys
- [ ] Paths are correct (no extra spaces)

---

### STEP 8: Test Locally (3 min)

```bash
npm install
npm run dev
```

Open: http://localhost:5173/hardware-erp/

**Test:**
- [ ] Signup with test@example.com
- [ ] Login works
- [ ] Dashboard appears
- [ ] Create project works

Press `Ctrl+C` to stop.

---

### STEP 9: Build & Deploy (2 min)

```bash
npm run build
git add dist/
git commit -m "Build: deploy"
git push origin main
```

**Wait:** 1-2 minutes for GitHub to build.

---

### STEP 10: Verify Live (1 min)

Go to your GitHub Pages URL:
```
https://YOUR-USERNAME.github.io/hardware-erp/
```

**Test:**
- [ ] Page loads
- [ ] Signup works
- [ ] Dashboard appears

**DONE!** 🎉

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| GitHub Pages shows 404 | Verify `base: '/hardware-erp/'` in vite.config.ts |
| Can't connect to database | Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY |
| Signup fails | Check Supabase > Authentication > Email/Password enabled |
| App is slow | Normal (30s polling). Wait for GitHub Pages to finish. |
| "npm command not found" | Install Node.js from nodejs.org |
| "git command not found" | Install Git from git-scm.com |

---

## Environment Variables Reference

### REQUIRED
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### FREE TIER DEFAULTS (Don't change)
```
VITE_DISABLE_REALTIME=true           # Polling instead (free)
VITE_DISABLE_FILE_UPLOAD=true        # Save 1GB storage
VITE_DISABLE_EMAIL=true              # No external service
VITE_POLLING_INTERVAL=30000          # Poll every 30s
```

---

## Command Reference

| Command | What it does |
|---------|--------------|
| `git init` | Initialize git repo |
| `git add .` | Stage all files |
| `git commit -m "msg"` | Commit with message |
| `git push` | Upload to GitHub |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |

---

## Links You'll Need

| Service | URL |
|---------|-----|
| GitHub | https://github.com |
| Supabase | https://app.supabase.com |
| Your GitHub Pages | https://YOUR-USERNAME.github.io/hardware-erp/ |
| Your Supabase Project | https://app.supabase.com/project/[your-project] |

---

## Files to Know

| File | Purpose |
|------|---------|
| `FREE_TIER_SETUP.md` | Detailed 15-min guide |
| `FREE_TIER_PLAN.md` | Overview of free tier |
| `COST_AUDIT.md` | Cost analysis |
| `WHEN_YOU_NEED_TO_PAY.md` | Upgrade decisions |
| `.env.example` | Environment template |
| `vite.config.ts` | GitHub Pages config |
| `schema.sql` | Database schema |
| `rls_policies.sql` | Security policies |

---

## Success Indicators

### ✅ GitHub Setup Works
- Repo appears on GitHub.com
- GitHub Pages URL is live
- Can view code in GitHub

### ✅ Supabase Setup Works
- Project created
- Database created
- Tables visible in dashboard
- Can view API keys

### ✅ App Works Locally
- `npm run dev` starts without errors
- Can access localhost:5173
- Signup creates account
- Login works

### ✅ App Works Live
- GitHub Pages URL loads
- Can signup
- Can create project
- Dashboard shows data

---

## Ongoing Tasks

### Weekly
- [ ] Users report any bugs

### Monthly
- [ ] Check Supabase usage: Usage > Database
- [ ] If <400MB: Continue on free tier
- [ ] If >400MB: Plan to upgrade

### When Making Changes
```bash
# 1. Edit code
# 2. Test locally: npm run dev
# 3. Build: npm run build
# 4. Push: git push
# 5. Wait 1-2 minutes for GitHub Pages
# 6. Share updated URL with team
```

---

## Cost Check

Go to Supabase dashboard:
1. Usage (left menu)
2. Look at:
   - Database Storage: \_\_\_\_\_ MB (should be <500MB)
   - Storage: \_\_\_\_\_ MB (should be <1GB)
   - Real-time: Should be disabled
   
If under limits: **You pay $0/month**

---

## Help Resources

**Something doesn't work?**

1. Check browser console: F12 → Console
2. Check Supabase logs: Dashboard > Logs
3. Read troubleshooting in `FREE_TIER_SETUP.md`
4. Ask in Supabase Discord

**New feature needed?**
- See `APP_GUIDE.md`
- See Phase 2 docs

**Need to upgrade?**
- See `WHEN_YOU_NEED_TO_PAY.md`

---

## Remember

✅ This is actually free  
✅ No credit card trap  
✅ No hidden costs  
✅ Simple to setup  
✅ Easy to maintain  
✅ Clear upgrade path when/if needed

---

**Status**: Ready to deploy  
**Time**: 15 minutes  
**Cost**: $0/month  
**Support**: See full docs in project folder
