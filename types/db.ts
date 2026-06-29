// Database types for Personal OS

export type DiaryEntry = {
  id?: number
  entry_date: string
  swe_hours: number | null
  topics: string | null
  work_done: string | null
  sleep_hours: number | null
  exercised: boolean | null
  workout_type: string | null
  bath: boolean | null
  meditated: boolean | null
  meals: string | null
  went_well: string | null
  improve: string | null
  notes: string | null
}

export type Feeling = {
  id?: number
  date: string
  mood: number
  motivation: number
  stress: number
  gratitude: string | null
  note: string | null
}

export type Overthought = {
  id?: number
  category: 'work' | 'future' | 'health' | 'money'
  intensity: number
  content: string
  resolved: boolean
  created_at?: string
}

export type AIGeneratedReview = {
  id?: number
  user_id: string
  week_start: string
  strengths: string[]
  weaknesses: string[]
  patterns: string[]
  action: string
}