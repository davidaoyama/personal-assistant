"use client";

import { Card, CardBody } from "@heroui/react";
import Image from "next/image";

const FeedCard = ({
  title,
  description,
  date,
  faviconUrl,
  accentClass,
}: {
  title: string;
  description: string;
  date: string;
  faviconUrl: string;
  accentClass: string;
}) => {
  return (
    <Card
      isHoverable
      shadow="md"
      classNames={{
        base: "bg-content1 border border-default-200/50",
        body: "p-4",
      }}
    >
      <CardBody className="gap-2">
        <div className="flex items-start gap-3">
          {faviconUrl && (
            <Image
              src={faviconUrl}
              alt=""
              width={16}
              height={16}
              className="mt-1 shrink-0 rounded-sm"
              unoptimized
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-snug text-foreground">
              {title}
            </p>
            {description && (
              <p className="mt-1.5 text-xs text-default-400 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
            <time className={`mt-2 block text-xs font-medium ${accentClass}`}>
              {date}
            </time>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FeedCard;
