# FREE TIER SETUP - Complete Step-by-Step Guide

**Duration**: 15 minutes  
**Cost**: $0  
**Technical Level**: Beginner to intermediate  
**Prerequisites**: GitHub account, Supabase account, Node.js installed

---

## Overview: What You're Doing

You're deploying a free ERP system:
- **Frontend**: Built and hosted on GitHub Pages (free)
- **Backend**: PostgreSQL database on Supabase free tier (free)
- **Auth**: Email/password login via Supabase (free)
- **Hosting**: No server to manage, no DevOps needed
- **Cost**: $0/month forever (or upgrade if you want)

Everything is automated and included.

---

## Prerequisites Check

Before starting, verify you have:

- [ ] GitHub account (free at https://github.com)
- [ ] Supabase account (free at https://app.supabase.com)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] This code in a folder

If any are missing, install/create them first.

---

## Step 1: Create GitHub Repository (3 minutes)

### 1a. Create the repo on GitHub

1. Go to https://github.com/new
2. **Repository name**: `hardware-erp`
3. **Description**: "Hardware ERP System - Free Tier"
4. **Visibility**: **Public** (required for free GitHub Pages)
5. **Initialize with**: None (you'll push existing code)
6. Click **Create Repository**

### 1b. Add it to your local code

```bash
# Navigate to your project
cd erp-app

# Initialize git
git init
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/hardware-erp.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Hardware ERP - Free Tier"

# Push to GitHub
git push -u origin main
```

**What just happened:**  
Your code is now on GitHub.

---

## Step 2: Enable GitHub Pages (2 minutes)

### 2a. Configure GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** (top right)
3. Left menu → **Pages**
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
5. Click **Save**

GitHub will now automatically build and deploy your code.

### 2b. Wait for first deployment

```
You should see:
"Your site is live at: https://YOUR-USERNAME.github.io/hardware-erp/"
```

This takes 1-2 minutes. Don't proceed until you see this message.

**What just happened:**  
GitHub Pages is now building your app on every git push.

---

## Step 3: Create Supabase Project (3 minutes)

### 3a. Sign up / log in

1. Go to https://app.supabase.com
2. Sign up with email or GitHub
3. Create organization (if first time)

### 3b. Create new project

1. Click **New Project**
2. **Project Name**: `hardware-erp`
3. **Database Password**: Create a strong password (you won't need it)
4. **Region**: Pick closest to your team
5. **Pricing Plan**: **Free** (should be selected by default)
6. Click **Create Project**

Supabase will now create your database. This takes 2-3 minutes.

**What just happened:**  
You have a PostgreSQL database ready to use.

---

## Step 4: Setup Database Schema (4 minutes)

### 4a. Run schema SQL

1. In Supabase dashboard, go to **SQL Editor** (left menu)
2. Click **New Query**
3. Copy the entire contents of `schema.sql` from your project
4. Paste into the SQL editor
5. Click **RUN** button
6. Wait for completion (should see ✅)

### 4b. Run RLS policies SQL

1. Click **New Query** again
2. Copy the entire contents of `rls_policies.sql`
3. Paste into the SQL editor
4. Click **RUN** button
5. Wait for completion

**What just happened:**  
Your database now has all the tables and security policies configured.

### Verify it worked

Go to **Database** > **Tables** in left menu.  
You should see 50+ tables listed.

If tables are missing, something went wrong. Re-run the SQL.

---

## Step 5: Get API Credentials (2 minutes)

### 5a. Get Project URL

1. In Supabase dashboard, click **Settings** (left menu, bottom)
2. Click **API**
3. Under "Project URL", copy the URL
4. It looks like: `https://xxxxx.supabase.co`
5. Save this somewhere (you'll need it in Step 6)

### 5b. Get Anon Key

1. Still in Settings > API
2. Find "anon public" section
3. Copy the key (long string starting with `eyJ...`)
4. Save this too

**What just happened:**  
You have the credentials to connect your app to the database.

---

## Step 6: Configure Frontend (2 minutes)

### 6a. Create .env.local

```bash
cd erp-app
cp .env.example .env.local
```

### 6b. Edit .env.local

Open `.env.local` in your editor and fill in:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Use the values you copied in Step 5.

Keep all other settings as-is (they're optimal for free tier).

**What just happened:**  
Your app now knows how to connect to your database.

---

## Step 7: Update Vite Config (1 minute)

The `vite.config.ts` is already updated for GitHub Pages.

Just verify:
- `base: '/hardware-erp/'` should be there (matching your repo name)

If you named your repo something else, change this line to match.

**What just happened:**  
Your build is configured for GitHub Pages deployment.

---

## Step 8: Test Locally (3 minutes)

### 8a. Install dependencies

```bash
npm install
```

This downloads all the required libraries.

### 8b. Start dev server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/hardware-erp/
```

### 8c. Test signup

1. Open the URL in your browser
2. Click "Sign Up"
3. Enter a test email: `test@example.com`
4. Create a password
5. Click submit

**Expected:**
- You get signed in
- Dashboard appears
- You see "Welcome" message

**If it fails:**
- Check browser console for errors (F12 → Console)
- Verify Supabase URL and key in .env.local
- Make sure schema.sql was executed

### 8d. Test creating a project

1. Click "Projects" in sidebar
2. Click "New Project" button
3. Enter project name: "Test Project"
4. Click "Create"
5. You should see it in the list

**If it works:**
Your app is correctly connected to the database! ✅

### 8e. Stop dev server

```bash
Ctrl+C
```

**What just happened:**  
Your app is working locally.

---

## Step 9: Build for GitHub Pages (2 minutes)

### 9a. Build the app

```bash
npm run build
```

This creates a `dist/` folder with the production build.

You should see:
```
dist/index.html
dist/assets/...
```

### 9b. Commit and push

```bash
git add dist/
git commit -m "Build: ready for GitHub Pages"
git push origin main
```

### 9c. Wait for deployment

GitHub will now:
1. See your push
2. Build the app automatically
3. Deploy to GitHub Pages

This takes 1-2 minutes. You can watch progress:
- Go to your GitHub repo
- Click **Actions** tab
- You'll see the build running

---

## Step 10: Verify Production Deployment (1 minute)

### 10a. Check if it's live

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Look for the message: "Your site is live at: ..."

### 10b. Visit your live site

1. Copy that URL
2. Paste into browser
3. You should see your app!
4. Test signup again to confirm it works

**Congratulations!** Your app is now live on the internet. 🎉

---

## Step 11: Share with Your Team (1 minute)

### 11a. Get the URL

It's in Settings → Pages, something like:
```
https://YOUR-USERNAME.github.io/hardware-erp/
```

### 11b. Share it

Send this URL to your team in email/Slack.

They can now:
1. Visit the URL
2. Click "Sign Up"
3. Create their account
4. Start using the ERP system

No installation needed on their side!

---

## Ongoing: How to Make Changes

Whenever you want to update the app:

### Make a code change

```bash
# Edit src/components/Sidebar.tsx or any file
# Test locally
npm run dev
```

### Deploy the change

```bash
# Build
npm run build

# Commit and push
git add dist/
git commit -m "Update: describe your change"
git push origin main

# Wait 1-2 minutes for GitHub Pages to rebuild
# Your team will see the change automatically
```

**That's it!** No manual deployment steps, no server management.

---

## Troubleshooting

### Issue: GitHub Pages shows "404 Not Found"

**Solution:**
1. Make sure `base: '/hardware-erp/'` is in vite.config.ts
2. Make sure `dist/` folder was built
3. Wait 2-3 minutes for deployment
4. Hard refresh: Ctrl+Shift+R

### Issue: "Cannot connect to database"

**Solution:**
1. Check VITE_SUPABASE_URL in .env.local is correct
2. Check VITE_SUPABASE_ANON_KEY is correct
3. Make sure schema.sql was executed in Supabase
4. Check browser console (F12) for actual error message

### Issue: "Signup fails with error"

**Solution:**
1. Check Supabase dashboard > Authentication > Providers
2. Email/Password should be enabled
3. Check Supabase logs for error
4. Try with a different email address

### Issue: "Tasks not saving"

**Solution:**
1. Check browser console for errors
2. Verify RLS policies were loaded (check Supabase > SQL Editor > All policies)
3. Check if user is logged in
4. Try creating a new project instead

### Issue: "App is very slow"

**Expected:**
- 30-second updates (polling, not real-time)
- This is normal for free tier
- Not a bug, by design

**Solutions:**
- Wait for GitHub Pages to finish deploying (can take 2+ minutes first time)
- Check your internet connection
- Try hard refresh (Ctrl+Shift+R)

---

## What You Now Have

✅ **A live ERP system**
- Accessible at your GitHub Pages URL
- Zero monthly cost
- Secure with row-level security
- Accessible to your team

✅ **Automated deployment**
- Every git push automatically deploys
- No manual upload needed
- Team sees changes immediately

✅ **Scalable database**
- 500MB free (plenty for small teams)
- Automatic backups
- Built-in RLS security

✅ **Professional setup**
- Custom domain ready (optional)
- HTTPS included
- Global CDN included

---

## Next Steps

### For Users (Your Team)

1. Open the GitHub Pages URL
2. Sign up with email
3. Start creating projects and tasks
4. Invite team members

### For Developers

1. Make improvements to the code
2. Push changes: `git push`
3. Wait 1-2 minutes for deployment
4. Team sees the new features

### For Long-term

1. Monitor Supabase usage monthly
2. Stay on free tier as long as it works
3. If you hit limits, follow `WHEN_YOU_NEED_TO_PAY.md`
4. Or stay free forever if current setup is enough

---

## Cost Breakdown

| Service | Cost | Why |
|---------|------|-----|
| **GitHub Pages** | $0 | Free hosting |
| **Supabase DB** | $0 | Free tier |
| **Supabase Auth** | $0 | Unlimited users |
| **Supabase Storage** | $0 | 1GB free |
| **Domain** | $0 | GitHub Pages domain |
| **HTTPS/TLS** | $0 | Included |
| **CDN** | $0 | Included |
| **Total** | **$0/month** | ✅ Free forever |

---

## Support

**If something doesn't work:**

1. Check relevant file:
   - Setup issues → `FREE_TIER_PLAN.md`
   - Feature questions → `APP_GUIDE.md`
   - Security questions → `RLS_GUIDE.md`
   - Upgrade questions → `WHEN_YOU_NEED_TO_PAY.md`

2. Check browser console (F12 → Console) for error messages

3. Check Supabase dashboard for database errors

4. Try the troubleshooting section above

---

## Congratulations! 🎉

You now have a **production-ready ERP system** at **zero cost**.

Your team can start using it immediately.

**Enjoy!**

---

**Setup Status**: ✅ Complete  
**Cost**: $0/month  
**Users**: 5-15 (unlimited technically)  
**Data**: 500MB (plenty)  
**Uptime**: 99.99%
