# Hardware ERP - Environment Configuration

## Frontend Environment Variables

Create a `.env.local` file in the `erp-app` root directory:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Get Your Supabase Credentials

1. Create a Supabase project at https://app.supabase.com
2. Go to Settings → API to find your URL and public anon key
3. Copy these values to `.env.local`

## Installation & Setup

### 1. Install Dependencies

```bash
cd erp-app
npm install
```

### 2. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Copy the contents of `schema.sql` and run it in the editor
4. Copy the contents of `rls_policies.sql` and run it in the editor

This will create all tables and enable Row Level Security.

### 3. Create Auth Policies in Supabase

Go to **Authentication > Policies**:
- Email/Password authentication is enabled by default
- Optionally enable GitHub OAuth for easier login during development

### 4. Run Frontend Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Create Your First User

- Sign up at the login page with your email
- This automatically creates a profile and team
- You'll be assigned the first role available

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Deploy Frontend to GitHub Pages

1. Update `vite.config.ts` base URL if needed
2. Run: `npm run build`
3. The `dist` folder is ready to deploy to GitHub Pages

### Supabase is Already Hosted

Your Supabase backend is fully managed:
- Database is hosted on Supabase infrastructure
- Authentication is handled by Supabase Auth
- File storage is available via Supabase Storage

## Next Steps

1. Customize colors and branding in `src/components/UI.tsx`
2. Add more modules from Phase 2-4 as needed
3. Configure email templates in Supabase Auth
4. Set up GitHub OAuth for additional login options
5. Add Edge Functions for external API integrations

## Support

- Supabase Docs: https://supabase.com/docs
- React Router Docs: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
