"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    href: "https://github.com/visveshkhanna/otakuu.ai",
    name: "otakuu.ai",
    description:
      "AI platform that brings anime characters to life with dynamic, multimodal interactions.",
  },
  {
    href: "#",
    name: "Experthire",
    description:
      "AI-powered hiring platform for resume analysis, candidate-job matching, and voice-based mock interviews.",
  },
  {
    href: "#",
    name: "Internal AI API Platform",
    description:
      "OpenRouter-style internal platform unifying OpenAI, Bedrock, Mistral, and custom models behind a single API.",
  },
  {
    href: "#",
    name: "Realtime Voice API Platform",
    description:
      "Multi-agent realtime voice stack for low-latency conversations, tools, and speech workflows.",
  },
];

const projectLinkClasses =
  "hover:underline hover:decoration-wavy transition-all hover:text-primary";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (!mounted) return;

    const order = ["system", "light", "dark"] as const;
    const current = (theme as (typeof order)[number]) ?? "system";
    const next = order[(order.indexOf(current) + 1) % order.length];

    setTheme(next);
  };

  const getThemeLabel = () => {
    if (!mounted) return "Theme";
    if (theme === "system" || !theme) return "System";
    if (theme === "light") return "Light";
    return "Dark";
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("visveshkhanna@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Failed to copy email", e);
    }
  };

  return (
    <main className="flex w-full min-h-full lg:h-dvh justify-center">
      <div className="flex flex-col max-w-2xl h-full justify-between py-8 w-full px-4">
        <section className="flex flex-col gap-8 h-full md:pt-12">
          <header className="flex gap-4 items-end lg:pb-12">
            <div className="relative size-[52px] rounded-full bg-muted overflow-hidden">
              <Image
                src="/visvesh.jpeg"
                alt="Visvesh Khanna"
                unoptimized
                className="object-cover"
                fill
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-medium">Visvesh Khanna</p>
              <p className="text-muted-foreground text-sm">
                Software Engineer · AI & Full Stack
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-3 text-muted-foreground text-sm">
            <p>
              Software engineer building AI products, realtime systems, and
              developer tooling across the stack.
            </p>

            <p>
              I&apos;ve worked on AI and voice platforms, learning engines,
              full-stack dashboards, and DevOps pipelines at Educational
              Initiatives, as a founding engineer at a B2B SaaS startup, and as
              a freelancer for clients across the world.
            </p>

            <p className="font-medium text-foreground pt-2">Some of my work:</p>

            <ul className="list-disc list-inside space-y-1">
              {projects.map((project) => (
                <li key={project.name}>
                  {project.href === "#" ? (
                    <span className="font-medium">{project.name}</span>
                  ) : (
                    <Link
                      href={project.href}
                      className={projectLinkClasses + " font-medium"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.name}
                    </Link>
                  )}{" "}
                  – {project.description}
                </li>
              ))}
            </ul>

            <p className="pt-2">
              I ship production systems with React/Next.js, TypeScript, Python,
              FastAPI, and AWS — often with LLMs, RAG, and realtime voice in the
              loop.
            </p>

            <p>
              For collaborations, reach me at{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="underline-offset-4 hover:underline font-medium"
                  >
                    visveshkhanna@gmail.com
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{copied ? "Copied!" : "Click to copy"}</p>
                </TooltipContent>
              </Tooltip>
            </p>

            <p>
              You can also find me on{" "}
              <Link
                href="https://github.com/visveshkhanna"
                className={projectLinkClasses}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>{" "}
              and{" "}
              <Link
                href="https://linkedin.com/in/visveshkhanna"
                className={projectLinkClasses}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </Link>
              .
            </p>
          </div>
        </section>

        <footer className="flex gap-4 justify-between items-center pt-20 sm:pt-0">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Visvesh Khanna</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={cycleTheme}
          >
            {getThemeLabel()}
          </Button>
        </footer>
      </div>
    </main>
  );
}
