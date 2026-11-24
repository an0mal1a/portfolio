---
name: Pablo Diez
description: A product keynote for one independent builder, on a warm film-black stage.
colors:
  ground: "#0c0b0a"
  raise: "#151311"
  raise-2: "#1e1b18"
  ink: "#eeeae3"
  ink-2: "#cfc9bf"
  mute: "#8a847b"
  faint: "#57524b"
  line: "rgb(238 234 227 / 0.12)"
  line-strong: "rgb(238 234 227 / 0.24)"
  ink-wash: "rgb(238 234 227 / 0.08)"
  ink-wash-hover: "rgb(238 234 227 / 0.14)"
  tally: "#ff4d2e"
  tally-hover: "#ff6a4f"
  on-tally: "#0c0b0a"
  error: "#f4a08d"
  screen-paper: "#f4f3f0"
typography:
  display:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, min(6.37vw, 10.2svh), 5.5rem)"
    fontWeight: 720
    lineHeight: 0.9
    letterSpacing: "-0.032em"
  page:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.2rem + 5vw, 5.25rem)"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 4vw, 4.5rem)"
    fontWeight: 750
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 3rem)"
    fontWeight: 720
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  item:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.95rem + 0.5vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Gantari, Gantari Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  mono:
    fontFamily: "Azeret Mono, Azeret Fallback, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  check: "0.375rem"
  field: "0.75rem"
  screen: "clamp(0.625rem, 0.4rem + 0.6vw, 1rem)"
  panel: "1.25rem"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 5vw, 5rem)"
  section: "clamp(6rem, 3.5rem + 9vw, 11.25rem)"
  header: "clamp(4.25rem, 3.6rem + 1.6vw, 5.5rem)"
  container: "90rem"
components:
  button-primary:
    backgroundColor: "{colors.tally}"
    textColor: "{colors.on-tally}"
    rounded: "{rounded.pill}"
    height: "3.25rem"
    padding: "0 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.tally-hover}"
    textColor: "{colors.on-tally}"
  button-ghost:
    backgroundColor: "{colors.ink-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "3.25rem"
    padding: "0 1.6rem"
  button-ghost-hover:
    backgroundColor: "{colors.ink-wash-hover}"
  icon-button:
    backgroundColor: "{colors.ink-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "2.75rem"
  chip:
    backgroundColor: "rgb(238 234 227 / 0.06)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
    padding: "0 1.1rem"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  input:
    backgroundColor: "rgb(238 234 227 / 0.04)"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.8rem 1rem"
  panel:
    backgroundColor: "{colors.raise}"
    rounded: "{rounded.panel}"
    padding: "clamp(1.5rem, 3.5vw, 3rem)"
  screen:
    backgroundColor: "{colors.screen-paper}"
    rounded: "{rounded.screen}"
---

# Design System: Pablo Diez

## Overview

**Creative North Star: "The Keynote Stage"**

One independent builder presents his own work on a dark stage. The ground is warm film black, the type is a warm off-white, and the only colour in the room is a single red-orange tally light that means "act here" or "this is live". Shipped products walk on as real recordings playing on screens, never as illustrations or mockups. Depth comes from light: a warm key light on the portrait, screens glowing on black with a soft floor reflection, raised panels that catch a hairline of light along their top edge.

Density is low and air is generous: one idea per section, one heading size for every story beat, large centred or split compositions rather than grids of tiles. Type does the heavy lifting: a heavy, tight geometric grotesk (Gantari) set big, with a quiet body below it. The system refuses the dark-dev-portfolio template (glass cards, stack-logo walls, gradient text, terminal theatre) and the cold luxury agency.

Motion is choreographed and earned: the stage entrance ("Mezcla"), the Vestta screen that turns towards the visitor, headings that rise in once, a contribution graph that lights up column by column. Everything renders its final state without JavaScript and under reduced motion.

