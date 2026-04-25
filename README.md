# BrahmForge

Enterprise hardware development and manufacturing operating system built on Next.js App Router.

## AI + Data Foundation (Neon + Prisma + Provider Abstraction)

This project includes backend foundation for:

- Neon Postgres via Prisma ORM
- Server-side AI provider abstraction
- Groq primary provider + OpenRouter fallback
- BOM analysis persistence pipeline (`/api/ai/bom-analysis`)

## Required Environment Variables

Copy `.env.example` into `.env.local` and fill values:

- `DATABASE_URL`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `AI_PROVIDER`
- `DEFAULT_AI_MODEL`

## Database Setup

```bash
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
```

## Verify Foundation

```bash
npm run verify:foundation
```

Checks:

1. environment variable presence
2. database connection
3. AI provider configuration
4. BOM route payload contract

## API Route

`POST /api/ai/bom-analysis`

Flow:

1. Accept BOM data
2. Apply deterministic risk rules (data decides labels)
3. Call `analyzeBOMWithAI` for summary/explanation
4. Persist upload, items, and analysis into Postgres
5. Return structured JSON for UI consumption

## Vercel Deployment Notes

1. Create a Neon Postgres database.
2. Copy connection string into `DATABASE_URL`.
3. Add all required env vars in Vercel Project Settings.
4. Run Prisma migration before/at deploy (`prisma migrate deploy`).
5. Deploy Next.js app to Vercel.

### Important

- Keep all provider keys server-side only.
- Do not import `src/lib/ai/*` provider files into client components.
- Use `/api/ai/bom-analysis` as the only UI-facing entrypoint for BOM AI analysis.
