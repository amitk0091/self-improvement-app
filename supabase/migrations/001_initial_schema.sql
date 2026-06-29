-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  reminder_time TIME,
  theme TEXT DEFAULT 'dark',
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('swe', 'fitness', 'business', 'finance', 'ssc', 'content')),
  target_per_week INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies for goals
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create diary_entries table
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  swe_hours NUMERIC(5,2),
  topics TEXT,
  work_done TEXT,
  sleep_hours NUMERIC(4,2),
  exercised BOOLEAN DEFAULT FALSE,
  workout_type TEXT,
  bath BOOLEAN DEFAULT FALSE,
  meditated BOOLEAN DEFAULT FALSE,
  meals TEXT,
  went_well TEXT,
  improve TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Enable RLS on diary_entries
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for diary_entries
CREATE POLICY "Users can view their own diary entries" ON diary_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diary entries" ON diary_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" ON diary_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" ON diary_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create checklist_templates table
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on checklist_templates
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_templates
CREATE POLICY "Users can view their own checklist templates" ON checklist_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist templates" ON checklist_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist templates" ON checklist_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist templates" ON checklist_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Create checklist_instances table
CREATE TABLE checklist_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES checklist_templates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  items JSONB,
  completion_pct INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_id, date)
);

-- Enable RLS on checklist_instances
ALTER TABLE checklist_instances ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_instances
CREATE POLICY "Users can view their own checklist instances" ON checklist_instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist instances" ON checklist_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist instances" ON checklist_instances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist instances" ON checklist_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Create feelings table
CREATE TABLE feelings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  motivation INTEGER CHECK (motivation BETWEEN 1 AND 10),
  stress INTEGER CHECK (stress BETWEEN 1 AND 10),
  gratitude TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS on feelings
ALTER TABLE feelings ENABLE ROW LEVEL SECURITY;

-- Create policies for feelings
CREATE POLICY "Users can view their own feelings" ON feelings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feelings" ON feelings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feelings" ON feelings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feelings" ON feelings
  FOR DELETE USING (auth.uid() = user_id);

-- Create overthoughts table
CREATE TABLE overthoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('work', 'future', 'health', 'money')),
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on overthoughts
ALTER TABLE overthoughts ENABLE ROW LEVEL SECURITY;

-- Create policies for overthoughts
CREATE POLICY "Users can view their own overthoughts" ON overthoughts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own overthoughts" ON overthoughts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own overthoughts" ON overthoughts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own overthoughts" ON overthoughts
  FOR DELETE USING (auth.uid() = user_id);

-- Create entry_tags table
CREATE TABLE entry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  diary_id UUID REFERENCES diary_entries(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on entry_tags
ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for entry_tags
CREATE POLICY "Users can view their own entry tags" ON entry_tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entry tags" ON entry_tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entry tags" ON entry_tags
  FOR DELETE USING (auth.uid() = user_id);

-- Create ai_reviews table
CREATE TABLE ai_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  strengths JSONB,
  weaknesses JSONB,
  patterns JSONB,
  action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS on ai_reviews
ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_reviews
CREATE POLICY "Users can view their own AI reviews" ON ai_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI reviews" ON ai_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI reviews" ON ai_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI reviews" ON ai_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_diary_entries_user_date ON diary_entries(user_id, entry_date);
CREATE INDEX idx_feelings_user_date ON feelings(user_id, date);
CREATE INDEX idx_overthoughts_user_created_at ON overthoughts(user_id, created_at);