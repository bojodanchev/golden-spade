# Gotchas & Lessons Learned

## Next.js Route Groups
- **Route group `(dashboard)` doesn't create a URL segment**: Pages at `src/app/(dashboard)/contacts/page.tsx` serve at `/contacts`, NOT `/dashboard/contacts`. To get `/dashboard/*` URLs, pages must be at `src/app/(dashboard)/dashboard/contacts/page.tsx`.
- **Sidebar nav links use `/dashboard/*` paths**: If you add a new page, put it under `(dashboard)/dashboard/` directory.

## Prisma + Turso
- **Prisma schema URL stays `file:./dev.db`**: Even though production uses Turso, the schema `datasource.url` must be a valid `file:` URL for Prisma CLI to work. The Turso connection happens at runtime via the driver adapter in `db.ts`.
- **`prisma db push` can't target Turso directly**: The Prisma CLI only supports `file:` URLs for SQLite provider. Schema changes to Turso must be done by running `prisma db push` locally and then syncing, or using the Turso CLI.
- **Prisma 6 vs 7**: Project uses Prisma 6.19.2 (LTS). Prisma 7 has breaking ESM-only changes with adapter constructors. Don't upgrade without migration plan.
- **`@prisma/adapter-libsql` exports `PrismaLibSql`** (lowercase 'q'): Not `PrismaLibSQL` as some docs show.

## Vercel Deployment
- **`force-dynamic` on all DB pages**: Any server component page that queries the database MUST export `const dynamic = "force-dynamic"` to prevent Next.js from trying to prerender at build time (DB isn't available during Vercel build).
- **Turso env vars must not have trailing newlines**: Use `printf '%s'` instead of `echo` when setting Vercel env vars to avoid `%0A` suffix causing `Invalid URL` errors.
- **Build command**: `npx prisma generate && next build` in vercel.json. Do NOT include `prisma db push` in the build command for Turso.
- **`--webpack` flag**: Build uses `next build --webpack` because Turbopack had issues fetching Google Fonts during CI builds.

## shadcn/ui
- **shadcn v4 uses base-ui**: Button renders via `<ButtonPrimitive>` render props. Check component source before assuming API.
- **Don't edit `src/components/ui/` directly**: These are shadcn-generated. Customize via the theme in `globals.css`.

## NextAuth
- **Middleware export pattern**: `export { default } from "next-auth/middleware"` — don't import `updateSession` like Supabase.
- **Session user extensions**: Role and ID are added via JWT callbacks in `auth.ts`. Access as `(session.user as any).role`.

## useSearchParams
- **Suspense boundary required**: In Next.js 16, any client component using `useSearchParams()` must be wrapped in `<Suspense>` in the parent server component, or the build will fail with static generation errors.