**Key Characteristics:**
- Warm film-black ground (no pure black, no cool greys); ink and greys share one warm hue.
- One accent, tally, reserved for the primary action and live data.
- Gantari everywhere; Azeret Mono only for literal machine text.
- Fully rounded pills for every control; softly rounded screens and panels.
- Real product recordings on "screens"; one portrait under a key light.
- Hairline rules divide content; there are no card grids.

## Colors

A warm monochrome stage with one signal colour.

### Primary
- **Tally Red-Orange** (`tally`): the one colour. The primary action pill ("Cuéntame tu proyecto"), the skip link, text selection, the input caret, and live data only: the operational status dot (footer, "built daily"), today's cell in the contribution graph, a security header confirmed as received, lab sync progress and live stops in the lab's request path. 5.95:1 against ground. Hover lifts to **Tally Glow** (`tally-hover`). Text on tally is ground (`on-tally`, 5.95:1).

### Neutral
- **Film Black** (`ground`): the stage. Page background, header when solid, mobile sheet.
- **Raised Black** (`raise`): one step up. Panels (security sheet, contact form, service process, lab system panel, about stack, the English-content note) and the project-figure fallback.
- **Raised Black Hover** (`raise-2`): inline code backgrounds in case prose; hover on raised surfaces.
- **Warm Ink** (`ink`): headings, primary text, active nav, selected chips, checked boxes, focus outline, the brand lockup (16.4:1 on ground).
- **Warm Ink 2** (`ink-2`): body copy, leads, secondary links, pitch text (12.0:1).
- **Warm Mute** (`mute`): captions, meta lines, labels, breadcrumbs, readouts. Passes AA as text: 5.31:1 on ground, 5.0:1 on raise.
- **Warm Faint** (`faint`): non-text marks only (idle status dots, breadcrumb chevrons, the fallback P mark). About 2.5:1; never set text in it.
- **Hairline** (`line`) and **Strong Hairline** (`line-strong`): row dividers, header underline, field borders; `line-strong` for field hover, the checkbox border and the "in progress" outline badge.
- **Ink Wash** (`ink-wash`, hover `ink-wash-hover`): the fill of every quiet round control: ghost pill, rail arrows, service row chevron, FAQ toggle.
- **Screen Paper** (`screen-paper`): the light letterbox behind product recordings while they load.

### Semantic
- **Warm Error** (`error`): field errors, failed sends, degraded/down status dots, missing security headers. Warm so it belongs, pale so it never passes for the action colour (9.6:1).

### Named Rules
**The One Tally Rule.** Tally marks exactly two things: the primary action and live data. Never a heading, an icon, a border, a hover tint, a highlight or decoration. If a screen shows tally on something that is neither, it is wrong.

**The Faint Is Not Text Rule.** `faint` (about 2.5:1) is for marks only. Any readable text uses `mute` or brighter.

## Typography

**Display / Body Font:** Gantari (variable 100-900, self-hosted, with a metric-matched Arial fallback)
**Mono Font:** Azeret Mono (variable, self-hosted, with a Courier New fallback)

**Character:** A heavy, tightly tracked geometric grotesk at keynote scale over a calm body in the same family. Weight carries hierarchy (720-760 for headings, 600-700 for labels and links, 400 for prose), not colour or case.

