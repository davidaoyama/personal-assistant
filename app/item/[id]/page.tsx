import { db } from "@/lib/db";
import type { FeedItem } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ItemDetail from "@/app/components/ItemDetail";

interface Props {
  params: Promise<{ id: string }>;
}

const CATEGORY_COLORS: Record<
  string,
  { chipColor: "secondary" | "success" | "primary"; buttonColor: "secondary" | "success" | "primary" }
> = {
  "AI News": {
    chipColor: "secondary",
    buttonColor: "secondary",
  },
  Sports: {
    chipColor: "success",
    buttonColor: "success",
  },
  Job: {
    chipColor: "primary",
    buttonColor: "primary",
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
  const sourceDomain = (() => {
    try {
      return new URL(item.url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  })();

  return (
    <div className="min-h-screen px-6 py-10">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-default-400 transition-colors hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>

        <ItemDetail
          title={item.title}
          description={item.description}
          date={new Date(item.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          url={item.url}
          faviconUrl={getFaviconUrl(item.url)}
          sourceDomain={sourceDomain}
          category={item.category}
          chipColor={colors.chipColor}
          buttonColor={colors.buttonColor}
        />
      </main>
    </div>
  );
}
