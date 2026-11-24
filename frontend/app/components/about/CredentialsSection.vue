<script setup lang="ts">
import { ArrowUpRight, Maximize2, X } from '@lucide/vue'
import type Lenis from 'lenis'
import { CERTIFICATES, STUDIES, type Credential } from '~/content/credentials'

/**
 * The degree as one ruled row, then every certificate with its real document, what
 * it covered and what it left behind. Clicking a document opens it whole; without
 * JavaScript the link opens the image.
 */
const { t, locale } = useI18n()
const { number, date } = useFormat()
const cdn = useCdn()
const lang = computed(() => (locale.value === 'en' ? 'en' as const : 'es' as const))

const [featured, ...rest] = CERTIFICATES as [Credential, ...Credential[]]
const groups = [{ list: [featured], large: true }, { list: rest, large: false }]

const when = (c: Credential) => (c.date.length === 10 ? date(c.date, { month: 'long', year: 'numeric' }) : c.date)
const meta = (c: Credential) => [c.issuer, when(c), c.hours && t('about.credentials.hours', { n: number(c.hours) })].filter(Boolean).join(' · ')
const src = (c: Credential, w: 800 | 1600) => cdn(`/certificates/${c.doc!.file}-${w}.webp`)
const srcset = (c: Credential) => `${src(c, 800)} 800w, ${src(c, 1600)} ${c.doc!.width}w`

const dialog = ref<HTMLDialogElement | null>(null)
const shown = ref<Credential | null>(null)
const nuxtApp = useNuxtApp() as unknown as { $lenis?: Lenis }
function open(e: MouseEvent, c: Credential) {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
  shown.value = c
  nextTick(() => {
    dialog.value?.showModal()
    nuxtApp.$lenis?.stop()
  })
}
const close = () => dialog.value?.close()
const closed = () => nuxtApp.$lenis?.start()
onBeforeUnmount(closed)
</script>

<template>
  <section id="certificados" class="credentials container-x" aria-labelledby="credentials-title">
    <div class="head">
      <h2 id="credentials-title" v-reveal class="h-section max-w-[14ch]">{{ t('about.credentials.title') }}</h2>
      <p v-reveal="1" class="max-w-[46ch] text-ink-2">{{ t('about.credentials.lead') }}</p>
    </div>

    <article v-for="c in STUDIES" :key="c.id" class="degree">
      <div>
        <h3 class="name" lang="es">{{ c.name }}</h3>
        <p class="meta tabular">{{ meta(c) }}</p>
      </div>
      <div>
        <p class="what">{{ c.what[lang] }}</p>
        <p class="note">{{ c.note[lang] }}</p>
      </div>
    </article>

    <ul v-for="g in groups" :key="String(g.large)" :class="g.large ? 'lead-doc' : 'docs'">
      <li v-for="c in g.list" :key="c.id">
        <article class="item" :class="{ large: g.large }">
          <a v-if="c.doc" :href="src(c, 1600)" class="doc" :class="{ wide: c.doc.width / c.doc.height > 1.45 }" :aria-label="t('about.credentials.open', { name: c.name })" @click="open($event, c)">
            <img
              :src="src(c, 800)"
              :srcset="srcset(c)"
              :sizes="g.large ? '(min-width: 64rem) 58vw, 92vw' : '(min-width: 48rem) 46vw, 92vw'"
              :width="c.doc.width"
              :height="c.doc.height"
              alt=""
              loading="lazy"
              decoding="async"
            >
            <span class="zoom" aria-hidden="true"><Maximize2 /></span>
          </a>
          <div class="text">
            <h3 class="name" lang="es">{{ c.name }}</h3>
            <p class="meta tabular">{{ meta(c) }}</p>
            <p class="what">{{ c.what[lang] }}</p>
            <p class="note">{{ c.note[lang] }}</p>
            <a v-if="c.verify" :href="c.verify" target="_blank" rel="noopener" class="link-more verify" :aria-label="t('about.credentials.verifyOf', { name: c.name })">
              {{ t('about.credentials.verify') }} <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </article>
      </li>
    </ul>

    <dialog ref="dialog" class="lightbox" data-lenis-prevent :aria-label="shown?.name" @click.self="close" @close="closed">
      <template v-if="shown?.doc">
        <img :src="src(shown, 1600)" :width="shown.doc.width" :height="shown.doc.height" :alt="t('about.credentials.docAlt', { name: shown.name, issuer: shown.issuer })">
        <div class="bar">
          <p><span class="font-semibold text-ink" lang="es">{{ shown.name }}</span> <span class="text-mute">{{ meta(shown) }}</span></p>
          <div class="flex flex-none items-center gap-5">
            <a v-if="shown.verify" :href="shown.verify" target="_blank" rel="noopener" class="link-more">{{ t('about.credentials.verify') }} <ArrowUpRight aria-hidden="true" /></a>
            <button type="button" class="close" :aria-label="t('about.credentials.close')" @click="close"><X aria-hidden="true" /></button>
          </div>
        </div>
      </template>
    </dialog>
  </section>
