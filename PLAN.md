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
HeroUI, Framer Motion, cheerio, rss-parser, Vercel Cron.

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

- [x] **Update DB schema & types** — Add `description` field to `FeedItem` interface and `ScrapedItem`. Add `ALTER TABLE` migration + update `CREATE TABLE` and `INSERT` in cron route.
- [x] **Overhaul AI News fetching** — Replace HN API with TechCrunch AI, The Verge AI, and Ars Technica RSS feeds. Collect 15 items with descriptions from `contentSnippet`.
- [x] **Update Sports fetching** — Increase limit from 5 to 15 items. Extract description from RSS `contentSnippet`.
- [x] **Overhaul Jobs fetching** — Expand to multiple Greenhouse boards (Vercel, Anthropic, OpenAI, Stripe). Filter for SWE/engineering roles, cap at 15, include company name in title.
- [x] **Update main page** — Add `description` to SQL query. Change card links from external URLs to `/item/[id]` detail pages using `Link`. Add description preview with `line-clamp-2`. Add nav link to About page.
- [x] **Create detail page** (`app/item/[id]/page.tsx`) — Server Component with DB lookup, `notFound()` handling, category badge, description, "Visit Source" button, back link, `generateMetadata`.
- [x] **Create About page** (`app/about/page.tsx`) — Static page explaining data sources, cron schedule, and tech stack.
- [x] **Add navigation to layout** — Minimal nav bar with Home and About links in `app/layout.tsx`.
- [x] **Verify** — Build passes, lint passes, ~15 items per category with descriptions, detail page works, about page works, 404 for invalid IDs, dedup still works.

---

## Phase 3: HeroUI Integration — Dark Theme & Polished Components

### Context
Replaced raw Tailwind markup with HeroUI component library for a polished dark-mode UI. HeroUI is built on Tailwind CSS + React Aria with built-in accessibility and theming.

### Implementation Checklist

- [x] **Install dependencies** — `@heroui/react` and `framer-motion`
- [x] **Create `hero.ts`** — HeroUI Tailwind plugin config at project root
- [x] **Update `app/globals.css`** — Added `@plugin '../hero.ts'`, `@source` for HeroUI theme files, `@custom-variant dark`. Removed conflicting custom `--background`/`--foreground` CSS variables that were overriding HeroUI's theme system.
- [x] **Create `app/providers.tsx`** — "use client" wrapper with `<HeroUIProvider>` (required for HeroUI context)
- [x] **Update `app/layout.tsx`** — Wrapped children in `<Providers>`, added `className="dark"` on `<html>` and `bg-background text-foreground dark` on `<body>` to enforce HeroUI dark theme
- [x] **Create `app/components/FeedCard.tsx`** — "use client" component using HeroUI `<Card>` with `bg-content1`, `border-default-200/50`, category-colored date text. Separated as client component to avoid SSR `createContext` error with Next.js 16.
- [x] **Create `app/components/ItemDetail.tsx`** — "use client" component using HeroUI `<Card>`, `<Chip>` (category badge), `<Button>` (Visit Source). Same SSR workaround.
- [x] **Update `app/components/RefreshButton.tsx`** — HeroUI `<Button variant="bordered" radius="full">` with `isLoading` state
- [x] **Update `app/page.tsx`** — Uses `FeedCard` client component, wider `max-w-6xl` layout, source domain + date in card footer, HeroUI theme color tokens (`text-default-400`, `text-foreground`)
- [x] **Update `app/item/[id]/page.tsx`** — Uses `ItemDetail` client component, HeroUI theme colors throughout
- [x] **Update `app/about/page.tsx`** — Migrated to HeroUI color tokens, added "HeroUI" to tech stack pills
- [x] **Verify** — Lint 0 errors, build passes, all routes render correctly

### Key Architecture Decisions
- **Client component wrappers**: HeroUI components use React context (`createContext`) which fails during SSR in Next.js 16. Solution: `FeedCard` and `ItemDetail` are "use client" components that wrap HeroUI, while page-level Server Components handle data fetching and pass serializable props down.
- **Theme ownership**: Removed all custom CSS color variables and let HeroUI's plugin fully own the dark theme palette via its `heroui()` Tailwind plugin.
- **Color mapping**: Category colors mapped to HeroUI semantic colors — AI News → `secondary` (violet), Sports → `success` (green), Jobs → `primary` (blue).
