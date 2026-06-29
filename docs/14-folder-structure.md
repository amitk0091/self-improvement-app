# 14 — Folder Structure

```
selfimprovement/
├─ app/
│  ├─ (auth)/login/
│  ├─ today/            # daily diary
│  ├─ checklists/
│  ├─ feelings/
│  ├─ overthinking/
│  ├─ analytics/
│  ├─ ai-review/
│  ├─ settings/
│  └─ api/              # route handlers (diary, checklists, feelings, ai...)
├─ features/
│  ├─ diary/ checklists/ feelings/ overthinking/ analytics/ ai/
│     ├─ components/ queries.ts schema.ts
├─ components/ui/       # shadcn
├─ lib/ supabase.ts ai.ts utils.ts
├─ types/ db.ts
├─ public/ manifest.json
├─ supabase/ migrations/
└─ docs/
```
Feature-first: each feature owns its UI, queries, Zod schema. Shared infra in `lib`.
