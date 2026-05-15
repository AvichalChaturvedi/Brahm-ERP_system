# BrahmForge — Fully Self-Hosted (Docker + Tailscale Funnel)

This repository is configured for **fully self-hosted public deployment** using only open-source components:

- Next.js app (Docker)
- PostgreSQL 16 (Docker)
- Prisma ORM
- MinIO (Docker, S3-compatible object storage)
- Redis 7 (Docker)
- Optional worker container
- Tailscale Serve/Funnel for secure exposure

No Vercel, Neon, Supabase, Firebase, or paid SaaS is required.

---

## Architecture

- **Public endpoint**: only `app` (port 3000) should be exposed via **Tailscale Funnel**
- **Private/internal services**:
  - `postgres` (DB)
  - `redis` (cache/queue)
  - `minio` object API (9000 internal)
  - `minio` console (9001 bound to `127.0.0.1` only)
- **Storage model**: file binaries in MinIO, metadata/path in PostgreSQL

---

## Security Controls Implemented

- Auth required for workspace/API flows (NextAuth credentials)
- Upload size limit: controlled by `MAX_UPLOAD_BYTES`
- Upload extension whitelist:
  - Gerber ZIP: `.zip`
  - BOM: `.csv`, `.xlsx`
  - CAD: `.step`, `.stp`
  - (plus existing gerber-like extensions already used by app)
- Uploaded filenames are sanitized and prefixed with generated timestamp keys
- No uploaded file execution
- Secrets stored only in env variables

---

## Prerequisites

- Docker + Docker Compose
- Node.js 20+ (for local non-container workflows)
- Tailscale installed on host machine/server

---

## Environment Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Set strong secrets before production use:

- `NEXTAUTH_SECRET`
- `MINIO_ROOT_PASSWORD`
- `S3_SECRET_KEY`

3. Keep `DATABASE_URL` pointing to compose postgres service:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/brahmforge"
```

---

## Start Full Stack (Local / Self-Hosted)

```bash
docker compose up -d --build
```

Services:
- app: http://localhost:3000
- MinIO console (local only): http://127.0.0.1:9001

---

## Prisma Schema Sync / Migration

If you are not using migration files yet:

```bash
docker compose exec app npx prisma db push
```

Optional seed:

```bash
docker compose exec app npm run prisma:seed
```

---

## MinIO Setup Notes

- The app auto-creates the bucket from env (`S3_BUCKET`) if missing.
- Objects are stored with generated keys under `programId/timestamp-safeFileName`.
- App serves files through `/api/files/[...path]` so MinIO API remains private.

---

## Public Deployment with Tailscale Funnel

On your host/server:

1. Install and login to Tailscale:

```bash
tailscale up
```

2. Start app stack:

```bash
docker compose up -d
```

3. Private tailnet access first:

```bash
tailscale serve --bg http://127.0.0.1:3000
```

4. Public HTTPS exposure:

```bash
tailscale funnel --bg 3000
```

### Important

- **Tailscale Funnel** = public access over HTTPS.
- **Tailscale Serve** = private tailnet-only access.
- Do **not** expose PostgreSQL, Redis, or MinIO admin publicly.

---

## Backup / Restore

### PostgreSQL backup

```bash
docker compose exec -T postgres pg_dump -U postgres brahmforge > backup.sql
```

### PostgreSQL restore

```bash
cat backup.sql | docker compose exec -T postgres psql -U postgres -d brahmforge
```

### MinIO data backup

Back up Docker volume `minio-data` (host-level volume backup strategy).

---

## What Was Kept / Removed / Rebuilt

### Kept
- Existing Next.js app routes/components
- Prisma data model approach
- NextAuth auth flow
- Design inspection pipeline that reads uploaded binaries via storage provider

### Removed
- Supabase storage provider integration
- Supabase dependency from package.json
- Cloud-host-specific deployment docs

### Rebuilt
- S3/MinIO storage provider now implemented (upload + read)
- Storage provider defaults to `s3`
- Docker stack expanded to app + postgres + minio + redis + worker
- Upload API hardened with file type + size checks
- File serving route updated for MinIO-backed object reads

---

## Remaining Limitations

- Worker is currently a heartbeat placeholder (no async job processor yet).
- Prisma repo currently relies on `db push` workflow unless formal migrations are added.
- MIME/content sniffing is extension-based; deeper binary signature validation can be added next.
