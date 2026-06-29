# 04 — Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Daily log saves in <500ms; dashboard <1.5s. |
| Friction | Full daily log ≤60s; quick mood ≤20s. |
| Availability | Free tier; best-effort, no SLA. |
| Responsiveness | Mobile + desktop, PWA-installable. |
| Cost | $0 hosting + free AI tier; alerts before paid. |
| Security | RLS, magic link, no plaintext secrets, HTTPS. |
| Privacy | Single user; AI sends only anonymized 7-day summary. |
| Maintainability | TS strict, modular features, typed DB, tests on core. |
| Accessibility | Keyboard nav, contrast, large tap targets. |
| Reliability | Autosave, optimistic UI, JSON export backup. |
| Scalability | Single user now; schema ready for multi-user later. |
| Observability | Vercel logs + Supabase logs; simple error toasts. |
