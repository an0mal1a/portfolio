# AGENTS.md

Guide for any coding agent working in this repository. Read it before touching code.

## What this repository is

The personal portfolio and main sales channel of **Pablo Diez**, a full-stack developer based in Ibiza (domain `impablo.dev`). The site must rank for web/software development in Ibiza (Spain-wide as a stretch), turn visits into contact-form leads and prove craft through speed, clarity of data and well-made motion.

Product truth lives in `PRODUCT.md`. The visual system lives in `DESIGN.md` (plus `.impeccable/design.json`). Route-level strategy lives in `.impeccable/surfaces/`. Do not contradict them; update them when a decision changes.

```
frontend/            Nuxt 4 site (the only thing browsers load)
backends/rust-api    Axum public API: projects, clients, GitHub data, contact, system status
backends/python-api  FastAPI worker: GitHub sync jobs (scheduled + public with SSE)
backends/postgres    Schema, roles and seed SQL
docker-compose*.yml  Local and production stacks (Coolify)
```

## Frontend stack (fixed by the owner)

- **Nuxt 4** (`app/` directory layout, Nitro server), **Vue 3**, **TypeScript strict**.
- **TailwindCSS 4** via `@tailwindcss/vite`; design tokens are CSS variables in `app/assets/css/main.css` (`@theme`).
- **Lucide** icons through `@lucide/vue` only. No other icon sets, no emoji as icons.
- Supporting modules: `@nuxtjs/i18n`, `@nuxt/image`, `@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-schema-org`, `lenis` (smooth scroll). The signature motion (the stage entrance in `HomeHero.vue`, the Vestta screen turning in perspective, the contribution graph lighting up, the security sheet checking each header, `v-reveal` on section headings) is hand-written with WAAPI, `requestAnimationFrame`, `IntersectionObserver` and CSS variables; `gsap` is installed but unused, so reach for it only when a sequence truly needs a timeline.
- Package manager: **npm** (the Dockerfile runs `npm ci`). npm 12 blocks install scripts: approve new ones with `npm install-scripts approve <pkg>`; never disable the policy globally.

## Commands

```bash
cd frontend
npm install
npm run dev        # http://localhost:3001 (port 3001 matches the Python API CORS allowlist)
npm run build      # production build -> .output/
npm run preview    # serve the build
npm run typecheck
```

In dev the browser writes to the backends through the Nuxt server (`/_backend/rust`, `/_backend/python`, see `nitro.devProxy` and `useBackendBase()`), so they work on any port; if 3001 is taken (the Docker frontend uses it) `npm run dev` moves to 3000. Dev reads are cached for 2 s only. Production still calls the backends directly.

Bump `ICON_VERSION` in `nuxt.config.ts` when the favicon or app icons change; `npm run plates` re-encodes the hero portrait.

On an NTFS mount under WSL, file watching needs polling: `WATCH_POLLING=1 npm run dev`. It is off by default because it makes dev SSR very slow; verifying against `npm run build` + `node .output/server/index.mjs` is faster there.

Backends locally: see `README.md` (`cargo run` in `backends/rust-api`, `uvicorn app:app --port 8080` in `backends/python-api`). Point the frontend at them with `NUXT_PUBLIC_API_BASE` / `NUXT_PUBLIC_PYTHON_API_BASE`.

## Data flow (important)

- **Reads** go browser -> Nuxt server (`frontend/server/api/*`) -> Rust API. Nitro caches every upstream read with stale-while-revalidate (`server/utils/data.ts`). Reason: SSR traffic reaches the Rust API from one IP and the API rate-limits **120 req/min per IP**. Never fetch the Rust API directly from page components during SSR.
- **Writes** go browser -> backend directly, so per-visitor rate limits stay per visitor:
  - `POST {apiBase}/contact` (3 req/min per IP) via `useContactForm()`.
  - `POST {pythonApiBase}/public/jobs/{repo_sync|profile}/run` and SSE `GET /public/jobs/{id}/events` via `usePublicJob()`.
- CORS: Rust accepts `https://impablo.dev` and any `http://localhost:*`; Python accepts `https://impablo.dev`, `https://www.impablo.dev` and `http://localhost:3001` only.
- API contracts are typed in `frontend/shared/types/api.ts`. If a backend model changes (`backends/rust-api/src/repositories/modules.rs`), update those types and the Nitro mappers together.

