// Simple AI review service (placeholder)
export async function generateAIReview(userId: string, startOfWeek: string) {
  return {
    id: 'mock-id',
    user_id: userId,
    week_start: startOfWeek,
    strengths: [
      "Maintained consistent daily logging",
      "Improved workout routine"
    ],
    weaknesses: [
      "Sleep quality declined last few days",
      "Overthinking around work deadlines"
    ],
    patterns: [
      "SWE hours increase when using Pomodoro technique",
      "Mood improves after exercise"
    ],
    action: "Try a 7-day sleep tracking experiment"
  }
}

import type { DiaryEntry, Feeling, Overthought } from './store'

export type AIReview = {
  id: string
  week_start: string
  strengths: string[]
  weaknesses: string[]
  patterns: string[]
  action: string
}

// Calls the server route which uses a real model (Groq -> Gemini), falling back to heuristic.
export async function generateGenuineReview(
  weekStart: string,
  diary: DiaryEntry[],
  feelings: Feeling[],
  overthoughts: Overthought[]
): Promise<AIReview> {
  try {
    const res = await fetch('/api/ai-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekStart, diary, feelings, overthoughts }),
    })
    if (res.ok) return (await res.json()) as AIReview
  } catch {
    // fall through to local heuristic
  }
  return buildWeeklyReview(weekStart, diary, feelings, overthoughts)
}

const avg = (nums: number[]) =>
  nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0

// Heuristic weekly review computed from the user's own logged data.
export function buildWeeklyReview(
  weekStart: string,
  diary: DiaryEntry[],
  feelings: Feeling[],
  overthoughts: Overthought[]
): AIReview {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const patterns: string[] = []

  const swe = avg(diary.map((d) => d.swe_hours || 0))
  const sleep = avg(diary.map((d) => d.sleep_hours || 0))
  const workouts = diary.filter((d) => d.exercised).length
  const mood = avg(feelings.map((f) => f.mood))
  const stress = avg(feelings.map((f) => f.stress))

  if (swe >= 5) strengths.push(`Strong focus: ~${swe.toFixed(1)}h/day of deep work`)
  else weaknesses.push(`Low deep-work hours: ~${swe.toFixed(1)}h/day`)

  if (sleep >= 7) strengths.push('Healthy sleep averaging 7h+')
  else weaknesses.push(`Sleep below target: ~${sleep.toFixed(1)}h/night`)

  if (workouts >= 3) strengths.push(`${workouts} workout days this week`)
  else weaknesses.push(`Only ${workouts} workout days`)

  if (mood >= 6) patterns.push('Mood trending positive')
  if (stress >= 7) weaknesses.push('Stress levels running high')
  if (overthoughts.filter((o) => !o.resolved).length > 3)
    patterns.push('Several unresolved overthinking entries')

  const action =
    sleep < 7
      ? 'Set a fixed sleep window and protect 7+ hours for one week.'
      : swe < 5
        ? 'Block two distraction-free deep-work sessions daily.'
        : 'Keep the momentum — maintain your strongest routine.'

  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    week_start: weekStart,
    strengths: strengths.length ? strengths : ['Consistent daily logging'],
    weaknesses: weaknesses.length ? weaknesses : ['Nothing major flagged'],
    patterns: patterns.length ? patterns : ['Keep logging to reveal trends'],
    action,
  }
}