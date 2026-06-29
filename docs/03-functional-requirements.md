# 03 — Functional Requirements

## FR-1 Auth
- Single-user email magic link (Supabase). RLS locks all data to owner.

## FR-2 Daily Diary
- One entry/day. Quick mode (≤60s): toggles + sliders + numeric.
- Fields: SWE hours, topics learned, work done, sleep hrs, exercised (y/n), workout type, bath, meditate/worship, meals, went well, improve, notes.
- Pre-fill from yesterday; autosave; editable for past dates.

## FR-3 Checklists
- CRUD templates (morning, night, 1-day office, 2-day office, travel, weekend, packing, custom).
- Daily instance from template; tap to tick; progress %; reset daily.

## FR-4 Feelings Journal
- Quick: mood/motivation/stress sliders + gratitude + free text (<20s).

## FR-5 Overthinking Journal
- Capture: thought + category (work/future/health/money) + intensity. "Park it" CTA.

## FR-6 Streaks & Reminders
- Per-habit + global log streak. Daily reminder (push/email). Streak-recovery, no shame.

## FR-7 Analytics
- SWE hours/wk, workout streak, sleep avg, mood trend, checklist completion, goal heatmap.

## FR-8 Weekly AI Review
- Batch last 7 days → strengths, weaknesses, patterns, blockers, ONE action. Stored, viewable.

## FR-9 Tags (secondary goals)
- Tag entries: business/finance/SSC/content. Show in analytics, no dedicated modules v1.

## FR-10 Settings
- Goals/targets, reminder time, theme, data export (JSON).