### Hierarchy
- **Display** (720, `clamp(2.75rem, min(6.37vw, 10.2svh), 5.5rem)`, 0.9): the home stage headline only, centred, two lines, `max-width: 24ch` (12ch on phones). Every size on the stage (lead 22px max, pill 60px/20px max, stage header) follows the smaller of width and height and stops at the approved hybrid's scale: the owner found the comp-scale type too big on a 2K monitor, and on wide-but-short screens it pushed the headline into the face.
- **Page** (760, `clamp(2.5rem, 1.2rem + 5vw, 5.25rem)`, 0.98): the h1 of every inner page (projects, case, about, lab, privacy). Service landings and the contact close use the same weight at their own clamp.
- **Headline** (750, `clamp(2.25rem, 1.2rem + 4vw, 4.5rem)`, 1.02): every home section heading. One size for every story beat.
- **Title** (720, `clamp(1.75rem, 1.2rem + 2vw, 3rem)`, 1.04): headings inside an inner page section. Service names in the home index use the same scale at a slightly larger clamp.
- **Item** (700, `clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem)`, 1.25): row and list item headings (for-whom, included, FAQ questions at 650, work rail names at 1.375rem).
- **Lead** (400, `clamp(1.0625rem, 0.95rem + 0.5vw, 1.3125rem)`, 1.5, `ink-2`): the paragraph under a section heading, 44-60ch.
- **Body** (400, 1.0625rem, 1.55): prose, 44-64ch.
- **Label** (600, 0.875rem): form labels, footer column titles, meta and readouts (meta at 400 in `mute`).
- **Mono** (400-500, 0.8125rem, 1.65): literal HTTP header lines and the response line in the security sheet; inline `code` in case-study prose.

All headings get `text-wrap: balance`; paragraphs `text-wrap: pretty`. Numbers in data, meta and limits use tabular figures.

### Named Rules
**The Literal Mono Rule.** Azeret Mono appears only where the text is literally machine text (an HTTP header line, a response line, inline code). Never as a "technical" costume for labels, numbers, nav or captions.

**The No Label-Above Rule.** Headings stand alone. No eyebrow, kicker, overline or section number above them, and no uppercase tracked labels anywhere.

## Layout

- **Container:** `container-x`, max 90rem, side padding `--gutter` (`clamp(1rem, 5vw, 5rem)`), giving 16px on a 390px phone.
- **Section rhythm:** every section opens with `padding-top: var(--section)` (`clamp(6rem, 3.5rem + 9vw, 11.25rem)`). The contact close also carries it at the bottom.
- **Header:** fixed; `--header-h` (`clamp(4.25rem, 3.6rem + 1.6vw, 5.5rem)`) when solid. Anchors scroll with `scroll-padding-top: header + 1rem`.
- **Compositions:** centred heading + lead for the stage, work and security; asymmetric splits otherwise (5fr / 7fr for Vestta, contact and the footer; 7fr / 5fr for page intros and the built-daily head; 4fr / 8fr for FAQ). Splits collapse to one column below 64rem.
- **Lists as rows:** services, FAQs, "included", security headers and footer bottom are full-width rows separated by hairlines, not tiles. Where columns are used (for-whom, process steps, Vestta facts), each item hangs from a top hairline.
- **Overflow on purpose:** the Vestta screen runs past the right edge (`margin-right: calc(-1 * gutter - 18vw)`); the work rail scrolls horizontally with scroll-snap (items `min(45rem, 82vw)`, 86vw on phones) and scroll padding equal to the gutter.
- **Breakpoints in use:** 35rem, 40rem, 48rem, 56rem, 64rem (`lg`, the desktop switch for nav and splits), 72rem. Extra Tailwind breakpoints `xs` 24rem and `3xl` 112rem exist.
- Verify at 390px and 1440px. No horizontal page scroll; only the rail and the contribution graph scroll sideways, inside themselves.

## Elevation & Depth

