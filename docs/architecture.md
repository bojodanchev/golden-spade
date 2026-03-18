# Architecture

## Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.1.7 (App Router, TypeScript strict) |
| Database | Prisma 6.19.2 + SQLite (Turso cloud in production) |
| Auth | NextAuth v4 with credentials provider (JWT sessions) |
| UI | Tailwind CSS v4 + shadcn/ui (base-ui) |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Email | Resend (invitations, follow-ups) |
| QR Codes | qrcode npm package |
| Icons | lucide-react |
| Deployment | Vercel (auto-deploy on push to main) |

## Directory Structure
```
golden-spade/
├── prisma/
│   ├── schema.prisma          # 16 models (User, Company, Contact, Deal, Event, etc.)
│   ├── seed.ts                # Comprehensive seed: 30 companies, 43 contacts, 13 deals, gala event
│   └── dev.db                 # Local SQLite database (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root: fonts (Montserrat, Open Sans, Roboto Mono), SessionProvider, Toaster
│   │   ├── page.tsx           # Redirect to /dashboard or /login
│   │   ├── (auth)/login/      # Email/password login
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Sidebar + topbar (client component)
│   │   │   └── dashboard/     # ← NOTE: nested under dashboard/ for correct URL mapping
│   │   │       ├── page.tsx           # Dashboard KPIs, charts, activity
│   │   │       ├── contacts/          # CRM contacts module
│   │   │       ├── companies/         # CRM companies module
│   │   │       ├── pipeline/          # Kanban board + deals
│   │   │       ├── events/            # Events, guests, check-in
│   │   │       └── settings/          # Lead scoring, profile
│   │   ├── rsvp/[token]/      # Public RSVP page (no auth required)
│   │   └── api/
│   │       ├── auth/[...nextauth]/  # NextAuth API route
│   │       └── cron/follow-ups/     # Vercel cron: mark overdue follow-ups
│   ├── actions/               # Server Actions (contacts, companies, deals, events, guests, etc.)
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (27 components)
│   │   ├── shared/            # page-header, search-input, empty-state, confirm-dialog
│   │   ├── contacts/          # contact-form, interaction-timeline, filters
│   │   ├── companies/         # company-form, company-contacts, filters
│   │   ├── pipeline/          # kanban-board, kanban-column, deal-card, deal-form
│   │   ├── events/            # event-form, guest-list, guest-form, rsvp-tracker, check-in
│   │   └── dashboard/         # stats-cards, pipeline-summary, recent-activity, upcoming-followups
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton (Turso adapter in prod, file SQLite in dev)
│   │   ├── auth.ts            # NextAuth config (credentials provider, JWT callbacks)
│   │   ├── auth-helpers.ts    # getSession(), getCurrentUser() helpers
│   │   ├── utils.ts           # cn(), formatCurrency(), formatDate(), timeAgo()
│   │   └── constants.ts       # Stage, tier, category, region, company type configs with colors/icons
│   └── types/
│       ├── crm.ts             # Prisma re-exports + extended join types + enum constants
│       └── events.ts          # Event types + EventStats, RsvpFormData
├── middleware.ts               # NextAuth middleware (protects /dashboard/*)
├── vercel.json                 # Build command + cron config
└── .env                        # TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, NEXTAUTH_SECRET (gitignored)
```

## Key Patterns & Conventions
- **Route groups**: `(dashboard)` groups pages sharing the sidebar layout. Pages are nested under `(dashboard)/dashboard/` to produce `/dashboard/*` URLs.
- **Server Actions**: All data mutations in `src/actions/`. Each module has its own file. Use `"use server"` directive.
- **Server Components by default**: Pages are server components. Add `"use client"` only when needed (forms, interactive components).
- **`force-dynamic` export**: All server-rendered pages that query DB at request time export `const dynamic = "force-dynamic"` to prevent build-time prerendering.
- **Prisma singleton**: Import `db` from `@/lib/db`. Never instantiate PrismaClient directly.
- **Auth flow**: `getSession()` / `getCurrentUser()` from `@/lib/auth-helpers` for server components. `signIn` / `signOut` from `next-auth/react` for client components.
- **Brand colors**: Primary deep blue `#1a365d`, secondary gold `#d69e2e`. Use `bg-brand-primary`, `text-brand-secondary` utilities.
- **Fonts**: `font-heading` (Montserrat), `font-sans` (Open Sans), `font-mono` (Roboto Mono for numbers).

## Important Files
| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Prisma client with Turso adapter logic |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/app/(dashboard)/layout.tsx` | Sidebar navigation, topbar, mobile menu |
| `prisma/schema.prisma` | All 16 database models |
| `prisma/seed.ts` | Comprehensive demo data (real gambling industry execs) |
| `src/lib/constants.ts` | All enum configs with labels, colors, icons |
| `vercel.json` | Vercel build command and cron schedule |
