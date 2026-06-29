# 12 — Security & Authentication

- **Auth:** Supabase email magic link (single user). Session cookie.
- **Authorization:** Postgres RLS — every table `user_id = auth.uid()`. No data leaks even if API misused.
- **Secrets:** AI + service keys in Vercel env; never shipped to client.
- **Transport:** HTTPS only (Vercel default).
- **Input:** Zod validation on all mutations; parameterized queries (Supabase).
- **AI privacy:** only aggregated stats sent; journals stay in DB.
- **Backups:** weekly JSON export; Supabase auto-backups.
- **OWASP:** no SQLi (ORM), XSS escaped (React), CSRF via same-site cookies, rate-limit AI route.
