# FREE TIER PLAN - Phase 1 Deployment

**What This Is**: A working Phase 1 deployment within free-tier constraints  
**What This Isn't**: Guaranteed forever, production-grade, or suitable at any scale  
**Suitable For**: Small internal team (5-15 users), 6-12 months  
**Cost**: $0/month while within constraints  
**Upgrade Trigger**: When you exceed limits (not if, when)  

---

## Free Tier Constraints (Actual Limits)

### Database: 500 MB

**What it means**:
- You have 500 MB total storage
- Schema takes ~10 MB
- ~490 MB for actual data
- Soft limit: Supabase emails warning at 450 MB

**Time until full**:
- Light usage (100 tasks): 12+ months
- Medium usage (1000 tasks): 6-12 months
- Heavy usage (10K+ tasks): 2-4 months

**What happens when full**:
- Cannot create new records
- Supabase sends urgent email
- You must upgrade or delete data

**Action required**: Monitor monthly. Plan upgrade at 400 MB.

### Authentication: 50,000 Users

**What it means**:
- Free tier supports 50,000 users
- You have ~15 users
- No constraint for Phase 1

**Status**: Safe. Not a limiting factor.

### File Storage: 1 GB (Disabled)

**What it means**:
- If enabled: 1 GB total for uploads
- Currently: Disabled in Phase 1
- Reason: Preserve database storage priority

**When to enable**: Phase 2+ with budget allocation

**Status**: Deferred, not a Phase 1 risk.

### Real-Time Events: 500K/Month (Disabled)

**What it means**:
- Real-time subscriptions: 500K events/month
- Current: Using polling instead (free)
- 15 users polling 30s interval = ~7K/month

**Status**: Disabled by design. Polling is free and acceptable for Phase 1.

### API Rate Limit: Soft ~350 req/sec

**What it means**:
- Friendly rate limiting applied
- 15 users polling = ~30 req/minute
- Well below soft limit

**Status**: Safe. Won't be an issue.

### Project Inactivity: 7-Day Pause

**Critical constraint**: Supabase pauses free projects after 7 days without access.

**What this means**:
- If no one accesses the app for 7+ days
- Project becomes temporarily unavailable
- Data isn't lost, just inaccessible
- Resumes automatically when someone logs in

**Impact**: 
- Team must access the system at least weekly
- Or upgrade to Pro ($25/month) to disable pause

**Risk**: Moderate. Depends on team usage patterns.

---

## What Works in Phase 1

✅ **Fully Functional**:
- User signup & login
- Team creation
- Projects (CRUD)
- Tasks (CRUD, assign, status, priority)
- Milestones (create, track)
- Comments on tasks
- Activity log of all changes
- Dashboard with 4 metrics
- Role-based access (RLS enforced)
- Dark/light mode
- GitHub/Google OAuth (optional)

⚠️ **Works with Limitations**:
- Real-time updates: 30-second polling delay (not instant)
- Team isolation: Single-team only (RLS enforced)

❌ **Not Included**:
- File uploads (Phase 2+)
- Email notifications (Phase 2+)
- External API integrations (Phase 2+)
- Edge Functions (Phase 2+)

---

## What's NOT Included (Deferred)

### File Uploads (Phase 2+)
- Why not now: Preserve 1GB free storage
- When to add: After 6+ months or with budget
- Cost when added: Included in Pro tier or $5/100GB

### Email Notifications (Phase 2+)
- Why not now: Requires external service
- When to add: If team requests this feature
- Cost when added: $20+/month (SendGrid, etc.)

### Real-Time Updates (Phase 2+)
- Why not now: Costs money
- Current: 30-second polling (free)
- Alternative: Enable Supabase realtime (upgrade cost)

### External Integrations (Phase 2+)
- GitHub sync, Figma links, supplier APIs
- Why not now: Requires Edge Functions + secrets
- When to add: Phase 2+ with feature prioritization
- Cost when added: $0-50+/month depending on volume

---

## GitHub Pages Constraints

### Static Hosting Only

GitHub Pages **cannot**:
- Execute server code
- Securely store secrets
- Process requests on backend
- Upload files to GitHub

GitHub Pages **can**:
- Serve static files (React app)
- Deploy on git push
- Provide custom domain (free DNS)
- Include HTTPS/TLS
- Global CDN

### Secret Management

⚠️ **Critical**: GitHub Pages is public.

**Never put in frontend code**:
- API keys (except public ones)
- Database passwords
- Service credentials
- Private tokens

