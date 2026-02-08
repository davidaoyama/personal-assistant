"use client";

import { Card, CardBody, Button, Chip } from "@heroui/react";
import Image from "next/image";

const ItemDetail = ({
  title,
  description,
  date,
  url,
  faviconUrl,
  sourceDomain,
  category,
  chipColor,
  buttonColor,
}: {
  title: string;
  description: string;
  date: string;
  url: string;
  faviconUrl: string;
  sourceDomain: string;
  category: string;
  chipColor: "secondary" | "success" | "primary";
  buttonColor: "secondary" | "success" | "primary";
}) => {
  return (
    <Card
      shadow="md"
      classNames={{
        base: "mt-6 bg-content1 border border-default-200/50",
        body: "p-6 gap-5",
      }}
    >
      <CardBody>
        <Chip color={chipColor} variant="flat" size="sm" radius="sm">
          {category}
        </Chip>

        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-default-400">
          <time>{date}</time>
          {sourceDomain && (
            <>
              <span className="text-default-300">·</span>
              <span className="flex items-center gap-1.5">
                {faviconUrl && (
                  <Image
                    src={faviconUrl}
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

        <p className="leading-relaxed text-default-600 text-sm">
          {description || "No description available."}
        </p>

        <div className="pt-2">
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            color={buttonColor}
            variant="solid"
            radius="lg"
            size="md"
          >
            Visit Source →
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ItemDetail;
