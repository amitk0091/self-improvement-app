# 08 — Backend Architecture

Serverless via Next.js Route Handlers + Supabase. No separate server.

## Layers
- **Edge/UI:** Next.js App Router (RSC + client islands).
- **API:** `/app/api/*` route handlers (REST). Validation with Zod.
- **Data:** Supabase client (RLS enforced) + typed schema.
- **Jobs:** Vercel Cron → weekly AI review.
- **AI:** Gemini free tier called from server route only (key never client-side).

## Key choices
- Direct Supabase from RSC for reads; route handlers for mutations needing validation/AI.
- RLS = security at DB layer; no manual user checks needed.
- Stateless; auth via Supabase session cookie.

## Modules
`features/diary`, `features/checklists`, `features/feelings`, `features/overthinking`, `features/analytics`, `features/ai`. Each: schema, queries, components.
