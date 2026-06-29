-- Single-user mode: no login. All data belongs to one fixed account.
-- Run this AFTER 001_initial_schema.sql in the Supabase SQL editor.

-- 1) Detach profiles from auth.users so we can seed a fixed user without signup
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS swe_target INTEGER DEFAULT 6;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workout_target INTEGER DEFAULT 5;

-- 2) Seed the single shared user the app uses (USER_ID in lib/store.ts)
INSERT INTO profiles (id, display_name, reminder_time, theme, timezone, swe_target, workout_target)
VALUES ('00000000-0000-0000-0000-000000000001', 'You', '21:00', 'dark', 'UTC', 6, 5)
ON CONFLICT (id) DO NOTHING;

-- 3) Open access for the anon key (personal single-user app, no auth.uid()).
--    Replace the auth-based policies with permissive ones.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','goals','diary_entries','checklist_templates',
    'checklist_instances','feelings','overthoughts'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "open_all" ON %I;', t);
    EXECUTE format('CREATE POLICY "open_all" ON %I FOR ALL USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;
