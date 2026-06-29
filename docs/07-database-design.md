# 07 — Database Design

Postgres (Supabase). All tables carry `user_id` + RLS (`auth.uid() = user_id`) for future multi-user.

## Tables
### profiles
`id (uuid pk = auth.uid), display_name, reminder_time, theme, timezone, created_at`

### goals
`id, user_id, name, category(swe|fitness|business|finance|ssc|content), target_per_week, active, created_at`

### diary_entries
`id, user_id, entry_date (date, unique per user), swe_hours numeric, topics text, work_done text, sleep_hours numeric, exercised bool, workout_type text, bath bool, meditated bool, meals text, went_well text, improve text, notes text, created_at, updated_at`

### checklist_templates
`id, user_id, name, items jsonb, created_at`

### checklist_instances
`id, user_id, template_id, date, items jsonb (label,done), completion_pct, created_at`

### feelings
`id, user_id, date, mood int(1-10), motivation int, stress int, gratitude text, note text, created_at`

### overthoughts
`id, user_id, category(work|future|health|money), intensity int, content text, resolved bool, created_at`

### entry_tags
`id, user_id, diary_id, tag text` — secondary goals as tags.

### ai_reviews
`id, user_id, week_start, strengths jsonb, weaknesses jsonb, patterns jsonb, action text, created_at`

## Indexes
`diary_entries(user_id, entry_date)`, `feelings(user_id,date)`, `overthoughts(user_id,created_at)`.

## Notes
- jsonb keeps checklist items flexible. - One diary row/day enforced by unique constraint. - Migrations via Supabase SQL.
