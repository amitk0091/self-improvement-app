-- Add milestones to goals for progress tracking
ALTER TABLE goals ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb;
