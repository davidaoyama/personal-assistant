export interface FeedItem {
  id: number;
  title: string;
  url: string;
  category: "AI News" | "Sports" | "Job";
  created_at: string;
}