Depth comes from light, not borders. Surfaces are flat colour steps (`ground` to `raise`); things that sit on the stage get a long, soft drop shadow pulled far below them plus a 1px inset top highlight, as if lit from above. There are no hover lifts.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 0 rgb(238 234 227 / 0.06) inset, 0 40px 80px -40px rgb(0 0 0 / 0.9)`): every raised panel.
- **Screen** (`box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 36px 70px -24px rgb(0 0 0 / 0.85)`; rail and figures use `0 30px 60px -28px` / `-30px`): product recordings and project figures.
- **Floor reflection**: under each work-rail screen, the poster flipped vertically, 20% opacity, 6px blur, masked to fade out within 4.375rem.
- **Key light**: the stage portrait fades to `ground` under the headline (gradient from 44% to 97%), and on fine pointers a warm radial light (`rgb(255 196 150 / 0.09)`, screen blend) follows the cursor a little.

### Named Rules
**The Light-Not-Lines Rule.** Depth is carried by light (inset highlight, long soft shadow, key light). Never a coloured glow, never glass or backdrop blur, never a decorative border around a container.

## Shapes

- **Pills (999px)** for every control: buttons, chips, round icon buttons (2.25-2.75rem), status dots, progress bars, the "in progress" badge.
- **Screens** (`--radius-screen`, 10-16px fluid): product recordings, project figures, the empty graph placeholder.
- **Panels** (`--radius-panel`, 20px): raised sheets.
- **Fields** (12px) and the checkbox (6px). Graph cells are 10px squares with 2.5px corners.
- **The P mark** is fixed geometry from the brand kit. A chamfered top bar, a vertical foot and a rising middle section form the three separated pieces shown in the kit's `brandboard.png`. The site lockup uses `ink` on dark grounds. The favicon, app icons, accent variants in the brand kit and social cards use Signal Orange (`#FF4D2E`).

## Components

### Buttons
Keynote pills: solid, confident, never outlined.
- **Shape:** fully rounded (999px), weight 700, tracking -0.01em, line-height 1.
- **Primary (tally):** `tally` with `on-tally` text. Sizes: sm 2.375rem / 0.9375rem, md 3.25rem / 1rem, lg fluid up to 4.5rem / 1.5rem. One per screen region; it is the contact action (or the form submit).
- **Ghost:** `ink-wash` fill, `ink` text, weight 600. The quiet companion ("Ver el caso").
- **States:** hover changes fill only (tally to tally-hover, wash to wash-hover); a trailing Lucide icon nudges 0.15em right; active scales to 0.98; disabled 50% opacity. Focus is the global 2px `ink` outline at 4px offset.

### Links
- **Link more:** weight 600, `ink` (or `ink-2` when secondary), no underline, a trailing Lucide chevron that slides 3px right on hover. The default way to lead somewhere.
- **Link quiet:** inline text link whose 1px underline fades in on hover (0.25em offset).

### Chips
- **Style:** pill, 2.5rem high, 0.9375rem / 600, `ink-2` on a 6% ink wash.
- **State:** hover 12% wash and `ink`; selected inverts to `ink` fill with `ground` text. Used as the radio group for project kind in the contact form.

### Panels
- **Corner:** 20px. **Background:** `raise`. **Shadow:** Panel. **Border:** none. **Padding:** `clamp(1.5rem, 3.5vw, 3rem)` (process panel up to 4rem).
- The only container style. One panel per section at most; content inside is divided by hairlines, never by nested cards.

### Inputs / Fields
- **Style:** 12px radius, 1px `line` border, 4% ink wash, 1.0625rem text, `mute` placeholders, tally caret.
- **Focus:** border goes to `ink`, wash to 6%, plus a 3px `rgb(238 234 227 / 0.12)` ring.
- **Error:** border and message in `error`; messages are live (`role="alert"`) and hidden when empty. Checkbox: 20px, 6px radius, checks to an `ink` fill with a ground tick.

### Navigation
- **Stage header (home, over the hero):** transparent, logo left at comp scale, five links right (Services, Projects, Lab, About, ES / EN) in `ink` at weight 540. No CTA.
- **Solid header (past 72% of the stage, or any other page):** `ground` with a hairline underline, compacts to `--header-h`, links in `ink-2` (hover and active `ink`), and the small tally pill fades in.
- **Mobile (below 64rem):** a round menu button opens a full-height `ground` sheet with links at 2.5rem / 700 and a large tally pill at the bottom.
- **Breadcrumbs:** 0.9375rem `mute`, `faint` chevrons, current page in `ink-2`.

### Screen (product recording)
A real recording of a shipped product (`frontend/public/media/<name>.{av1.mp4,mp4,jpg}`): AV1 first, H.264 fallback, poster always. Muted, looping, inline, `preload="none"`; it loads and plays only while 35% visible and pauses off screen. Under reduced motion it stays on its poster with native controls. 16:10, `screen` radius, Screen shadow, `screen-paper` behind.

