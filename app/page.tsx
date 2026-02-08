import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import RefreshButton from "./components/RefreshButton";
import FeedCard from "./components/FeedCard";
import Link from "next/link";

const CATEGORIES = ["AI News", "Sports", "Job"] as const;

const CATEGORY_STYLES: Record<
  string,
  { dot: string; accent: string }
> = {
  "AI News": {
    dot: "bg-violet-500",
    accent: "text-violet-400",
  },
  Sports: {
    dot: "bg-emerald-500",
    accent: "text-emerald-400",
  },
  Job: {
    dot: "bg-blue-500",
    accent: "text-blue-400",
  },
};

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  } catch {
    return "";
  }
}

async function getItems(): Promise<FeedItem[]> {
  try {
    const result = await db.execute(
      "SELECT id, title, url, description, category, created_at FROM feed_items ORDER BY created_at DESC"
    );
    return result.rows as unknown as FeedItem[];
  } catch {
    return [];
  }
}

async function refreshFeed() {
  "use server";

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  await fetch(`${baseUrl}/api/cron`, {
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });

  revalidatePath("/");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getSourceName(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

const CategorySection = ({
  category,
  items,
}: {
  category: string;
  items: FeedItem[];
}) => {
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES["AI News"];

  return (
    <section aria-labelledby={`heading-${category}`}>
      <h2
        id={`heading-${category}`}
        className="mb-5 flex items-center gap-2.5 text-lg font-bold text-foreground"
      >
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        {category}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-default-400">No items found.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/item/${item.id}`} className="block">
                <FeedCard
                  title={item.title}
                  description={item.description}
                  date={`${getSourceName(item.url)} · ${formatDate(item.created_at)}`}
                  faviconUrl={getFaviconUrl(item.url)}
                  accentClass={styles.accent}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default async function Home() {
  const items = await getItems();

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  }));

  return (
    <div className="min-h-screen px-6 py-10">
      <main className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            David&apos;s Daily Standup
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-default-400 transition-colors hover:text-foreground"
            >
              About
            </Link>
            <RefreshButton refreshFeed={refreshFeed} />
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {grouped.map(({ category, items }) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
            />
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-8 text-center text-default-400">
            No feed items yet. Click &quot;Refresh Feed&quot; to fetch data.
          </p>
        )}
      </main>
    </div>
  );
}
