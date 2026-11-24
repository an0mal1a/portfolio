// Project screenshots live on Cloudinary. Resizing them through IPX meant a cold
// fetch of the original from our own server, which failed intermittently under
// load. Cloudinary resizes at its edge instead: we only rewrite the URL.

const UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/
const SCREENS: Record<string, number> = { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1600 }
const WIDTHS = [480, 720, 960, 1280, 1600, 2000]

export function isCloudinary(url: string | null | undefined): url is string {
  return !!url && UPLOAD.test(url)
}

/** Cloudinary URL scaled to `width` (never upscaled), auto format and quality. */
export function cloudinaryUrl(url: string, width: number): string {
  const m = url.match(UPLOAD)
  if (!m) return url
  return `${m[1]}c_limit,w_${width},f_auto,q_auto/${m[2]}`
}

export function cloudinarySrcset(url: string): string {
  return WIDTHS.map(w => `${cloudinaryUrl(url, w)} ${w}w`).join(', ')
}

/** Turns @nuxt/image sizes ("xs:100vw md:720px lg:1400px") into a standard sizes attribute. */
export function toSizesAttr(sizes: string): string {
  const parts = sizes.trim().split(/\s+/).map((p) => {
    const [bp, value] = p.includes(':') ? p.split(':') as [string, string] : ['', p]
    return { min: bp ? SCREENS[bp] ?? 0 : 0, value }
  })
  parts.sort((a, b) => b.min - a.min)
  return parts.map(p => (p.min > SCREENS.xs! ? `(min-width: ${p.min}px) ${p.value}` : p.value))
    .filter((v, i, all) => !(i < all.length - 1 && !v.startsWith('(')))
    .join(', ')
}
