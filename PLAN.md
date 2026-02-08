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

---

## Phase 2: Dashboard Enhancement — 15 Items, Detail Pages, Better AI Sources, About Page

### Context
Expand to 15 items per category, improve AI news quality (replace HN with dedicated RSS feeds), add detail pages for each item, and create an About page.

### Implementation Checklist

- [ ] **Update DB schema & types** — Add `description` field to `FeedItem` interface and `ScrapedItem`. Add `ALTER TABLE` migration + update `CREATE TABLE` and `INSERT` in cron route.
- [ ] **Overhaul AI News fetching** — Replace HN API with TechCrunch AI, The Verge AI, and Ars Technica RSS feeds. Collect 15 items with descriptions from `contentSnippet`.
- [ ] **Update Sports fetching** — Increase limit from 5 to 15 items. Extract description from RSS `contentSnippet`.
- [ ] **Overhaul Jobs fetching** — Expand to multiple Greenhouse boards (Vercel, Anthropic, OpenAI, Stripe). Filter for SWE/engineering roles, cap at 15, include company name in title.
- [ ] **Update main page** — Add `description` to SQL query. Change card links from external URLs to `/item/[id]` detail pages using `Link`. Add description preview with `line-clamp-2`. Add nav link to About page.
- [ ] **Create detail page** (`app/item/[id]/page.tsx`) — Server Component with DB lookup, `notFound()` handling, category badge, description, "Visit Source" button, back link, `generateMetadata`.
- [ ] **Create About page** (`app/about/page.tsx`) — Static page explaining data sources, cron schedule, and tech stack.
- [ ] **Add navigation to layout** — Minimal nav bar with Home and About links in `app/layout.tsx`.
- [ ] **Verify** — Build passes, lint passes, ~15 items per category with descriptions, detail page works, about page works, 404 for invalid IDs, dedup still works.