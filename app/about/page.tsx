import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Personal Assistant Dashboard",
  description: "How the Personal Assistant Dashboard works.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 font-sans">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          About This Dashboard
        </h1>

        <div className="mt-8 space-y-8 text-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">What It Does</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The Personal Assistant Dashboard aggregates three types of content
              into a single page: AI &amp; tech news, sports headlines, and
              software engineering job openings. Instead of checking multiple
              sites, you get a curated feed updated daily.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Data Sources</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>AI News</strong> — RSS feeds from TechCrunch (AI
                category), The Verge (AI section), and Ars Technica (filtered
                for AI/ML topics). Up to 15 articles per refresh.
              </li>
              <li>
                <strong>Sports</strong> — ESPN&apos;s top headlines RSS feed. Up
                to 15 stories per refresh.
              </li>
              <li>
                <strong>SWE Jobs</strong> — Engineering roles scraped from
                Greenhouse job boards of top tech companies including Vercel,
                Anthropic, OpenAI, and Stripe. Up to 15 postings per refresh.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How It Updates</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              A scheduled cron job runs daily at 9:00 AM EST via Vercel Cron. It
              fetches new items from all three sources in parallel, deduplicates
              them by URL, and stores them in a Turso edge database. You can also
              trigger a manual refresh from the dashboard using the
              &quot;Refresh Feed&quot; button.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Tech Stack</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
              <li>Next.js 16 (App Router, Server Components, TypeScript)</li>
              <li>React 19</li>
              <li>Turso — edge SQLite database</li>
              <li>Tailwind CSS v4</li>
              <li>cheerio — HTML scraping for job boards</li>
              <li>rss-parser — RSS feed parsing</li>
              <li>Vercel Cron — daily scheduling</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
