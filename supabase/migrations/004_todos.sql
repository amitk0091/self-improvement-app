-- Todos with deadlines, sorted by nearest deadline first.
-- Run AFTER 002_single_user.sql in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  deadline DATE,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "open_all" ON todos;
CREATE POLICY "open_all" ON todos FOR ALL USING (true) WITH CHECK (true);
