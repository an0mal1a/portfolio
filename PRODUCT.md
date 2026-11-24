# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Fixed by the owner: Nuxt 4 + Vue 3 + TailwindCSS + Lucide icons (`@lucide/vue`). Any supporting package for motion, smooth scrolling, images or SEO is allowed when it serves the design and performance. Frontend lives in `/frontend`, is built as a Node server (`.output/server/index.mjs`, see `frontend/Dockerfile`) and deployed with Docker/Coolify next to the backends.

## Users

Pablo Diez sells development work. The site has to convince four audiences, all confirmed by the owner:

1. **Local Ibiza businesses** (hospitality, real estate, services, shops) that need a website that brings customers and small automations. They search in Spanish ("diseño web Ibiza", "desarrollador web Ibiza") and decide on trust and proof.
2. **Companies that need custom software** (SMBs in Ibiza and the rest of Spain): CRMs, SaaS, intranets, integrations, operations tools like Vestta or Brisa.
3. **International businesses operating in Ibiza** (villas, agencies, foreign brands) who search and buy in English.
4. **Startups and product founders** looking for a full-stack developer to build an MVP or product.

The job for every visitor: decide within a minute whether Pablo can build what they need, trust that he ships real production work, and get in touch without friction.

## Product Purpose

A personal portfolio that works as the main sales channel for Pablo's freelance development practice in Ibiza. Success means: ranking at the top of Google for web/software development in Ibiza (Spain-wide as a stretch), turning qualified visits into contact-form leads, and leaving a memorable "this person is on another level" impression through craft, clarity of data and speed.

## Positioning

A full-stack developer based in Ibiza who builds production systems end to end (frontend, backend, data, infrastructure, AI automation) **and comes from offensive security research**. Owner-confirmed differentiator: "builds software knowing how it gets broken". The portfolio itself is proof: it is fed by a live Rust API, a Python worker that syncs GitHub and a PostgreSQL database, all visible to the visitor (live system status, real GitHub activity). A typical local agency cannot truthfully show that.

## Operating Context

- Visitors arrive mainly from Google (local and national queries), LinkedIn, GitHub and direct referrals from Ibiza clients (`?utm_source=portfolio` links go out from case studies).
- The browser only talks to the public Rust API (`https://rust-api.impablo.dev`, CORS allows `https://impablo.dev` and localhost). The Python worker (`https://python-api.impablo.dev`) is reachable for the public GitHub sync jobs with SSE progress.
- Production domain: `impablo.dev`. Timezone Europe/Madrid.
- The Rust API rate-limits per IP: 120 req/min general, 3 req/min on `/contact`. Server-side rendering calls share one IP, so SSR data must be cached.

## Capabilities and Constraints

Backend capabilities the frontend can rely on (Rust API, all JSON with `status: "ok" | "ko"`):

- `GET /projects` and `GET /projects/{slug}`: case studies with name, tagline, description, `content_html`, `project_type` (`saas`, `web`, `automation`, `tool`), `status` (`in_progress`, `published`, `archived`), image, live/repo URLs, featured flag, dates, client and GitHub repository links.
- `GET /clients`: client names, websites and logo URLs.
- `GET /github/me`: GitHub profile (name, avatar, links, README description, followers) plus a full year of daily contributions with quartile levels.
- `GET /github/repositories` and `GET /github/repositories/{name}`: visible repositories with language, stars, forks, visibility, fork/archived flags, push dates and contributors.
- `GET /system/status`: live health of database pools, Python worker, SMTP, uptime, API version and last GitHub sync (repositories, languages, duration). Can take up to ~5 s when SMTP times out.
- `POST /contact` with `{ name, email, subject, message, phone? }`: sends email and stores the lead; errors `invalid_mail`, `email_error`, `database_error`, `rate_limited` (with `retry_after`).
- Python worker public jobs: `POST /public/jobs/{repo_sync|profile}/run`, `GET /public/jobs/{run_id}` and SSE `GET /public/jobs/{run_id}/events`. Limits: one active run per job, one run per visitor per day, 3 public runs per day per job.

Constraints:

- Languages: Spanish (default) and English, confirmed. Content and URLs need proper hreflang.
- The P logo is the only binding brand asset; palette and fonts are free (decided 2026-11-23). The previous sites (2025 version and the 2026 paper/Ibiza-sun redesign) must not be used as reference.
- Project content is written in Spanish in the database; the English case studies live in the frontend (`frontend/server/content/projects-en.ts`).
- Undecided: public phone/WhatsApp, physical address / Google Business Profile, pricing. Do not invent them.