### Stage (home hero)
Full-height (`max(100svh, 40rem)`), the portrait covering the stage from the top, the centred display headline over the chest, lead in 90% ink, then the large tally pill and a "Ver proyectos" link-more. Nothing else above the fold.

### Issuer marks (hero)
Hack4u, Mastermind and Rustlang en Español in the site's ink under the hero actions, at 0.6 opacity, full on hover; one link to the certificates on About. Wide screens show the marks alone; phones add a hairline and "Formación certificada", which goes on phones shorter than 45rem. They never outweigh the two actions (owner decision, 2026-11-24).

### Certificate (About)
The issuer's real document in a 10:7 frame (`--radius-screen`, dimmed to 0.86, full light on hover), then name, issuer · date · hours in mute, what it covered in ink-2, the owner's note at 600 in ink, and the verification link. One certificate leads at 7/5; the rest are two columns, no card around them. Hack4u's 3:2 documents are shown whole on black. The document opens in a `<dialog>`; without JavaScript the link opens the image.

### Client stage (About)
Logo centred over a still of the client's own site, defocused (blur 7px) and dimmed to 0.36; under a mouse the logo leaves, the still sharpens and the recording plays. Name bottom left, public address bottom right; an unpublished site shows the name only. Clients without a recording are ruled rows: ink-tone logo, name, address.

