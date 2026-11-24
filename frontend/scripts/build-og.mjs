// Renders the link-preview cards (public/og/stage-<locale>.jpg) from the home hero:
// same plate, same type and the headline in i18n/locales.
//
// Run after changing the hero photo, its headline or the logo:  npm run og
// Needs Chrome (CHROME_PATH, or google-chrome in the PATH). Social networks keep a
// card for days: bump OG_VERSION in app/utils/ogCard.ts afterwards.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

const CHROME = process.env.CHROME_PATH ?? 'google-chrome'
const WIDTH = 1200
const HEIGHT = 630

const data = (path, type) => `data:${type};base64,${readFileSync(path).toString('base64')}`
const plate = data('public/plates/pablo-hero.jpg', 'image/jpeg')
const font = data('public/fonts/gantari-latin.woff2', 'font/woff2')
const mark = readFileSync('app/components/brand/BrandMark.vue', 'utf8').match(/ d="([^"]+)"/g).join('/><path')

const page = (locale, lines) => `<!doctype html><html lang="${locale}"><meta charset="utf-8"><style>
@font-face { font-family: Gantari; src: url(${font}) format("woff2"); font-weight: 100 900 }
* { margin: 0; box-sizing: border-box }
body { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #0c0b0a; color: #eeeae3; font-family: Gantari }
img { position: absolute; left: 50%; top: -14px; width: 1290px; transform: translateX(-50%) }
.fall { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 46%, rgb(12 11 10 / 0.62) 68%, #0c0b0a 98%) }
header { position: absolute; inset: 44px 52px auto; display: flex; justify-content: space-between; align-items: flex-start; line-height: 1 }
.logo { display: flex; gap: 0.48em; font-size: 44px; font-weight: 800; letter-spacing: -0.005em }
.logo svg { height: 1.08em }
.logo span { margin-top: -0.11em }
.site { font-size: 32px; font-weight: 600; letter-spacing: -0.01em }
h1 { position: absolute; inset: auto 0 40px; text-align: center; font-size: 92px; font-weight: 720; line-height: 0.94; letter-spacing: -0.032em; white-space: nowrap }
h1 span { display: block }
</style>
<img src="${plate}" alt=""><div class="fall"></div>
<header><div class="logo"><svg viewBox="0 0 138 150" fill="currentColor"><path${mark}/></svg><span>PABLO</span></div><div class="site">impablo.dev</div></header>
<h1>${lines.map(l => `<span>${l}</span>`).join('')}</h1>
<script>
document.fonts.ready.then(() => {
  const h1 = document.querySelector('h1')
  for (let size = 92; Math.max(...[...h1.children].map(s => { const r = document.createRange(); r.selectNodeContents(s); return r.getBoundingClientRect().width })) > ${WIDTH - 104}; size--) h1.style.fontSize = size + 'px'
})
</script>`

const dir = mkdtempSync(join(tmpdir(), 'og-'))
try {
  for (const locale of ['es', 'en']) {
    const { hero } = JSON.parse(readFileSync(`i18n/locales/${locale}.json`, 'utf8'))
    const html = join(dir, `${locale}.html`)
    const png = join(dir, `${locale}.png`)
    writeFileSync(html, page(locale, hero.lines))
    execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=2', `--window-size=${WIDTH},${HEIGHT}`, '--virtual-time-budget=4000', `--user-data-dir=${join(dir, 'profile')}`, `--screenshot=${png}`, `file://${html}`], { stdio: 'ignore' })
    const { size } = await sharp(png).resize(WIDTH, HEIGHT).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(`public/og/stage-${locale}.jpg`)
    console.log(`stage-${locale}.jpg ${Math.round(size / 1024)} KB`)
  }
}
finally {
  rmSync(dir, { recursive: true, force: true })
}
