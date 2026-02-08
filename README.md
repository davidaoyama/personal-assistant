# Personal Assistant Dashboard

A feed aggregator that pulls AI news, sports headlines, and job postings into a single dashboard. Data is fetched daily via a Vercel Cron job, stored in Turso (edge SQLite), and displayed in a responsive Next.js app.

## Data Sources

- **AI News** — Hacker News top stories filtered for AI/LLM/GPT keywords
- **Sports** — ESPN top headlines via RSS
- **Jobs** — Engineering roles scraped from Vercel's Greenhouse board

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** Turso (LibSQL)
- **Styling:** Tailwind CSS v4
- **Scraping:** cheerio + rss-parser
- **Hosting:** Vercel (with Vercel Cron)

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your credentials:

```
TURSO_DATABASE_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
CRON_SECRET=your_secret
```

3. Run the dev server:

```bash
npm run dev
```

4. Trigger the cron endpoint to populate data:

```bash
curl -H "Authorization: Bearer your_secret" http://localhost:3000/api/cron
```

5. Visit [http://localhost:3000](http://localhost:3000) to see your feed.

## How It Works

- **`/api/cron`** — Fetches from all 3 sources, upserts into Turso (duplicates ignored via unique URL constraint). Protected by `CRON_SECRET`.
- **`/`** — Server Component that queries Turso and displays items grouped by category. Includes a "Refresh Feed" button that triggers a Server Action to re-fetch data.
- **Vercel Cron** — Configured in `vercel.json` to run daily at 9:00 AM EST.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add these environment variables in the Vercel dashboard under **Settings > Environment Variables**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `CRON_SECRET`
4. Deploy. The cron job will automatically run daily at 9:00 AM EST per `vercel.json`.

> **Note:** Vercel Cron requires a Pro or Enterprise plan for schedules more frequent than once per day. The daily schedule used here works on all plans including Hobby.
