import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — David's Daily Standup",
  description: "Why I built this dashboard and how it works.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-default-400 transition-colors hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          About This Dashboard
        </h1>

        <div className="mt-8 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Why I Built This</h2>
            <p className="mt-2 text-default-500">
              I want to stay on top of what&apos;s happening in AI, I love
              sports (especially the Falcons and Seahawks), and I want to know
              about open SWE roles at companies I care about. Instead of
              bouncing between a dozen tabs every morning, I built this to
              aggregate everything into one quick daily standup view.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Data Sources</h2>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-default-200/50 border-l-4 border-l-violet-500 p-4">
                <h3 className="font-medium text-violet-400">AI News</h3>
                <p className="mt-1 text-sm text-default-500">
                  RSS feeds from TechCrunch (AI category), The Verge (AI
                  section), and Ars Technica (filtered for AI/ML topics). Up to
                  15 articles per refresh.
                </p>
              </div>
              <div className="rounded-lg border border-default-200/50 border-l-4 border-l-emerald-500 p-4">
                <h3 className="font-medium text-emerald-400">Sports</h3>
                <p className="mt-1 text-sm text-default-500">
                  ESPN&apos;s top headlines RSS feed. Up to 15 stories per
                  refresh.
                </p>
              </div>
              <div className="rounded-lg border border-default-200/50 border-l-4 border-l-blue-500 p-4">
                <h3 className="font-medium text-blue-400">SWE Jobs</h3>
                <p className="mt-1 text-sm text-default-500">
                  Engineering roles scraped from Greenhouse job boards of top
                  tech companies including Vercel, Anthropic, OpenAI, and
                  Stripe. Up to 15 postings per refresh.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">How It Updates</h2>
            <p className="mt-2 text-default-500">
              A scheduled cron job runs daily at 9:00 AM EST via Vercel Cron. It
              fetches new items from all three sources in parallel, deduplicates
              them by URL, and stores them in a Turso edge database. You can also
              trigger a manual refresh from the dashboard using the
              &quot;Refresh Feed&quot; button.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Tech Stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Turso",
                "Tailwind CSS v4",
                "HeroUI",
                "cheerio",
                "rss-parser",
                "Vercel Cron",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-default-200 px-3 py-1 text-sm text-default-500"
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
