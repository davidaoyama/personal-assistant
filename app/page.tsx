import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import RefreshButton from "./components/RefreshButton";

const CATEGORIES = ["AI News", "Sports", "Job"] as const;

async function getItems(): Promise<FeedItem[]> {
  try {
    const result = await db.execute(
      "SELECT id, title, url, category, created_at FROM feed_items ORDER BY created_at DESC"
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
}) => (
  <section aria-labelledby={`heading-${category}`}>
    <h2
      id={`heading-${category}`}
      className="mb-4 text-xl font-semibold text-foreground"
    >
      {category}
    </h2>
    {items.length === 0 ? (
      <p className="text-sm text-zinc-500">No items found.</p>
    ) : (
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <p className="font-medium text-foreground">{item.title}</p>
              <time
                className="mt-1 block text-xs text-zinc-500"
                dateTime={item.created_at}
              >
                {new Date(item.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </a>
          </li>
        ))}
      </ul>
    )}
  </section>
);

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
            Personal Assistant
          </h1>
          <RefreshButton refreshFeed={refreshFeed} />
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
