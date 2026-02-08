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
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-l-4 border-zinc-200 border-l-violet-500 p-4 dark:border-zinc-800 dark:border-l-violet-500">
                <h3 className="font-medium text-violet-700 dark:text-violet-300">
                  AI News
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  RSS feeds from TechCrunch (AI category), The Verge (AI
                  section), and Ars Technica (filtered for AI/ML topics). Up to
                  15 articles per refresh.
                </p>
              </div>
              <div className="rounded-lg border border-l-4 border-zinc-200 border-l-emerald-500 p-4 dark:border-zinc-800 dark:border-l-emerald-500">
                <h3 className="font-medium text-emerald-700 dark:text-emerald-300">
                  Sports
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  ESPN&apos;s top headlines RSS feed. Up to 15 stories per
                  refresh.
                </p>
              </div>
              <div className="rounded-lg border border-l-4 border-zinc-200 border-l-blue-500 p-4 dark:border-zinc-800 dark:border-l-blue-500">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">
                  SWE Jobs
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Engineering roles scraped from Greenhouse job boards of top
                  tech companies including Vercel, Anthropic, OpenAI, and
                  Stripe. Up to 15 postings per refresh.
                </p>
              </div>
            </div>
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
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Turso",
                "Tailwind CSS v4",
                "cheerio",
                "rss-parser",
                "Vercel Cron",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