## Brand Commitments

- **Binding: the P logo only** (owner decision, 2026-11-23). The modular directional "P" mark (`frontend/pablo-brand-kit/assets/logo-mark.svg`: the three-piece monogram from the kit's `brandboard.png`) plus the **PABLO** wordmark. Never stretch, rotate, outline, shadow or gradient-recolour the mark; clear space at least the width of its vertical foot. On dark grounds it is set in the page's off-white.
- The brand kit includes Graphite Ink, Warm Paper, Signal Orange (`#FF4D2E`), Ultramarine, Oxide, Bricolage Grotesque, Azeret Mono, the descriptor INDEPENDENT BUILDER and the tagline. DESIGN.md defines the site's visual system.
- **Owner's taste for this redesign:** dark and premium, Apple-keynote calm and finish, motion where it earns its place, real personality; never a cold luxury agency, never a flat generic landing. Real material (recordings of shipped products, real data) over illustration.
- Name in copy: **Pablo Diez**. GitHub handle `an0mal1a`. Domain `impablo.dev`.
- Owner's framing of the site: "it's a portfolio, it has to be seriously impressive" (WOW, crafted motion), while SEO stays oriented to web/software development in Ibiza.
- Voice already present in the case studies: first person, honest, concrete, a little understated; explains decisions and trade-offs, avoids buzzwords and magic promises ("no quería hacer otro CRM con IA").
- Security work is described responsibly: no operational capabilities or attack instructions are published (see Nightmare Framework case study).

## Evidence on Hand

- 9 public case studies in the database (Vestta CRM, Vestta.io, Brisa Operations, Post Producciones, Tierras de Ibiza, La Casa de Susana, NextLevelApps, self-debrid, Nightmare Framework). AlcoberBot is hidden (owner decision, 2026-11-24): show nothing from Alcober on the home.
- 5 real clients with logos: Post Producciones, Tierras de Ibiza, La Casa de Susana, Limpiezas Alcober, Alcober Services.
- GitHub: 36 visible repositories, 17 languages, ~2,750 contributions in the last year, 15 followers; profile links to LinkedIn, X and Hack The Box.
- Stack evidence from shipped work: Nuxt/Vue, Tailwind, FastAPI, PostgreSQL, Redis, Docker, Rust/Axum, C/C++, WhatsApp Business API, LLM pipelines, SSE.
- Studies and certificates (`frontend/app/content/credentials.ts`, shown on About): Grado Medio SMR, Hack4u, Mastermind and Rustlang en Español. A verification link is only published after opening the issuer's page.
- CV: `frontend/public/cv/pablo-diez-cv.pdf`, the owner's PDF without the phone number (owner decision). Remove the phone again whenever it is replaced.
- Owner portrait: `frontend/public/images/portfolio-color.png` (1122×1402 studio headshot, neutral grey backdrop, black t-shirt). Ship it through optimized AVIF/WebP, never the 2.6 MB PNG.
- Primary conversion action (owner-confirmed): the contact form backed by `POST /contact`.
- Owner-confirmed anti-goals: generic agency template, cold/corporate tone, "hacker theatre" (green terminals, glitch, matrix), and anything slow. The owner loves animation when it is well crafted and purposeful.
- Absent and must not be fabricated: testimonials, star ratings, revenue/traffic results for clients, certifications beyond that list, pricing, team size, years-of-experience claims.

## Product Principles

1. **Proof over promises.** Every claim is backed by a live system, a real project or real data from the API.
2. **Business outcome first, engineering depth on demand.** A local business owner understands what they get in seconds; a CTO can dig into architecture and code.
3. **Security is part of the craft.** It is a visible differentiator, framed as protection for the client, never as edgy hacker theatre.
4. **Fast is a feature.** Performance and Core Web Vitals are treated as design requirements; the site must feel instant on a mid-range phone.
5. **Built to rank.** Structure, semantics and content serve local and national search in Spanish and English from day one.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor. Respect `prefers-reduced-motion` for every animation, keep all content reachable without motion or pointer hover, and keep text legible on mobile in bright outdoor light (a common Ibiza usage scene).
