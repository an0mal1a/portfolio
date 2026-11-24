<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

/**
 * The stage: Pablo in a warm key light, the promise over his chest, the one
 * action below. Entrance ("Mezcla"): the headline rises word by word, large,
 * in the middle of the screen, then settles into place while the key light
 * comes up on the portrait; lead and actions arrive out of blur, then the nav.
 *
 * The server renders the final state. A pre-paint flag (see pages/index.vue)
 * holds the start pose only when JS runs and motion is allowed, and a CSS
 * failsafe reveals everything if the script never takes over.
 */
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const img = useImage()

const lines = computed(() => (tm('hero.lines') as string[]).map(l => rt(l)))
const words = computed(() => lines.value.map(l => l.split(' ')))

// Responsive portrait (the plate). On portrait screens the stage is taller than
// 16:10, so the cover-cropped image renders at ~160vh wide.
const SRC = '/plates/pablo-hero.jpg'
const WIDTHS = [640, 960, 1280, 1600, 2000, 2400]
// Quality 85, not the site's usual 72: phones show this plate ~2.5x magnified and
// lower settings smooth the skin texture away.
const QUALITY = 85
const srcset = (format: string) => WIDTHS.map(w => `${img(SRC, { width: w, format, quality: QUALITY })} ${w}w`).join(', ')
const SIZES = '(max-aspect-ratio: 16/10) 160vh, 100vw'
useHead({
  link: [{ rel: 'preload', as: 'image', type: 'image/avif', imagesrcset: srcset('avif'), imagesizes: SIZES, fetchpriority: 'high', key: 'hero-portrait' }],
})

const hero = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const light = ref<HTMLElement | null>(null)

const EXPO_OUT = 'cubic-bezier(.16,1,.3,1)'
const EXPO_INOUT = 'cubic-bezier(.87,0,.13,1)'

function entrance(root: HTMLElement) {
  const h1 = title.value
  if (!h1) return
  const anim = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => el.animate(kf, { fill: 'both', ...o })
  const photo = root.querySelector('.stage-photo')
  const nav = document.querySelector('[data-intro-part="nav"]')
  const ins = [...root.querySelectorAll('[data-in]')]
  const spans = [...h1.querySelectorAll('.w > span')]

  // Large in the middle of the screen first, then down into place.
  const r = h1.getBoundingClientRect()
  const lift = window.innerHeight * 0.46 - (r.top + r.height / 2)
  const grow = Math.max(1.06, Math.min(1.45, (window.innerWidth * 0.92) / r.width))
  const settleAt = 1050

  spans.forEach((w, i) => anim(w, [{ transform: 'translateY(118%) rotate(3deg)' }, { transform: 'none' }], { duration: 1100, delay: 150 + i * 75, easing: EXPO_OUT }))
  anim(h1, [{ transform: `translateY(${lift}px) scale(${grow})` }, { transform: 'none' }], { duration: 1300, delay: settleAt, easing: EXPO_INOUT })
  // The portrait rises out of black (opacity and key light together), as in the approved prototype.
  if (photo) anim(photo, [{ opacity: 0, filter: 'brightness(.15)', transform: 'scale(1.06)' }, { opacity: 1, filter: 'brightness(1)', transform: 'none' }], { duration: 1900, delay: settleAt, easing: 'cubic-bezier(.3,0,.2,1)' })
  ins.forEach((el, i) => anim(el, [{ opacity: 0, transform: 'translateY(26px)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 1000, delay: settleAt + 700 + i * 120, easing: EXPO_OUT }))
  if (nav) anim(nav, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: settleAt + 900, easing: 'linear' })
}

onMounted(() => {
  const root = hero.value
  const html = document.documentElement
  // After 2.6 s the CSS failsafe (2.8 s) is about to reveal the stage on its own:
  // a late hydration (slow phone, 4G) must not hide it again to replay the entrance.
  // In that case let the failsafe finish its fade (ends at 3.6 s) before letting go.
  const late = performance.now() >= 2600
  if (root && html.dataset.intro === 'pending' && !late) entrance(root)
  if (late) setTimeout(() => delete html.dataset.intro, Math.max(0, 3600 - performance.now()))
  else delete html.dataset.intro

  // The key light follows a fine pointer a little.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!root || !light.value || reduced || !window.matchMedia('(pointer: fine)').matches) return
  root.classList.add('is-lit')
  let lx = 50, ly = 30, tx = 50, ty = 30, raf = 0
  const tick = () => {
    lx += (tx - lx) * 0.08
    ly += (ty - ly) * 0.08
    light.value?.style.setProperty('--lx', `${lx}%`)
    light.value?.style.setProperty('--ly', `${ly}%`)
    raf = Math.abs(tx - lx) + Math.abs(ty - ly) > 0.05 ? requestAnimationFrame(tick) : 0
  }
  root.addEventListener('pointermove', (e) => {
    const b = root.getBoundingClientRect()
    tx = 50 + ((e.clientX - b.left) / b.width - 0.5) * 30
    ty = 30 + ((e.clientY - b.top) / b.height - 0.5) * 20
    if (!raf) raf = requestAnimationFrame(tick)
  }, { passive: true })
})
</script>

<template>
  <section ref="hero" class="stage" aria-labelledby="hero-title">
    <picture class="stage-photo">
      <source type="image/avif" :srcset="srcset('avif')" :sizes="SIZES">
      <source type="image/webp" :srcset="srcset('webp')" :sizes="SIZES">
      <img
        :src="img(SRC, { width: 1600, format: 'jpg', quality: QUALITY })"
        :alt="t('hero.portraitAlt')"
        width="2400"
        height="1500"
        fetchpriority="high"
        decoding="async"
      >
    </picture>
    <div ref="light" class="stage-light" aria-hidden="true" />

    <div class="stage-copy">
      <h1 id="hero-title" ref="title" class="stage-title">
        <span class="sr-only">{{ t('hero.title') }}</span>
        <span v-for="(line, li) in words" :key="li" class="line" aria-hidden="true">
          <template v-for="(word, wi) in line" :key="wi"><span class="w"><span>{{ word }}</span></span>{{ wi < line.length - 1 ? ' ' : '' }}</template>
        </span>
      </h1>
      <p class="stage-lead" data-in>{{ t('hero.lead') }}</p>
      <div class="stage-actions" data-in>
        <UiButton :to="localePath('contact')" size="lg" class="stage-cta">{{ t('cta.primary') }}</UiButton>
        <NuxtLink :to="`${localePath('index')}#proyectos`" class="stage-more">
          {{ t('cta.projects') }} <ChevronRight aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage {
  position: relative;
  isolation: isolate;
  display: grid;
  align-items: end;
  min-height: max(100svh, 40rem);
  overflow: hidden;
}
.stage-photo { position: absolute; inset: 0; z-index: -2; }
.stage-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; }
/* The chest falls into the ground under the headline. */
.stage-photo::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 44%, rgb(12 11 10 / 0.5) 66%, var(--color-ground) 97%);
}
.stage-light {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(34rem circle at var(--lx, 50%) var(--ly, 30%), rgb(255 196 150 / 0.09), transparent 70%);
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.8s;
}
.is-lit .stage-light { opacity: 1; }

