# 11 — AI Architecture

Goal: weekly self-improvement insight from logs, on a free tier.

## Provider
Google Gemini 1.5 Flash (free tier) primary; OpenAI/Groq swappable behind one interface.

## Flow (weekly, Sunday cron)
1. Aggregate 7 days: SWE hrs, sleep, mood, stress, exercise, top overthinking categories, checklist %.
2. Build compact summary (numbers only — no raw private text where avoidable).
3. Prompt → strengths, weaknesses, 2 patterns, 1 blocker, ONE next action.
4. Store in `ai_reviews`. Show on AI tab.

## Prompt shape
System: "You are a pragmatic coach. Be specific, max 1 action." User: JSON weekly stats. Output: strict JSON.

## Privacy & cost
- Batch weekly only → tiny token use. - Key server-side. - Send summary, not full journals. - Fallback rule-based insights if quota hit (e.g. "sleep<6 on 4 days → fix sleep").
