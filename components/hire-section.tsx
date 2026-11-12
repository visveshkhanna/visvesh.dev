"use client";

import { useState, useSyncExternalStore } from "react";

import { DecodeText } from "@/components/decode-text";

const EMAIL = "visveshkhanna@gmail.com";
const TIME_ZONE = "Asia/Kolkata";

const focusAreas = [
  "AI products",
  "Realtime voice",
  "Developer tooling",
  "Full stack",
];

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const subscribeToClock = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};

/** Local time in India, ticking; empty during server render. */
function useLocalTime() {
  return useSyncExternalStore(
    subscribeToClock,
    () => timeFormat.format(new Date()),
    () => ""
  );
}

const rowClasses =
  "group grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4 border-b py-3 transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:border-foreground/40";

export function HireSection() {
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="hire"
      aria-labelledby="hire-heading"
      className="flex scroll-mt-8 flex-col gap-6 border-t pt-8"
    >
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Hire</span>
        <span className="flex items-center gap-2 normal-case tracking-normal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          Open to new work
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span className="tabular-nums" suppressHydrationWarning>
            India {time || "--:--"}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2
          id="hire-heading"
          className="text-2xl font-medium tracking-tight text-foreground text-balance"
        >
          Have something worth building?
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          I take on a few freelance projects at a time, from a first prototype
          to a system in production. Tell me what you&apos;re building and
          what&apos;s in the way.
        </p>
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col text-sm">
        <button
          type="button"
          onClick={copyEmail}
          className={`${rowClasses} border-t text-left`}
          aria-label={`Copy email address ${EMAIL}`}
        >
          <span className="text-muted-foreground">Email</span>
          <span className="flex items-baseline justify-between gap-3 text-foreground">
            <DecodeText text={EMAIL} className="truncate font-mono text-xs" />
            <span
              aria-live="polite"
              className="shrink-0 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground"
            >
              {copied ? "copied" : "copy"}
            </span>
          </span>
        </button>

        <a
          href="https://github.com/visveshkhanna"
          target="_blank"
          rel="noreferrer"
          className={rowClasses}
        >
          <span className="text-muted-foreground">GitHub</span>
          <span className="text-foreground">
            <DecodeText
              text="github.com/visveshkhanna"
              className="font-mono text-xs"
            />
          </span>
        </a>

        <a
          href="https://linkedin.com/in/visveshkhanna"
          target="_blank"
          rel="noreferrer"
          className={rowClasses}
        >
          <span className="text-muted-foreground">LinkedIn</span>
          <span className="text-foreground">
            <DecodeText
              text="in/visveshkhanna"
              className="font-mono text-xs"
            />
          </span>
        </a>
      </div>
    </section>
  );
}
