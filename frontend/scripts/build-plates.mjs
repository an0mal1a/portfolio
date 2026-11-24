// Pre-encodes the hero plate at every srcset width (AVIF + WebP, plus one JPEG
// fallback) into public/plates/hero/. IPX keeps no server-side cache, so serving
// the hero through /_ipx made every first visit wait 5-7 s for an AVIF encode;
// static files go out immediately.
//
// Run after replacing public/plates/pablo-hero.jpg:  npm run plates
// Keep WIDTHS in sync with HomeHero.vue. Give the files a new name when the photo
// changes: /plates/** is cached for 30 days.
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'public/plates/pablo-hero.jpg'
const OUT = 'public/plates/hero'
const NAME = 'pablo-hero'
const WIDTHS = [640, 960, 1280, 1600, 2000, 2400]
const FALLBACK_WIDTH = 1600
// 85, not the site's usual 72: phones show this plate ~2.5x magnified and lower
// settings smooth the skin texture away.
const QUALITY = 85

await mkdir(OUT, { recursive: true })
for (const width of WIDTHS) {
  const resized = sharp(SRC).resize({ width })
  await resized.clone().avif({ quality: QUALITY, effort: 9 }).toFile(`${OUT}/${NAME}-${width}.avif`)
  await resized.clone().webp({ quality: QUALITY, effort: 6 }).toFile(`${OUT}/${NAME}-${width}.webp`)
  if (width === FALLBACK_WIDTH) await resized.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(`${OUT}/${NAME}-${width}.jpg`)
  console.log(`${NAME}-${width}`)
}
