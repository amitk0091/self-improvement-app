# 10 — API Design

REST via Next.js route handlers. All require auth session; RLS enforces ownership.

| Method | Path | Purpose |
|---|---|---|
| GET/PUT | /api/diary/[date] | get/upsert daily entry |
| GET | /api/diary?from&to | range for analytics |
| GET/POST | /api/checklists/templates | list/create template |
| PUT/DELETE | /api/checklists/templates/[id] | edit/delete |
| POST | /api/checklists/instance | start today's instance |
| PATCH | /api/checklists/instance/[id] | tick items |
| POST | /api/feelings | quick mood |
| POST | /api/overthoughts | park thought |
| GET | /api/analytics/summary | dashboard metrics |
| GET | /api/ai/review/latest | weekly review |
| POST | /api/ai/review/run | trigger (cron) |

Validation: Zod. Errors: `{error}` + status. Responses: typed JSON.
