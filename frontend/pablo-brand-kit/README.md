# PABLO — Independent Builder

Brand identity starter kit for Pablo's personal brand.

## Core idea

**PABLO** is the umbrella identity. The descriptor **INDEPENDENT BUILDER** communicates an independent maker who thinks across product, technology and business without locking the brand into a single stack or service.

The visual language combines editorial typography, modular geometry and a restrained technical vocabulary. The monogram is a custom directional “P” made from two forward-facing modules and one continuous vertical spine. It is designed to work independently of the wordmark.

Tagline: **IDEAS INTO SYSTEMS.**

## Included assets

- `brandboard.png` — visual brandboard.
- `brandboard.svg` — editable vector brandboard.
- `assets/logo-main.svg` — primary wordmark for light backgrounds.
- `assets/logo-reversed.svg` — reversed wordmark for dark backgrounds.
- `assets/logo-mark.svg` — standalone brand mark.
- `assets/favicon.svg` — master favicon.
- `assets/favicon.ico` — multi-resolution browser icon.
- `assets/favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-512.png` — PNG favicon sizes.
- `assets/apple-touch-icon.png` — 180px touch icon.
- `assets/palette.svg` / `palette-preview.png` — standalone color palette.
- `assets/typography.svg` / `typography-preview.png` — standalone typography sheet.
- `assets/brand-tokens.css` — CSS variables and Google Fonts import.

## Color palette

| Token | Hex | Role |
|---|---|---|
| Graphite Ink | `#171B1E` | Primary text, dark surfaces, logo |
| Warm Paper | `#F1EEE6` | Main light background |
| Signal Lime | `#D8F16B` | Primary accent and calls to attention |
| Ultramarine | `#5263E8` | Secondary digital accent |
| Oxide | `#B8644D` | Warm supporting accent |

Use Graphite Ink and Warm Paper as the foundation. Signal Lime should remain a signal accent, not a full-page fill. Ultramarine and Oxide are supporting accents; avoid using all three accents at equal intensity in one composition.

## Typography

### Bricolage Grotesque

Primary display and text family. Use 600–800 for headlines, 400–500 for longer copy. It provides the identity's expressive, editorial voice.

Google Fonts: https://fonts.google.com/specimen/Bricolage+Grotesque

### Azeret Mono

Technical and metadata family. Use 400–600 for labels, dates, code-adjacent details, small section headers and overlines. Do not use it for long body paragraphs.

Google Fonts: https://fonts.google.com/specimen/Azeret+Mono

Both are available through Google Fonts. The supplied CSS loads them remotely; install them locally for offline work in design and office applications. Font references and availability are also documented by Google Fonts' ecosystem and design systems. 

## Usage guidance

- Use the complete logo on presentations, proposals, website headers and profile covers.
- Use the standalone mark for avatars, favicon, watermark and small interface placements.
- Keep clear space around the mark at least equal to the width of its vertical spine.
- Do not stretch, rotate, add shadows, outline the mark, or recolor it with arbitrary gradients.
- For dark backgrounds, use `logo-reversed.svg`.
- Prefer generous whitespace, thin rules, modular grids and a small number of strong typographic moments.
- Keep the tone confident and practical. The brand should feel like a builder's studio, not a generic software agency.

## Implementation note

The SVG wordmarks reference the named fonts as font families. For consistent rendering, load the fonts through `brand-tokens.css` or install the fonts on the target machine. The logo mark and favicon are pure vector geometry and are independent of font installation.
