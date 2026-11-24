// Renders the site icons from one drawing: the P mark in tally on film black.
// The mark's geometry comes from the brand kit and never changes.
// Run after changing colours:  npm run icons   (then bump ICON_VERSION in nuxt.config.ts,
// browsers keep favicons for a long time).
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const GROUND = '#0C0B0A'
const TALLY = '#FF4D2E'
const MARK = 'M 0,0 H 104 L 140,34 V 46 H 0 Z M 0,72 H 140 V 84 L 106,118 H 0 Z M 0,0 H 38 V 172 H 0 Z'

/** `radius` in a 256 box (0 for icons the system masks itself), `scale` of the 140x172 mark. */
const svg = (radius, scale) => {
  const x = (256 - 140 * scale) / 2
  const y = (256 - 172 * scale) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="Pablo Diez"><rect width="256" height="256" rx="${radius}" fill="${GROUND}"/><path transform="translate(${+x.toFixed(2)} ${+y.toFixed(2)}) scale(${scale})" fill="${TALLY}" fill-rule="nonzero" d="${MARK}"/></svg>`
}

const png = (source, size) => sharp(Buffer.from(source), { density: 72 * Math.max(1, size / 128) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

/** ICO container holding PNG frames. */
function ico(frames) {
  const head = Buffer.alloc(6 + 16 * frames.length)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(frames.length, 4)
  let offset = head.length
  frames.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i
    head.writeUInt8(size % 256, at)
    head.writeUInt8(size % 256, at + 1)
    head.writeUInt16LE(1, at + 4)
    head.writeUInt16LE(32, at + 6)
    head.writeUInt32LE(data.length, at + 8)
    head.writeUInt32LE(offset, at + 12)
    offset += data.length
  })
  return Buffer.concat([head, ...frames.map(f => f.data)])
}

const tab = svg(54, 1) // larger mark than the touch icon: it must read at 16px
const touch = svg(0, 0.82)

await writeFile('public/favicon.svg', `${tab}\n`)
await writeFile('public/favicon.ico', ico(await Promise.all([16, 32, 48].map(async size => ({ size, data: await png(tab, size) })))))
await writeFile('public/apple-touch-icon.png', await png(touch, 180))
await writeFile('public/icon-512.png', await png(touch, 512))
console.log('icons written')