</template>

<style scoped>
.credentials { padding-top: var(--section); scroll-margin-top: calc(var(--header-h) - var(--section) + 2rem); }
.head { display: grid; gap: 1.5rem var(--gutter); align-items: end; }
@media (min-width: 64rem) { .head { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } }

.degree {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding: 2rem 0 clamp(2.5rem, 5vw, 4rem);
  border-top: 1px solid var(--color-line);
  display: grid;
  gap: 1.25rem var(--gutter);
}
@media (min-width: 64rem) { .degree { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); } }
.degree .name { max-width: 18ch; font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.125rem); letter-spacing: -0.025em; }
.degree .what { margin-top: 0; }

.name { font-size: clamp(1.375rem, 1.15rem + 0.7vw, 1.75rem); font-weight: 720; line-height: 1.12; letter-spacing: -0.022em; text-wrap: balance; }
.meta { margin-top: 0.5rem; font-size: 0.9375rem; color: var(--color-mute); }
.what { margin-top: 1rem; max-width: 60ch; color: var(--color-ink-2); }
.note { margin-top: 1rem; max-width: 54ch; font-size: 1.125rem; font-weight: 600; line-height: 1.45; letter-spacing: -0.008em; text-wrap: pretty; color: var(--color-ink); }
.verify { margin-top: 1.25rem; }

.lead-doc { border-top: 1px solid var(--color-line); padding-top: clamp(2.5rem, 5vw, 4rem); }
.docs { margin-top: clamp(3.5rem, 7vw, 6rem); display: grid; gap: clamp(3.5rem, 6vw, 5rem) var(--gutter); }
@media (min-width: 48rem) { .docs { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.item { display: grid; gap: 1.5rem; align-content: start; }
@media (min-width: 64rem) {
  .item.large { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(2rem, 4vw, 4rem); align-items: center; }
  .item.large .name { font-size: clamp(2rem, 1rem + 2.2vw, 3rem); letter-spacing: -0.032em; line-height: 1.02; }
}

/* The document, lit on the stage. 10:7 sits between the issuers' 3:2 and A4. */
.doc {
  position: relative;
  display: block;
  aspect-ratio: 10 / 7;
  overflow: hidden;
  border-radius: var(--radius-screen);
  background: var(--color-raise);
  box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 36px 70px -24px rgb(0 0 0 / 0.85);
}
.doc img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.86); transition: filter 0.5s var(--ease-out-quart), transform 1.1s var(--ease-out-expo); }
/* Hack4u's 3:2 documents are black to the edge: shown whole, the bars disappear. */
.doc.wide { background: #020403; }
.doc.wide img { object-fit: contain; }
.doc:hover img, .doc:focus-visible img { filter: none; transform: scale(1.015); }
.zoom {
  position: absolute;
  right: 0.875rem;
  bottom: 0.875rem;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: var(--color-ink);
  color: var(--color-ground);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.25s var(--ease-out-quart), transform 0.5s var(--ease-out-expo);
}
.zoom svg { width: 1.125rem; height: 1.125rem; }
.doc:hover .zoom, .doc:focus-visible .zoom { opacity: 1; transform: none; }
@media (hover: none) { .zoom { opacity: 1; transform: none; } }

.lightbox {
  margin: auto;
  width: min(100vw - 2 * var(--gutter), 84rem, (100svh - 9rem) * 1.45);
  max-width: none;
  max-height: none;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-ink);
  overflow: visible;
}
.lightbox::backdrop { background: rgb(12 11 10 / 0.97); }
.lightbox img { display: block; width: 100%; height: auto; border-radius: var(--radius-screen); }
.lightbox[open] { animation: rise 0.6s var(--ease-out-expo); }
.lightbox[open]::backdrop { animation: dim 0.35s var(--ease-out-quart); }
.bar { margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem 1.5rem; }
.bar p { display: flex; flex-wrap: wrap; gap: 0 0.75rem; font-size: 0.9375rem; }
.close { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 999px; background: rgb(238 234 227 / 0.08); transition: background-color 0.2s var(--ease-out-quart); }
.close:hover { background: rgb(238 234 227 / 0.16); }
.close svg { width: 1.25rem; height: 1.25rem; }
@keyframes rise { from { opacity: 0; transform: translateY(1.5rem) scale(0.98); } }
@keyframes dim { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .doc img, .zoom { transition: none; }
  .lightbox[open], .lightbox[open]::backdrop { animation: none; }
}
</style>