| Nitro route | Source | Cache |
| --- | --- | --- |
| `/api/overview` | projects + clients + repos + profile + status | per source |
| `/api/projects`, `/api/projects/:slug` | `GET /projects` (+ clients, repos) | 10 min fresh, SWR |
| `/api/clients` | `GET /clients` | 30 min, SWR |
| `/api/github/profile` | `GET /github/me`, summarised contributions | 10 min, SWR |
| `/api/github/repos` | `GET /github/repositories` + language shares | 10 min, SWR |
| `/api/status` | `GET /system/status` (can take ~5 s: SMTP probe) | 20 s, SWR |

## Routing, i18n and SEO

- Locales: `es` (default, no prefix) and `en` (`/en/...`). Localised slugs are declared once in `nuxt.config.ts` (`i18n.pages`, `customRoutes: 'config'`). Add a page there whenever you add one under `app/pages/`.
- Always link with `localePath()` / `<NuxtLinkLocale>`; never hard-code `/en`.
- UI strings live in `frontend/i18n/locales/{es,en}.json`. Case-study content comes from the database in Spanish only; on `/en` show it with a clear "written in Spanish" note rather than machine-translating it.
- Every page sets title, description, canonical and OG through `useSeoMeta` and adds JSON-LD with `useSchemaOrg` where relevant (Person, ProfessionalService/LocalBusiness, Service, CreativeWork, BreadcrumbList, FAQPage only when the FAQ is visible on the page).
- Service landing pages target real queries (DataForSEO, Spain): "diseño web ibiza" / "diseñador web ibiza" (~140/mo, low competition), "desarrollo software a medida" (~50), "crm a medida" (~40), "programador freelance" (~90), "web design ibiza" (EN). Keep one primary intent per URL.
- Never fabricate testimonials, ratings, prices, client results or certifications (see `PRODUCT.md` › Evidence on Hand).

## Performance budget

- LCP < 2.0 s on a mid-range phone over 4G, CLS < 0.05, INP < 150 ms.
- Images through `<NuxtImg>`/`<NuxtPicture>` (AVIF/WebP, explicit width/height, `sizes`). The hero portrait is preloaded; everything else is lazy.
- Project screenshots hosted on Cloudinary skip IPX and are resized at Cloudinary's edge (`app/utils/cloudinary.ts`). Never route `/_ipx/**` through the SWR route cache: it stores binary bodies as `{}`.
- `/media`, `/covers`, `/logos` and `/certificates` are mirrored on Bunny (`https://cdn.impablo.dev`, same paths) and rewritten by `useCdn()`; dev uses the local files and `NUXT_PUBLIC_CDN_BASE` overrides the host. After adding a file run `npm run cdn` (credentials in `frontend/.env`). Never change a file in place, rename it: edges and browsers keep it for 30 days. The hero plate and the fonts stay on the site's own origin so first paint needs one connection.
- Fonts are Gantari (all text, including the PABLO wordmark) and Azeret Mono (only for literal HTTP headers in the security sheet), self-hosted in `public/fonts` with `@font-face` in `app/assets/css/main.css`, latin subsets, `font-display: swap`, metric-matched fallbacks; Gantari is preloaded. The P mark and the PABLO lockup are the only binding brand elements; the brand kit's lime/paper palette was retired in the dark redesign.
- GSAP and Lenis load client-side only and must never block first paint. Content is visible without JavaScript and without motion.
- Every animation respects `prefers-reduced-motion` (render the final state).

## Code conventions

- Vue SFCs with `<script setup lang="ts">`; components in PascalCase under `app/components/<area>/`.
- Composables in `app/composables/` (`useX`), pure helpers in `app/utils/`, server-only helpers in `server/utils/`.
- Tailwind utilities first; component-scoped `<style>` only for things utilities cannot express (SVG filters, keyframes, masks).
- Accessibility floor: WCAG 2.2 AA, visible focus, semantic landmarks, labelled form controls, live regions for async status.
- Keep backend code untouched unless the task is explicitly about the backend.
- Security headers are defined once in `shared/security-headers.ts`: the middleware (`server/middleware/security-headers.ts`) sends them and the home security sheet renders and re-checks the same list. Add or change a header there only.
- Work that is built but not yet public is listed in `shared/unpublished.ts`; those clients are shown without a link.

## Design workflow

Design work goes through the Impeccable skill (`/impeccable`): it reads `PRODUCT.md`, `DESIGN.md` and the surface briefs. SEO/GEO work goes through `/claude-seo:seo-geo` (DataForSEO, GSC and Bing Webmaster Tools are available to the owner's agents).
