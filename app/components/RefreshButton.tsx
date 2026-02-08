"use client";

import { useTransition } from "react";
import { Button } from "@heroui/react";

const RefreshButton = ({ refreshFeed }: { refreshFeed: () => Promise<void> }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="bordered"
      size="sm"
      radius="full"
      className="border-default-300 text-foreground"
      isLoading={isPending}
      onPress={() => startTransition(() => refreshFeed())}
      aria-label="Refresh feed"
    >
      {isPending ? "Refreshing..." : "Refresh Feed"}
    </Button>
  );
};

export default RefreshButton;
