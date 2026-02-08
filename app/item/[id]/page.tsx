import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
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

  return (
    <div className="min-h-screen bg-background px-4 py-12 font-sans">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>

        <span className="mt-4 inline-block rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {item.category}
        </span>

        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {item.title}
        </h1>

        <time
          className="mt-1 block text-sm text-zinc-500"
          dateTime={item.created_at}
        >
          {new Date(item.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>

        <p className="mt-6 leading-relaxed text-foreground">
          {item.description || "No description available."}
        </p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Visit Source &rarr;
        </a>
      </main>
    </div>
  );
}