### Client logo
Set in one ink tone on transparent, about 2rem tall, beside the client's name (home rail, case facts). A client's own accent may stay when it is the mark itself (Post's red dot). `frontend/public/logos`, declared in `app/content/showcase.ts`. Clients without a usable mark show the name alone.

### Project cover
A project with no interface to record gets one sober still in the site's light (film black, warm key, at most one tally point): `frontend/public/covers`. Never a stock image, never hacker theatre.

### Shop window (home services)
One panel. Left: the three services as vertical tabs at title scale (`mute`, `ink` when picked, hairline between), then the picked service's pitch and a ghost pill. Right: a screen that plays real work of that kind, pills with the projects' names under it, and a link to the case. A resting pointer (140ms) previews; click or arrow keys pick. Screens cut: the new one comes up from 30% brightness over the old. Tabs are links, so without JS they open the landing.

### Project premiere (case page)
Centred page h1, tagline and actions; then the recording starts at 70% width and grows to the edges (cap 106rem) as it rises under the header, held there for 28svh (64rem and up; phones grow from 90%, reduced motion shows it static). Facts follow as one row of ruled columns. The case reads in chapters (its h2s) with a sticky index whose current chapter is `ink`; lists become hairline rows and a blockquote is set large at 700. The next project waits at the end as a huge name beside its screen, turned 16 degrees, which faces you on hover. Opening a project from the grid or from that link grows its screen into place (`view-transition-name: project-screen`).

### Repository explorer (lab)
Language chips, search and sort in one row over the list. Each row is a repository with its name, description, language, stars and forks and a line on a shared year axis from creation to last push: 50% ink, full ink when it moved in the last 60 days. Repositories kept off the site are listed in `app/content/repos.ts`.

### Security sheet
A panel whose header is the literal response line in mono (`HTTP 200 · impablo.dev`) and whose rows are literal header lines in mono with a plain-language explanation beside them. Each row's dot: `ink-2` configured (server render), `faint` pending, `tally` received, `error` missing.

### Contribution graph
A year of GitHub contributions as 10px cells: five steps of ink wash (6%, 20%, 38%, 62%, full ink), today in tally. Pointing at a day rings it and floats an `ink` label with its count and date, as on GitHub; a less/more legend sits below. In the lab, the weekday and month bars under it are toggles: the picked one is full ink, every other day drops to 22%, and the sentence under the graph is rewritten.

### Status dot
7-8px pill. `faint` while checking, `tally` when operational (it breathes at 2.4s in the built-daily line), `error` when degraded or down. Always next to text that says the same thing, inside an `aria-live` region.

### Motion
- **Eases:** `--ease-out-expo` for movement, `--ease-out-quart` for colour and opacity, `--ease-in-out-expo` for the stage settle.
- **Stage entrance "Mezcla":** headline words rise from 118% (75ms stagger), the headline settles from large-and-centred into place while the portrait rises out of black (opacity 0 to 1 together with brightness from 15%, 1.9s; the owner found brightness alone too abrupt), then lead and actions arrive out of 8px blur, then the nav. A pre-paint flag holds the start pose only when JS runs and motion is allowed; a CSS failsafe reveals everything at 2.8s; if hydration lands after 2.6s the entrance is skipped.
- **v-reveal:** headings and leads rise 1.75rem out of a 6px blur once, staggered 110ms, and only when they start below the fold.
- **Scroll-driven:** the Vestta screen turns from 30 to 12 degrees as it reaches the middle of the viewport (64rem and up only).
- **Reduced motion:** every transition and animation collapses to its final state; videos stay on posters; graphs and sheets render whole.

## Do's and Don'ts

### Do:
- **Do** keep tally for the primary action and live data only (status dots, today's graph cell, received security headers, lab sync progress).
- **Do** set every readable text in `ink`, `ink-2` or `mute`; keep `faint` for non-text marks.
- **Do** use one heading size per level (`h-section` for home beats, `h-page` for page h1s, `h-sub` inside pages) and let the heading stand alone.
- **Do** show real material: product recordings from `public/media` (AV1 + H.264 + poster), real API data, the real portrait.
- **Do** separate content with hairline rows and top rules; use at most one raised panel per section.
- **Do** make every control a pill, with Lucide icons (`@lucide/vue`) only.
- **Do** render the final state on the server, without JS and under reduced motion; hold animations back only for content that starts below the fold.

### Don't:
- **Don't** use tally on headings, icons, borders, hovers or decoration.
- **Don't** put eyebrows, kickers, overlines, section numbers or uppercase tracked labels above or beside headings.
- **Don't** use gradient text, glass or backdrop blur, coloured glows, or decorative borders around containers.
- **Don't** build identical card grids or a hero-metric template (big number, small label, repeated).
- **Don't** use Azeret Mono outside literal machine text.
- **Don't** use pure black or cool greys; the neutrals are all warm.
- **Don't** stretch, rotate, outline, shadow or apply custom colours to the P mark.
- **Don't** use hacker theatre (green terminals, glitch, matrix), illustrations of products, or stock imagery.

## Hero portrait

- **Plate.** `frontend/public/plates/pablo-hero.jpg` (2400x1500, 16:10, the master) is the photo layer of the owner-approved mock `.impeccable/explore/round2/3-mezcla-foto-keynote.png`. Everything above the headline keeps that mock's pixels unchanged; only the T-shirt, shoulders and arms behind the text were reconstructed. Sources are in `.impeccable/photo-brief/round2/`, the composition guides in `.impeccable/photo-brief/guias.png`. The owner rejected the flatter, more heavily graded version in `.impeccable/photo-brief/salida/` ("looks like a ghost"): keep the arms readable behind the text.
- **Served as static files, not through IPX.** `npm run plates` (`frontend/scripts/build-plates.mjs`) encodes the master into `public/plates/hero/` (AVIF and WebP at 640-2400px, JPEG 1600 fallback, quality 85 because phones magnify the face ~2.5x). IPX keeps no server-side cache, so the same hero through `/_ipx` took 5-7s on every first visit. Rerun the script after replacing the master and keep its widths in sync with `HomeHero.vue`.
- **Composition to keep when replacing it.** Eye line at y 390 (26%), gap between the eyes on x 1200, chin no lower than y 700 (46.7%) because the headline can start at 48% on short screens, whole head inside x 835-1565 (the strip a 360-390px phone shows), everything black from about 60% down. Give a replacement a new filename: `/plates/**` is cached for 30 days.
- **Never ship** the placeholder of a different person kept as `.impeccable/photo-brief/placeholder-otra-persona.png`.
