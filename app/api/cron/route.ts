import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

interface HNItem {
  title: string;
  url?: string;
  id: number;
}

interface ScrapedItem {
  title: string;
  url: string;
  category: "AI News" | "Sports" | "Job";
}

const AI_KEYWORDS = /\b(ai|llm|gpt|openai|anthropic|gemini|claude|machine learning|deep learning)\b/i;

async function fetchAINews(): Promise<ScrapedItem[]> {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds: number[] = await res.json();

  const items: ScrapedItem[] = [];

  for (const id of storyIds) {
    if (items.length >= 5) break;

    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story: HNItem = await storyRes.json();

    if (story.title && AI_KEYWORDS.test(story.title)) {
      items.push({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        category: "AI News",
      });
    }
  }

  return items;
}

async function fetchSportsNews(): Promise<ScrapedItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL("https://www.espn.com/espn/rss/news");

  return (feed.items || []).slice(0, 5).map((item) => ({
    title: item.title || "Untitled",
    url: item.link || "",
    category: "Sports" as const,
  }));
}

async function fetchJobs(): Promise<ScrapedItem[]> {
  const res = await fetch("https://boards.greenhouse.io/vercel");
  const html = await res.text();
  const $ = cheerio.load(html);

  const items: ScrapedItem[] = [];

  $("a").each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr("href");

    if (title && href && /engineer/i.test(title)) {
      const url = href.startsWith("http")
        ? href
        : `https://boards.greenhouse.io${href}`;
      items.push({ title, url, category: "Job" });
    }
  });

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
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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
        sql: "INSERT OR IGNORE INTO feed_items (title, url, category) VALUES (?, ?, ?)",
        args: [item.title, item.url, item.category],
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
