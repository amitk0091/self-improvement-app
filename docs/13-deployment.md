# 13 — Deployment

All free.

| Concern | Choice | Why |
|---|---|---|
| Hosting | **Vercel** | Native Next.js, free, auto HTTPS, cron |
| DB + Auth | **Supabase** | Free Postgres + auth + RLS |
| AI | **Gemini 1.5 Flash free tier** | $0, JSON output |
| Cron | **Vercel Cron** | weekly AI review |
| Reminders | Web Push (free) or email via Supabase | nudges |
| CI | **GitHub Actions** | lint/test/build on push |
| Backups | Supabase auto + JSON export | safety |

## Env
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `GEMINI_API_KEY` (server only).

## Pipeline
Push → GH Actions (lint+typecheck+test) → Vercel preview → merge main → prod. Supabase migrations via SQL/CLI.
