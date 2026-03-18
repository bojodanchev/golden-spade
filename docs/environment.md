# Environment

## Prerequisites
- Node.js 18+
- npm
- Turso CLI (`brew install tursodatabase/tap/turso`) — only for DB management

## Setup
```bash
git clone https://github.com/bojodanchev/golden-spade.git
cd golden-spade
npm install
cp .env.example .env        # Then fill in values
npx prisma generate
npx prisma db push           # Creates local SQLite tables
npx prisma db seed           # Seeds demo data
npm run dev                  # http://localhost:3000
```

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build (uses --webpack flag) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db seed` | Run seed script |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |

## Environment Variables
| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | Turso libsql:// URL (production) or omit for local file SQLite |
| `TURSO_AUTH_TOKEN` | Turso auth token (production only) |
| `DATABASE_URL` | Used by Prisma CLI. Set to `file:./dev.db` locally |
| `NEXTAUTH_SECRET` | JWT signing secret for NextAuth |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 local, https://golden-spade.vercel.app prod) |
| `RESEND_API_KEY` | Resend API key for email sending (optional for demo) |

## External Services
| Service | Purpose | Dashboard |
|---------|---------|-----------|
| Turso | Cloud SQLite database | https://turso.tech/app |
| Vercel | Hosting + serverless + cron | https://vercel.com/dashboard |
| Resend | Transactional email (invitations) | https://resend.com |
| GitHub | Source code | https://github.com/bojodanchev/golden-spade |

## Demo Credentials
- **Email**: admin@goldenspades.com
- **Password**: admin123
