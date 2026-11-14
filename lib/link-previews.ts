export type LinkPreview = {
  title: string;
  description: string;
  /** Open Graph image for the link, loaded straight from its site. */
  image?: string;
  /** How the image should sit in the card. Logos read better contained. */
  imageFit?: "cover" | "contain";
  /** Background behind a contained image, e.g. white for a dark logo. */
  imageBackground?: string;
};

export const linkPreviews = {
  aka: {
    title: "aka",
    description:
      "Stable, named .localhost URLs for every local dev server, in any language or framework. aka works out the port by itself.",
    image: "https://aka.visvesh.dev/og/docs/image.png",
  },
  akaGithub: {
    title: "visveshkhanna/aka",
    description:
      "Source, releases and issues for aka. A single static Go binary for macOS, Linux and Windows.",
    image: "https://opengraph.githubassets.com/1/visveshkhanna/aka",
  },
  switchboard: {
    title: "Switchboard",
    description:
      "One local MCP endpoint for all your AI agents. Group MCP servers into profiles and give each client only the tools it should see.",
    image: "https://switchboard.visvesh.dev/og/home.png",
  },
  switchboardGithub: {
    title: "visveshkhanna/Switchboard",
    description:
      "Source, releases and issues for Switchboard. Install with npx mcp-switchboard up.",
    image: "https://opengraph.githubassets.com/1/visveshkhanna/Switchboard",
  },
  ei: {
    title: "Educational Initiatives",
    description:
      "Improving student learning through research-based assessments and personalized adaptive learning.",
    image: "https://ei.study/assets/images/EI%20-%20FULL-01.svg",
    imageFit: "contain",
    imageBackground: "#ffffff",
  },
  otakuu: {
    title: "otakuu.ai",
    description:
      "AI platform that brings anime characters to life with dynamic, multimodal interactions.",
  },
  github: {
    title: "visveshkhanna",
    description: "Open source work, side projects and experiments on GitHub.",
    image: "https://avatars.githubusercontent.com/u/73913321?v=4&s=400",
    imageFit: "contain",
  },
  linkedin: {
    title: "Visvesh Khanna",
    description: "Experience, roles and the longer version of my story.",
  },
} satisfies Record<string, LinkPreview>;
