# SporTech Revenue Simulator

Interactive web app for sports clubs to simulate their revenue potential on the SporTech platform.

Built with Next.js 14, TypeScript, Tailwind CSS, Recharts, Supabase.

## Setup

```bash
cp .env.example .env.local
# Fill in Supabase credentials and admin password
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `ADMIN_PASSWORD` | Admin panel password |
| `NEXT_PUBLIC_SITE_URL` | Deployed URL (e.g. https://sportech-simulator.vercel.app) |

## Database

Run `supabase/migrations/001_leads.sql` in your Supabase SQL editor to create the tables.

## Admin

Visit `/admin` and enter `ADMIN_PASSWORD` to access leads and analytics.

## Deploy

Import this repository in [Vercel](https://vercel.com/new) and add the environment variables above.
