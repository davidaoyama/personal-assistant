import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import RefreshButton from "./components/RefreshButton";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["AI News", "Sports", "Job"] as const;

const CATEGORY_STYLES: Record<
  string,
  { border: string; dot: string; badge: string; hover: string }
> = {
  "AI News": {
    border: "border-l-violet-500",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    hover: "hover:border-l-violet-400",
  },
  Sports: {
    border: "border-l-emerald-500",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    hover: "hover:border-l-emerald-400",
  },
  Job: {
    border: "border-l-blue-500",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    hover: "hover:border-l-blue-400",
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
        className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground"
      >
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        {category}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No items found.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => {
            const favicon = getFaviconUrl(item.url);
            return (
              <li key={item.id}>
                <Link
                  href={`/item/${item.id}`}
                  className={`block rounded-lg border border-zinc-200 border-l-4 ${styles.border} ${styles.hover} p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900`}
                >
                  <div className="flex items-start gap-2.5">
                    {favicon && (
                      <Image
                        src={favicon}
                        alt=""
                        width={16}
                        height={16}
                        className="mt-0.5 shrink-0 rounded-sm"
                        unoptimized
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.description && (
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <time
                        className="mt-1 block text-xs text-zinc-400"
                        dateTime={item.created_at}
                      >
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
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
    <div className="min-h-screen bg-background px-4 py-12 font-sans">
      <main className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            David&apos;s Daily Standup
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-zinc-500 transition-colors hover:text-foreground"
            >
              About
            </Link>
            <RefreshButton refreshFeed={refreshFeed} />
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-3">
          {grouped.map(({ category, items }) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
            />
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-8 text-center text-zinc-500">
            No feed items yet. Click &quot;Refresh Feed&quot; to fetch data.
          </p>
        )}
      </main>
    </div>
  );
}
