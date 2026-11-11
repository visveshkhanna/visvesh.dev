"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";
import type { LinkPreview } from "@/lib/link-previews";

function hostOf(href: string) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return path && host === "github.com" ? `${host}${path}` : host;
  } catch {
    return href;
  }
}

type PreviewLinkProps = {
  href: string;
  preview: LinkPreview;
  className?: string;
  children: ReactNode;
};

export function PreviewLink({
  href,
  preview,
  className,
  children,
}: PreviewLinkProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const host = hostOf(href);
  const showImage = preview.image && !imageFailed;

  return (
    <HoverCardPrimitive.Root openDelay={120} closeDelay={80}>
      <HoverCardPrimitive.Trigger asChild>
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {children}
        </a>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            "z-50 w-72 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg outline-hidden",
            "origin-(--radix-hover-card-content-transform-origin)",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            className="group block"
          >
            <div
              className="relative aspect-[1200/630] w-full border-b bg-muted"
              style={
                showImage && preview.imageBackground
                  ? { backgroundColor: preview.imageBackground }
                  : undefined
              }
            >
              {showImage ? (
                <Image
                  src={preview.image!}
                  alt=""
                  fill
                  unoptimized
                  sizes="288px"
                  onError={() => setImageFailed(true)}
                  className={cn(
                    preview.imageFit === "contain"
                      ? "object-contain p-6"
                      : "object-cover"
                  )}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-mono text-2xl font-medium tracking-tight text-muted-foreground">
                    {preview.title}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-4">
              <p className="text-sm font-medium text-foreground">
                {preview.title}
              </p>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {preview.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="truncate rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {host}
                </span>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground"
                />
              </div>
            </div>
          </a>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
