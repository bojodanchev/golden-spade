# Golden Spades - CRM & Event Management

## Project Overview
Golden Spades is a premium CRM and event management platform for a poker club. It manages contacts, companies, deal pipelines, events/tournaments, and member invitations with QR code support.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Resend
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **QR Codes**: qrcode
- **Icons**: lucide-react

## File Structure
```
src/
  app/
    layout.tsx          # Root layout (fonts, providers)
    page.tsx            # Root redirect (→ /dashboard or /login)
    (auth)/
      login/page.tsx    # Login page
    (dashboard)/
      layout.tsx        # Sidebar + topbar layout
      page.tsx          # Dashboard home
      contacts/         # CRM contacts module
      companies/        # CRM companies module
      pipeline/         # Deal pipeline (Kanban)
      events/           # Events & invitations
      settings/         # User settings
  components/
    ui/                 # shadcn/ui components
    shared/             # Shared app components (search-input, empty-state, etc.)
  lib/
    supabase/           # Supabase client configs (client.ts, server.ts, middleware.ts)
    utils.ts            # Utility functions (cn, formatCurrency, formatDate, etc.)
    constants.ts        # Stage, tier, category, region configs
middleware.ts           # Route protection middleware
```

## Brand Design Tokens
- **Primary**: Deep Blue #1a365d
- **Secondary**: Gold #d69e2e
- **Text**: #2d3748
- **Background**: #f7fafc
- **Fonts**: Montserrat (headings), Open Sans (body), Roboto Mono (numbers/code)

## Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
```

## Key Conventions
- Use `createClient()` from `@/lib/supabase/server` for Server Components
- Use `createClient()` from `@/lib/supabase/client` for Client Components
- Use `font-heading` class for headings (Montserrat)
- Use `font-mono` class for numeric data (Roboto Mono)
- Use brand color utilities: `bg-brand-primary`, `text-brand-secondary`, etc.
- Shared components are in `src/components/shared/`
- UI primitives are in `src/components/ui/` (shadcn - do not edit directly)
