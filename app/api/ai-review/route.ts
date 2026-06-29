import { NextResponse } from 'next/server'
import { buildWeeklyReview, type AIReview } from '@/lib/ai'
import type { DiaryEntry, Feeling, Overthought } from '@/lib/store'

export const runtime = 'nodejs'

type Body = {
  weekStart: string
  diary: DiaryEntry[]
  feelings: Feeling[]
  overthoughts: Overthought[]
}

const SYSTEM = `You are a personal-growth coach. Analyze a week of self-tracking data and return STRICT JSON only:
{"strengths":["..."],"weaknesses":["..."],"patterns":["..."],"action":"one sentence"}
3-5 short, specific, data-grounded bullets per array. No markdown, no extra text.`

function buildPrompt(b: Body): string {
  return `${SYSTEM}\n\nWeek starting ${b.weekStart}.\nDiary: ${JSON.stringify(b.diary)}\nFeelings: ${JSON.stringify(b.feelings)}\nOverthoughts: ${JSON.stringify(b.overthoughts)}`
}

function parse(text: string, weekStart: string, source: string): AIReview {
  const match = text.match(/\{[\s\S]*\}/)
  const obj = JSON.parse(match ? match[0] : text)
  return {
    id: `${source}-${Date.now()}`,
    week_start: weekStart,
    strengths: obj.strengths ?? [],
    weaknesses: obj.weaknesses ?? [],
    patterns: obj.patterns ?? [],
    action: obj.action ?? '',
  }
}

async function tryGroq(b: Body): Promise<AIReview | null> {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildPrompt(b) }],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return parse(data.choices?.[0]?.message?.content ?? '', b.weekStart, 'groq')
  } catch {
    return null
  }
}

async function tryGemini(b: Body): Promise<AIReview | null> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(b) }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '', b.weekStart, 'gemini')
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const b = (await req.json()) as Body
  const review =
    (await tryGroq(b)) ||
    (await tryGemini(b)) ||
    buildWeeklyReview(b.weekStart, b.diary, b.feelings, b.overthoughts)
  return NextResponse.json(review)
}
