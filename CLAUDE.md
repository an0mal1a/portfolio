# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Use `/impeccable` for every design decision (new surfaces, critique, polish, animate). It loads `PRODUCT.md`, `DESIGN.md` and `.impeccable/surfaces/*` itself; do not redesign outside it.
- Use `/claude-seo:seo-geo` for SEO/GEO work. DataForSEO, Google Search Console and Bing Webmaster Tools are connected.
- Verify UI changes in a real browser (Playwright or Chrome DevTools MCP) at 390 px and 1440 px before calling them done.
- The owner writes in Spanish; reply in Spanish. Code, identifiers and commits stay in English.
- Commit only when asked. Branch `redesign.1` holds the new frontend; `main` is production.
- Many backend files show as modified only because of line endings (WSL on an NTFS mount). Do not "fix" or commit them as part of frontend work.
