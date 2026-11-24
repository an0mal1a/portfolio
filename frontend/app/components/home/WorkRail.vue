<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { getShowcase } from '~/content/showcase'

/**
 * The rest of the work as a horizontal run of screens, each playing its real
 * recording with a soft reflection on the stage floor. Scroll-snapped, keyboard
 * scrollable, with arrows on wide screens.
 */
const { t, locale } = useI18n()
const cdn = useCdn()
const localePath = useLocalePath()
const items = computed(() => getShowcase(locale.value))

const rail = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function sync() {
  const el = rail.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft > el.scrollWidth - el.clientWidth - 8
}
function step(dir: 1 | -1) {
  const el = rail.value
  const card = el?.querySelector('article')
  if (!el || !card) return
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' })
}
onMounted(sync)
</script>

<template>
  <section id="proyectos" class="work" aria-labelledby="work-title">
    <div class="head container-x">
      <h2 id="work-title" v-reveal class="h-section mx-auto max-w-[18ch]">{{ t('home.work.title') }}</h2>
      <p v-reveal="1" class="lead mx-auto mt-6 max-w-[54ch]">{{ t('home.work.lead') }}</p>
    </div>

    <div ref="rail" class="rail" tabindex="0" :aria-label="t('home.work.listLabel')" @scroll.passive="sync">
      <article v-for="item in items" :key="item.id" class="item">
        <div class="screen">
          <ScreenVideo :name="item.media" :label="t('home.work.video', { name: item.name })" />
        </div>
        <div class="reflect" aria-hidden="true">
          <img :src="cdn(`/media/${item.media}.jpg`)" alt="" loading="lazy" decoding="async" width="1280" height="800">
        </div>
        <div class="id">
          <img v-if="item.logo" :src="cdn(item.logo.src)" alt="" :width="item.logo.width" :height="item.logo.height" class="logo" loading="lazy" decoding="async">
          <div>
            <h3 class="name">{{ item.name }}</h3>
            <p class="meta tabular">{{ item.meta }}</p>
          </div>
        </div>
        <p class="tagline">{{ item.tagline }}</p>
        <p v-if="item.url || item.slug" class="links">
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener" class="link-more">
            {{ t('home.work.visit') }} <ChevronRight aria-hidden="true" />
          </a>
          <NuxtLink v-if="item.slug" :to="localePath({ name: 'projects-slug', params: { slug: item.slug } })" class="link-more more-quiet">
            {{ t('home.work.case') }} <ChevronRight aria-hidden="true" />
          </NuxtLink>
        </p>
      </article>
    </div>

    <div class="foot container-x">
      <NuxtLinkLocale to="projects" class="link-more">{{ t('home.work.all') }} <ChevronRight aria-hidden="true" /></NuxtLinkLocale>
      <div class="arrows">
        <button type="button" :disabled="atStart" :aria-label="t('home.work.prev')" @click="step(-1)"><ChevronLeft aria-hidden="true" /></button>
        <button type="button" :disabled="atEnd" :aria-label="t('home.work.next')" @click="step(1)"><ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work { padding-top: var(--section); }
.head { text-align: center; }
.rail {
  margin-top: clamp(3.5rem, 7vw, 5.5rem);
  padding: 0 var(--gutter) 0.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min(45rem, 82vw);
  column-gap: clamp(1.25rem, 3vw, 2.5rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  scrollbar-width: none;
}
.rail::-webkit-scrollbar { display: none; }
.rail:focus-visible { outline-offset: -2px; }
.item { scroll-snap-align: start; }
.screen {
  overflow: hidden;
  border-radius: var(--radius-screen);
  box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 30px 60px -28px rgb(0 0 0 / 0.9);
}
/* The screen's soft reflection on the stage floor. */
.reflect {
  height: 4.375rem;
  overflow: hidden;
  opacity: 0.2;
  transform: scaleY(-1);
  filter: blur(6px);
  mask-image: linear-gradient(to top, black, transparent 80%);
  border-radius: 0 0 var(--radius-screen) var(--radius-screen);
}
.reflect img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: bottom; }
.id { margin-top: 0.25rem; display: flex; align-items: center; gap: 0.875rem; min-height: 3rem; }
/* The client's mark in one ink tone, as tall as the name and meta beside it. */
.logo { width: auto; height: 2.75rem; flex: none; }
.logo[src*="post-producciones"] { height: 2.5rem; }
.name { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.015em; }
.meta { margin-top: 0.25rem; font-size: 0.875rem; color: var(--color-mute); }
.tagline { margin-top: 0.625rem; max-width: 52ch; color: var(--color-ink-2); }
.links { margin-top: 0.875rem; display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; }
.more-quiet { color: var(--color-ink-2); }
.more-quiet:hover { color: var(--color-ink); }

.foot { margin-top: 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.arrows { display: flex; gap: 0.625rem; }
.arrows button {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: var(--color-ink-wash);
  color: var(--color-ink);
  transition: background-color 0.2s var(--ease-out-quart), opacity 0.2s;
}
.arrows button:hover:not(:disabled) { background: var(--color-ink-wash-hover); }
.arrows button:disabled { opacity: 0.35; cursor: default; }
.arrows svg { width: 1.25rem; height: 1.25rem; }
@media (max-width: 35rem) {
  .rail { grid-auto-columns: 86vw; }
}
</style>