**Safe for frontend**:
- Supabase public anon key (it's meant to be public)
- Supabase Auth tokens (temporary, Supabase managed)
- App configuration (non-secret)

**For secrets that must exist**:
- Use Supabase Edge Functions (Phase 2+)
- Edge Functions can securely hold secrets
- Defer to backend operations

---

## Inactivity Risk (Moderate)

### The Constraint

Supabase free tier pauses projects after **7 days of inactivity**.

### What This Means

**If no one accesses the app for 7+ days**:
- App becomes unavailable
- Data is not lost
- Resumes automatically on next login
- Transparent to users (just seems like normal startup)

**If this happens weekly**:
- Supabase resumes on login
- No permanent issue

**If this happens monthly**:
- App is paused most of the time
- Very inconvenient for team

### Mitigation

✅ **Option 1**: Use the app weekly (simple)
- Just access it once per week
- No action needed

✅ **Option 2**: Set up daily ping (Phase 2+)
- Automated request to keep project awake
- Small Edge Function

✅ **Option 3**: Upgrade to Pro ($25/month)
- Removes inactivity pausing
- More stable for teams with spotty usage

---

## Realistic Timeline

### Months 1-2: Fresh Start
```
Database: ~50 MB
Costs: $0/month
Usage: Team ramping up
Risk: None
```

### Months 3-4: Normal Growth
```
Database: ~150 MB
Costs: $0/month
Usage: Regular project tracking
Risk: Still low, but monitor
Action: Check Supabase dashboard monthly
```

### Months 5-6: Approaching Limits?
```
Database: ~300-400 MB
Costs: $0/month (still free)
Usage: Steady team work
Risk: Moderate, plan next steps
Action: Decide: upgrade or archive old data
```

### Months 7-12: Decision Point
```
Database: 400-500 MB (approaching limit)
Costs: $0/month (still free, but time's up)
Usage: Full team, active projects
Risk: High if approaching 500 MB
Action: Must upgrade or clean up
```

### Month 12+: Upgrade Required
```
Database: Hitting 500 MB limit
Costs: Need to upgrade to Pro ($25/month)
Decision point: Justify $25/month, or re-evaluate
Risk: Cannot continue on free tier
Action: Upgrade to Pro or build custom backend
```

---

## Upgrade Path (When You Hit Limits)

### At 450 MB Database

**Warning**: Supabase emails you

**Action**: Decide in next week
- Option A: Upgrade to Pro ($25/month)
- Option B: Delete/archive old projects
- Option C: Accept weekly polling delay and no growth

### To Upgrade

1. Go to Supabase dashboard
2. Settings > Billing
3. Upgrade to Pro ($25/month)
4. No code changes needed
5. 100 GB database immediately available

### Cost After Upgrade

```
Supabase Pro:     $25/month
  Includes:
  - 100 GB database
  - 2 GB storage
  - Real-time enabled
  - Better performance

Optional adds:
- Email service:   +$20/month
- Storage:         +$5 per 100GB/month
```

---

## FAQ: Honest Answers

### "Will we be forced to pay?"
**A**: No. But you'll hit a limit in 6-12 months. Then you choose: upgrade, delete data, or stop growing.

### "Can we stay free forever?"
**A**: Only if you stay under 500 MB database. Unlikely long-term with active team.

### "What if we can't afford $25/month?"
**A**: Your options at that point:
- Build own backend (weeks of work)
- Use different service
- Delete old projects to stay under limit

### "Is free tier suitable for 'real' use?"
**A**: For internal team, first year? Yes. Long-term? No. After limits, you need to pay or rebuild.

### "Are there hidden costs?"
**A**: No. Pricing is transparent. But there ARE limits you'll eventually hit.

### "Can we move off Supabase later?"
**A**: Yes. PostgreSQL is standard. Takes 2-4 weeks to migrate and rewrite auth.

---

## Success Indicators

### ✅ Free Tier is Working If:

- Signup works
- Can create projects/tasks
- Polling updates every 30 seconds
- No database warnings
- Team is active weekly
- <400 MB usage (first 6 months)

### ⚠️ Warning Signs:

- Database approaching 450 MB
- Queries getting slow
- No team access for 7+ days (approaching pause)
- Realtime update needs (30s polling insufficient)

### ❌ Time to Upgrade:

- Database >450 MB
- Cannot wait 30 seconds for updates
- Team needs email notifications
- Want file uploads enabled
- Need true high availability

---

## Honest Summary

### This Approach Works For:

✅ Small internal team (5-15 people)  
✅ First 6-12 months of operations  
✅ Learning how to build ERP  
✅ Proof of concept  
✅ Low-budget startup  
✅ Temporary solution  

### This Approach Doesn't Work For:

❌ Permanent free solution  
❌ Scaling beyond 15 users  
❌ Real-time collaboration needs  
❌ Long-term production grade  
❌ Mission-critical operations  
❌ Regulated industries  

---

**Reality**: Free tier is legitimate for Phase 1. Limits will arrive in 6-12 months. Plan accordingly.

**Cost**: $0/month now. $25/month later (or rebuild). Your choice.

**Duration**: Suitable for ~12 months before major decision.
