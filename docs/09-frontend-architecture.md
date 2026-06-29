# 09 — Frontend Architecture

Next.js 14 App Router, TypeScript strict, Tailwind, shadcn/ui, TanStack Query, Zustand (light), Recharts.

## Structure
- Server Components for data fetch; Client Components for forms/sliders.
- Optimistic updates + autosave for ≤60s log.
- Bottom tabs (mobile) / sidebar (desktop). PWA manifest.

## Key UX
- Today screen = default; defaults pre-filled from yesterday.
- Sliders + toggles over text. One-line reflection fields.
- Streak badge in header; reminders via web push.
- Dark mode default.

## State
Server state via TanStack Query; ephemeral UI via Zustand; forms via react-hook-form + Zod.
