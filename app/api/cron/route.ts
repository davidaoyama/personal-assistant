import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

interface ScrapedItem {
  title: string;
  url: string;
  description: string;
  category: "AI News" | "Sports" | "Job";
}

const AI_FEEDS = [
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  "https://feeds.arstechnica.com/arstechnica/technology-lab",
];

const AI_KEYWORDS = /\b(ai|llm|gpt|openai|anthropic|gemini|claude|machine learning|deep learning|artificial intelligence)\b/i;

async function fetchAINews(): Promise<ScrapedItem[]> {
  const parser = new Parser();

  const results = await Promise.allSettled(
    AI_FEEDS.map((url) => parser.parseURL(url))
  );

  const items: ScrapedItem[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;

    for (const item of result.value.items || []) {
      if (items.length >= 15) break;

      const url = item.link || "";
      if (!url || seen.has(url)) continue;

      // For Ars Technica (last feed), filter by AI keywords
      const isArsTechnica = url.includes("arstechnica.com");
      if (isArsTechnica && !AI_KEYWORDS.test(item.title || "")) continue;

      seen.add(url);
      items.push({
        title: item.title || "Untitled",
        url,
        description: (item.contentSnippet || item.content || "").slice(0, 300).trim(),
        category: "AI News",
      });
    }

    if (items.length >= 15) break;
  }

  return items;
}

async function fetchSportsNews(): Promise<ScrapedItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://www.espn.com/espn/rss/news");

  return (feed.items || []).slice(0, 15).map((item) => ({
    title: item.title || "Untitled",
    url: item.link || "",
    description: (item.contentSnippet || item.content || "").slice(0, 300).trim(),
    category: "Sports" as const,
  }));
}

const JOB_BOARDS = [
  { url: "https://boards.greenhouse.io/vercel", company: "Vercel" },
  { url: "https://boards.greenhouse.io/anthropic", company: "Anthropic" },
  { url: "https://boards.greenhouse.io/openai", company: "OpenAI" },
  { url: "https://boards.greenhouse.io/stripe", company: "Stripe" },
];

async function fetchJobs(): Promise<ScrapedItem[]> {
  const items: ScrapedItem[] = [];
  const seen = new Set<string>();

  for (const board of JOB_BOARDS) {
    if (items.length >= 15) break;

    try {
      const res = await fetch(board.url);
      const html = await res.text();
      const $ = cheerio.load(html);

      $("a").each((_, el) => {
        if (items.length >= 15) return false;

        const title = $(el).text().trim();
        const href = $(el).attr("href");

        if (title && href && /engineer|software|swe|developer/i.test(title)) {
          const url = href.startsWith("http")
            ? href
            : `https://boards.greenhouse.io${href}`;

          if (!seen.has(url)) {
            seen.add(url);
            const location = $(el).closest("div").find(".location").text().trim();
            items.push({
              title: `${title} (${board.company})`,
              url,
              description: location
                ? `${board.company} — ${location}`
                : `${board.company} — Engineering role`,
              category: "Job",
            });
          }
        }
      });
    } catch (e) {
      console.error(`Failed to fetch jobs from ${board.company}:`, e);
    }
  }

  return items;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feed_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing table: add description column if missing
  try {
    await db.execute("ALTER TABLE feed_items ADD COLUMN description TEXT DEFAULT ''");
  } catch {
    // Column already exists — ignore
  }

  // Fetch all sources in parallel, isolating errors
  const results = await Promise.allSettled([
    fetchAINews(),
    fetchSportsNews(),
    fetchJobs(),
  ]);

  const allItems: ScrapedItem[] = [];
  const errors: string[] = [];

  results.forEach((result, i) => {
    const source = ["AI News", "Sports", "Jobs"][i];
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    } else {
      errors.push(`${source}: ${result.reason}`);
      console.error(`Failed to fetch ${source}:`, result.reason);
    }
  });

  // Upsert items (ignore duplicates via UNIQUE url constraint)
  let inserted = 0;
  for (const item of allItems) {
    try {
      const result = await db.execute({
        sql: "INSERT OR IGNORE INTO feed_items (title, url, description, category) VALUES (?, ?, ?, ?)",
        args: [item.title, item.url, item.description, item.category],
      });
      if (result.rowsAffected > 0) inserted++;
    } catch (e) {
      console.error("Insert error:", e);
    }
  }

  return NextResponse.json({
    success: true,
    fetched: allItems.length,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
  });
}
