# Decision: Migrate from Supabase to Prisma + SQLite (Turso)
**Date**: 2026-03-18
**Status**: accepted

## Context
Project was initially planned with Supabase (PostgreSQL + Auth + RLS). User requested a simpler database since this is a demo project, without needing to set up external Supabase infrastructure.

## Decision
Switched to Prisma ORM + SQLite with:
- **Local dev**: File-based SQLite (`file:./dev.db`) — zero config
- **Production**: Turso cloud SQLite (`libsql://`) — persistent, serverless-compatible
- **Auth**: NextAuth v4 with credentials provider (email/password, JWT sessions)

## Alternatives Considered
- **Keep Supabase**: Too much infrastructure for a demo
- **Drizzle ORM + SQLite**: Lighter than Prisma but less ecosystem support
- **Vercel Postgres**: Requires Vercel-specific setup, overkill for demo

## Consequences
- No RLS — all authenticated users have full access (acceptable for 6-7 person team)
- No real-time subscriptions (was planned with Supabase)
- Simpler local development (just `npx prisma db push && npm run dev`)
- Turso free tier handles demo traffic easily
- Schema migrations via Prisma instead of raw SQL files
