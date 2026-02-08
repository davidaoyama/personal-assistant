import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

const CATEGORY_COLORS: Record<string, { badge: string; button: string }> = {
  "AI News": {
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    button: "bg-violet-600 hover:bg-violet-700",
  },
  Sports: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  Job: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await db.execute({
    sql: "SELECT title FROM feed_items WHERE id = ?",
    args: [id],
  });
  const item = result.rows[0] as unknown as FeedItem | undefined;
  return { title: item ? item.title : "Item Not Found" };
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const result = await db.execute({
    sql: "SELECT id, title, url, description, category, created_at FROM feed_items WHERE id = ?",
    args: [id],
  });

  const item = result.rows[0] as unknown as FeedItem | undefined;
  if (!item) notFound();

  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["AI News"];
  const favicon = getFaviconUrl(item.url);
  const sourceDomain = (() => {
    try {
      return new URL(item.url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  })();

  return (
    <div className="min-h-screen bg-background px-4 py-12 font-sans">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>

        <span
          className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${colors.badge}`}
        >
          {item.category}
        </span>

        <h1 className="mt-3 text-2xl font-bold text-foreground">
          {item.title}
        </h1>

        <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
          <time dateTime={item.created_at}>
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          {sourceDomain && (
            <>
              <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
              <span className="flex items-center gap-1.5">
                {favicon && (
                  <Image
                    src={favicon}
                    alt=""
                    width={14}
                    height={14}
                    className="rounded-sm"
                    unoptimized
                  />
                )}
                {sourceDomain}
              </span>
            </>
          )}
        </div>

        <p className="mt-6 leading-relaxed text-foreground">
          {item.description || "No description available."}
        </p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 inline-block rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors ${colors.button}`}
        >
          Visit Source &rarr;
        </a>
      </main>
    </div>
  );
}
