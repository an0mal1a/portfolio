/** Folders mirrored on the CDN by `npm run cdn` (keep in sync with scripts/upload-cdn.mjs). */
const MIRRORED = /^\/(media|covers|logos|certificates)\//

/**
 * Rewrites a mirrored public path to the CDN (`public.cdnBase`). Anything else, and
 * everything in dev where the base is empty, is returned untouched. The hero plate and
 * the fonts stay on the site's own origin: a second connection would delay first paint.
 */
export function useCdn() {
  const { public: { cdnBase } } = useRuntimeConfig()
  return (path: string) => (cdnBase && MIRRORED.test(path) ? `${cdnBase}${path}` : path)
}
