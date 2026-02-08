"use client";

import { useTransition } from "react";

const RefreshButton = ({ refreshFeed }: { refreshFeed: () => Promise<void> }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => refreshFeed())}
      disabled={isPending}
      aria-label="Refresh feed"
      className="cursor-pointer rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Refreshing..." : "Refresh Feed"}
    </button>
  );
};

export default RefreshButton;
