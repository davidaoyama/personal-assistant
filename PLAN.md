# Personal Assistant Dashboard — PLAN

## Context

A Personal Assistant Dashboard that aggregates three data sources into a unified feed:

- **AI News** — Top Hacker News stories filtered for AI/LLM/GPT keywords
- **Sports** — ESPN top headlines via RSS
- **Jobs** — Engineering roles scraped from Greenhouse (Vercel's board)

Data is stored in Turso (edge SQLite), fetched daily via Vercel Cron, and displayed
in a responsive Next.js Server Component page with category grouping and a manual
refresh button.

**Tech:** Next.js 16 (App Router, TypeScript), Turso (@libsql/client), Tailwind v4,
cheerio, rss-parser, Vercel Cron.

## Implementation Checklist

- [x] Create `lib/db.ts` — Turso client initialization
- [x] Create `lib/types.ts` — FeedItem TypeScript interface
- [x] Create `app/api/cron/route.ts` — Cron endpoint (auth, table creation, 3 scrapers, upsert)
- [x] Create `app/components/RefreshButton.tsx` — Client component with useTransition
- [x] Update `app/page.tsx` — Server Component (DB query, category grouping, grid layout, Server Action)
- [x] Update `app/layout.tsx` — Update metadata (title, description)
- [x] Create `vercel.json` — Cron schedule (daily 9 AM EST)
- [x] Edit README file to describe the purpose and use case of this project
- [x] Verify — Build passes, manual test of cron + UI + refresh + dedup