# 02 — Product Requirements Document (PRD)

## 1. Summary
Personal OS is a single-user web app for daily logging, habit/checklist tracking, reflection (feelings + overthinking), analytics, and a weekly AI review. Optimized for sub-60-second daily use and streak-driven consistency.

## 2. Problem
User abandons trackers after ~1 week. Cause: friction + no feedback loop. Goals are scattered across too many ambitions.

## 3. Solution
- Ultra-fast daily log (pre-filled defaults, tap-to-toggle).
- Streaks + reminders to fight drop-off.
- Quick capture for feelings/overthinking (under 20s).
- Analytics that show only what matters (SWE hours, workout streak, sleep, mood).
- Weekly AI review: strengths, weaknesses, patterns, ONE action.

## 4. Target user
Just Amit. No multi-user, no sharing.

## 5. v1 scope (must-have)
1. Auth (single user, email magic link).
2. Daily Diary (structured, ≤60s).
3. Checklists (CRUD + reusable templates + daily instance).
4. Feelings quick-capture. 5. Overthinking quick-capture.
6. Streaks + reminders. 7. Analytics dashboard.
8. Weekly AI review (free LLM).

## 6. v2 (later)
Tag-based modules (business/finance/SSC/content), trend forecasting, goal OKRs, export, PWA offline.

## 7. Explicit non-scope
Native app, social, payments, team, deep finance integrations.

## 8. Key constraints
- Free hosting + free AI tier.
- ≤60s daily log. Mobile + desktop responsive.

## 9. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Abandonment | Streaks, reminders, defaults, tiny forms |
| Scope creep | Secondary goals = tags, hard v1 cutoff |
| AI cost | Weekly batch only, Gemini free tier |
| Overthinking forms too heavy | One textbox + tag, analyze later |

## 10. Success criteria
80%+ days logged 3 months; up-trending SWE+fitness; 1 acted insight/month.
