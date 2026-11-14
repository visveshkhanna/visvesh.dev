"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import { HireSection } from "@/components/hire-section";
import { PreviewLink } from "@/components/preview-link";
import { linkPreviews, type LinkPreview } from "@/lib/link-previews";

type Project = {
  href: string;
  name: string;
  description: string;
  preview: LinkPreview;
};

const projects: Project[] = [
  {
    href: "https://www.instagram.com/otakuu.ai/",
    name: "otakuu.ai",
    description:
      "AI platform that brings anime characters to life with dynamic, multimodal interactions.",
    preview: linkPreviews.otakuu,
  },
  {
    href: "https://aka.visvesh.dev",
    name: "aka",
    description:
      "Open source CLI that gives every local dev server a stable, named .localhost URL, in any language or framework.",
    preview: linkPreviews.aka,
  },
];

const noopSubscribe = () => () => {};

const projectLinkClasses =
  "hover:underline hover:decoration-wavy transition-all hover:text-primary";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Warm the browser cache so hover cards open with their image ready.
  useEffect(() => {
    const preload = () => {
      for (const preview of Object.values(linkPreviews) as LinkPreview[]) {
        if (preview.image) new window.Image().src = preview.image;
      }
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 500);
    return () => clearTimeout(id);
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

  return (
    <main className="flex w-full min-h-dvh justify-center">
      <div className="flex flex-col max-w-2xl h-full justify-between py-8 w-full px-4">
        <section className="flex flex-col gap-8 md:pt-12">
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
            <a
              href="#hire"
              className="ml-auto self-start font-mono text-xs text-muted-foreground transition-colors hover:text-foreground md:self-end"
            >
              hire ↓
            </a>
          </header>

          <div className="flex flex-col gap-3 text-muted-foreground text-sm">
            <p>
              Software engineer building AI products, realtime systems, and
              developer tooling across the stack.
            </p>

            <p>
              I&apos;ve worked on AI and voice platforms, learning engines,
              full-stack dashboards, and DevOps pipelines at{" "}
              <PreviewLink
                href="https://ei.study"
                preview={linkPreviews.ei}
                className={projectLinkClasses + " font-medium text-foreground"}
              >
                Educational Initiatives
              </PreviewLink>
              , as a founding engineer at a B2B SaaS startup, and as a
              freelancer for clients across the world.
            </p>

            <p>
              Currently working on{" "}
              <PreviewLink
                href="https://switchboard.visvesh.dev"
                preview={linkPreviews.switchboard}
                className={projectLinkClasses + " font-medium text-foreground"}
              >
                Switchboard
              </PreviewLink>
              , one local MCP endpoint for all your AI agents. It groups MCP
              servers into profiles and gives Cursor, Claude Code and the rest
              only the tools each should see. It&apos;s open source on{" "}
              <PreviewLink
                href="https://github.com/visveshkhanna/Switchboard"
                preview={linkPreviews.switchboardGithub}
                className={projectLinkClasses}
              >
                GitHub
              </PreviewLink>
              .
            </p>

            <p className="font-medium text-foreground pt-2">Some of my work:</p>

            <ul className="list-disc list-inside space-y-1">
              {projects.map((project) => (
                <li key={project.name}>
                  <PreviewLink
                    href={project.href}
                    preview={project.preview}
                    className={projectLinkClasses + " font-medium"}
                  >
                    {project.name}
                  </PreviewLink>{" "}
                  – {project.description}
                </li>
              ))}
            </ul>

            <p className="pt-2">
              I ship production systems with React/Next.js, TypeScript, Python,
              FastAPI, and AWS — often with LLMs, RAG, and realtime voice in the
              loop.
            </p>

          </div>

          <HireSection />
        </section>

        <footer className="flex gap-4 justify-between items-center pt-16">
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
