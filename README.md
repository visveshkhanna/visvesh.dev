# visvesh.dev

Source for [visvesh.dev](https://visvesh.dev), the personal site of Visvesh Khanna, a software engineer working on AI products, realtime systems and developer tooling.

It is a single page built with Next.js and deployed to Cloudflare Workers through [OpenNext](https://opennext.js.org/cloudflare).

## Features

- One static page, prerendered at build time.
- Link previews: hovering a link opens a card with the site's Open Graph image, title, description and domain. The images are warmed in the browser cache while the page is idle so the cards open with their image ready.
- Light, dark and system themes via `next-themes`.
- Click-to-copy email address.

## Stack

| Area      | Choice                                                          |
| --------- | --------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router), React 19         |
| Language  | TypeScript                                                      |
| Styling   | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) on Radix UI  |
| Fonts     | Geist and Geist Mono via `next/font`                            |
| Hosting   | Cloudflare Workers via `@opennextjs/cloudflare` and Wrangler    |

## Getting started

Requires Node.js 20 or later and [pnpm](https://pnpm.io) 10.

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `pnpm dev`        | Start the Next.js dev server.                                      |
| `pnpm build`      | Production build with Next.js.                                     |
| `pnpm start`      | Serve the production build locally.                                |
| `pnpm lint`       | Run ESLint.                                                        |
| `pnpm preview`    | Build with OpenNext and run it locally in the Workers runtime.     |
| `pnpm deploy`     | Build with OpenNext and deploy to Cloudflare.                      |
| `pnpm upload`     | Build with OpenNext and upload a new version without deploying it. |
| `pnpm cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.jsonc`.            |

## Project layout

```
app/
  layout.tsx            Root layout, fonts, metadata and theme provider
  page.tsx              The home page
  globals.css           Tailwind setup and theme tokens
components/
  preview-link.tsx      Link with an Open Graph hover card
  theme-provider.tsx    next-themes wrapper
  ui/                   shadcn/ui components
lib/
  link-previews.ts      Title, description and image for each previewed link
public/                 Static assets
wrangler.jsonc          Cloudflare Worker config and custom domains
open-next.config.ts     OpenNext config
```

## Adding a link preview

1. Add an entry to `lib/link-previews.ts` with a `title`, `description` and, if the site has one, its Open Graph `image` URL. Use `imageFit: "contain"` for logos, and `imageBackground` if the logo needs a backdrop.
2. Wrap the link in `app/page.tsx`:

   ```tsx
   <PreviewLink href="https://example.com" preview={linkPreviews.example}>
     Example
   </PreviewLink>
   ```

Without an image, or if the image fails to load, the card shows the title in its place.

## Deployment

The site runs as the `visvesh-dev` Worker, served on `visvesh.dev` and `www.visvesh.dev` (see `routes` in `wrangler.jsonc`). Log in to Cloudflare once with `pnpm wrangler login`, then:

```bash
pnpm deploy
```

## Related

- [aka](https://github.com/visveshkhanna/aka): stable, named `.localhost` URLs for every local dev server. Docs at [aka.visvesh.dev](https://aka.visvesh.dev).
- [Switchboard](https://github.com/visveshkhanna/Switchboard): one local MCP endpoint for all your AI agents. Docs at [switchboard.visvesh.dev](https://switchboard.visvesh.dev).
