# Project: Golden Spades

CRM & Event Management platform for СОХИДБ (Bulgaria's gaming industry association). Manages contacts, companies, deal pipeline, events/invitations. (Next.js 16, Prisma + Turso SQLite, NextAuth, shadcn/ui)

## Quick Start
```bash
npm install
npx prisma generate && npx prisma db push && npx prisma db seed
npm run dev    # http://localhost:3000 — login: admin@goldenspades.com / admin123
```

## Key Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (uses --webpack) |
| `npx prisma generate` | Regenerate client after schema changes |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed demo data (30 companies, 43 contacts, deals, gala event) |
| `npx prisma studio` | DB GUI |

## Project Structure
```
src/app/(dashboard)/dashboard/   # All CRM pages (contacts, companies, pipeline, events, settings)
src/app/(auth)/login/            # Login page
src/app/rsvp/[token]/            # Public RSVP (no auth)
src/actions/                     # Server Actions (all data mutations)
src/components/{ui,shared,contacts,companies,pipeline,events,dashboard}/
src/lib/db.ts                    # Prisma singleton (Turso in prod, file SQLite in dev)
src/lib/auth.ts                  # NextAuth config
prisma/schema.prisma             # 16 models
prisma/seed.ts                   # Real gambling industry demo data
```

## Architecture Pointers
> Deep dive: [docs/architecture.md](docs/architecture.md)

- **Route group trap**: `(dashboard)` doesn't create URL segment. Pages go in `(dashboard)/dashboard/` for `/dashboard/*` URLs
- **DB access**: Always import `db` from `@/lib/db`, never instantiate PrismaClient
- **Auth**: `getSession()` from `@/lib/auth-helpers` (server), `signIn`/`signOut` from `next-auth/react` (client)
- **All DB pages**: Must export `const dynamic = "force-dynamic"` to prevent build-time prerendering
- **Server Actions**: `"use server"` files in `src/actions/`. One file per module.

## Environment
> Details: [docs/environment.md](docs/environment.md)

Requires: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (prod), `DATABASE_URL` (Prisma CLI), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## Brand
- Primary: Deep Blue `#1a365d` | Secondary: Gold `#d69e2e`
- Fonts: `font-heading` (Montserrat), `font-sans` (Open Sans), `font-mono` (Roboto Mono)
- shadcn/ui components in `src/components/ui/` — don't edit directly

## Rules & Style
- Use `cn()` from `@/lib/utils` for conditional classes
- Use `formatCurrency()`, `formatDate()`, `timeAgo()` from `@/lib/utils`
- Stage/tier/category configs with labels+colors in `src/lib/constants.ts`
- Shared components (page-header, search-input, empty-state, confirm-dialog) in `src/components/shared/`
- Types: import from `@/types/crm` and `@/types/events` (re-export Prisma types)

## Gotchas (Top 5)
> Full list: [docs/gotchas.md](docs/gotchas.md)

- Pages must be under `(dashboard)/dashboard/` not `(dashboard)/` for correct `/dashboard/*` URLs
- Prisma schema URL stays `file:./dev.db` even for Turso — adapter handles runtime connection
- `useSearchParams()` needs `<Suspense>` wrapper in Next.js 16
- Vercel env vars: use `printf` not `echo` to avoid trailing newline breaking Turso URL
- Build uses `--webpack` flag (Turbopack has Google Fonts fetch issues in CI)

## Recent Decisions
> History: [docs/decisions/](docs/decisions/)

- [2026-03-18] Supabase → Prisma + SQLite (Turso) — simpler for demo, zero infrastructure locally

## Active Context
- Production: https://golden-spade.vercel.app (auto-deploys from main)
- Repo: https://github.com/bojodanchev/golden-spade
- DB: Turso cloud SQLite (golden-spade-bojodanchev.aws-eu-west-1.turso.io)
- Demo data: 30 real Balkan gambling companies, 43 C-level execs, 13 pipeline deals, gala dinner Nov 2026

## Discovery Log (Recent)
> Full log: [docs/discovery-log.md](docs/discovery-log.md)

- [2026-03-18] Route 404s fixed — route group URL mapping required nested `dashboard/` directory
- [2026-03-18] Turso env var must use `libsql://` protocol, no trailing newline
- [2026-03-18] Prisma 7 incompatible — staying on 6.19.2 LTS