.stage-copy {
  padding: 0 var(--gutter) clamp(3.5rem, 8.5svh, 6rem);
  text-align: center;
}
/* Sizes from the approved comp (1586x992): cap 68px, lead cap 19px, pill 72px. */
.stage-title {
  margin-inline: auto;
  max-width: 24ch;
  font-size: clamp(2.75rem, 6.37vw, 6rem);
  font-weight: 720;
  line-height: 0.9;
  letter-spacing: -0.032em;
  transform-origin: 50% 50%;
}
.line { display: block; }
.w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.12em; margin-bottom: -0.12em; }
.w > span { display: inline-block; }
.stage-lead {
  margin: clamp(0.75rem, 1.4svh, 1.25rem) auto 0;
  max-width: 78ch;
  font-size: clamp(1.0625rem, 1.7vw, 1.6875rem);
  line-height: 1.4;
  color: rgb(238 234 227 / 0.9);
}
.stage-actions {
  margin-top: clamp(1.5rem, 3.8svh, 2.5rem);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.875rem clamp(1.5rem, 2.2vw, 2.25rem);
}
.stage-cta {
  height: clamp(3.25rem, 4.54vw, 4.5rem);
  padding-inline: clamp(1.75rem, 3.2vw, 3.25rem);
  font-size: clamp(1.0625rem, 1.79vw, 1.75rem);
}
.stage-more {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  font-size: clamp(1.0625rem, 1.7vw, 1.6875rem);
  font-weight: 600;
  color: var(--color-ink-2);
  text-decoration: none;
  transition: color 0.2s var(--ease-out-quart);
}
.stage-more:hover { color: var(--color-ink); }
.stage-more svg { width: 1em; height: 1em; transition: transform 0.25s var(--ease-out-expo); }
.stage-more:hover svg { transform: translateX(3px); }

@media (max-width: 40rem) {
  .stage-title { max-width: 12ch; }
  .stage-lead { max-width: 34ch; }
}
</style>

<style>
/* Start pose, held only while the entrance is pending (set before first paint). */
html[data-intro="pending"] .stage-photo { opacity: 0; filter: brightness(0.15); transform: scale(1.06); animation: intro-failsafe 0.8s 2.8s forwards; }
html[data-intro="pending"] .stage-title .w > span { transform: translateY(118%); animation: intro-failsafe 0.8s 2.8s forwards; }
html[data-intro="pending"] .stage [data-in],
html[data-intro="pending"] [data-intro-part="nav"] { opacity: 0; animation: intro-failsafe 0.8s 2.8s forwards; }
@keyframes intro-failsafe { to { opacity: 1; filter: none; transform: none; } }
</style>
