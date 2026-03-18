# Discovery Log

Reverse-chronological. Most recent first.

## [2026-03-18] Route 404s on Vercel — route group URL mapping
**Context**: All feature pages (contacts, companies, pipeline, events) returned 404 on Vercel production while dashboard worked.
**Learnings**:
- Next.js route groups like `(dashboard)` don't create URL segments
- Pages at `src/app/(dashboard)/contacts/` serve at `/contacts`, not `/dashboard/contacts`
- Fix: moved all pages under `src/app/(dashboard)/dashboard/` to match sidebar links
**Files touched**: All page.tsx files under `(dashboard)/`

## [2026-03-18] Vercel deployment failures — Turso env var format
**Context**: Deployment crashed with `TypeError: Invalid URL` during prerender.
**Learnings**:
- `TURSO_DATABASE_URL` was set with `https://` instead of `libsql://` protocol
- Env var also had trailing newline (`%0A`) from using `echo` instead of `printf`
- Server pages querying DB need `export const dynamic = "force-dynamic"` to skip prerendering
**Files touched**: Vercel env vars, all server page files

## [2026-03-18] Prisma 7 compatibility issues
**Context**: Initially tried Prisma 7.5.0 but encountered breaking changes.
**Learnings**:
- Prisma 7 requires ESM-only generated client with adapter-based constructors
- Incompatible with `tsx` for seeding and some Next.js build configurations
- Downgraded to Prisma 6.19.2 (LTS) which works seamlessly
**Files touched**: package.json, prisma/schema.prisma

## [2026-03-18] Initial project setup with multi-agent parallel build
**Context**: Built entire CRM from scratch using 5 parallel agents.
**Learnings**:
- Foundation must complete before feature agents (deps, layout, shared components)
- Database migrations can run in parallel with foundation setup
- 5 feature agents (contacts, companies, pipeline, events, dashboard) ran simultaneously without conflicts since they write to different files
- Total build time: ~20 minutes for full CRM with 85+ files
