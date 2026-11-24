<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import type { Client } from '#shared/types/api'
import { CLIENT_STAGES, ROW_LOGOS } from '~/content/clients'

/**
 * Who the work was for. Clients with a recorded site are stages: logo in front, the
 * site waiting in the dark behind it; reach for one and the light moves from the logo
 * to the work. The rest are rows. A web address is only shown when it is public.
 */
const props = defineProps<{ clients: Client[] }>()
const { t } = useI18n()
const cdn = useCdn()

const stages = computed(() => props.clients.filter(c => CLIENT_STAGES[c.name]).map(c => ({ ...c, ...CLIENT_STAGES[c.name]! })))
const rows = computed(() => props.clients.filter(c => !CLIENT_STAGES[c.name]))
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/[/?].*$/, '')

// The recording is only mounted for the stage under a mouse.
const lit = ref<number | null>(null)
function light(e: PointerEvent, id: number) {
  if (e.pointerType === 'mouse' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) lit.value = id
}
</script>

<template>
  <section class="clients container-x" aria-labelledby="clients-title">
    <h2 id="clients-title" v-reveal class="h-section max-w-[14ch]">{{ t('about.clients') }}</h2>

    <ul class="stages">
      <li v-for="c in stages" :key="c.id">
        <component
          :is="c.website ? 'a' : 'div'"
          :href="c.website ?? undefined"
          :target="c.website ? '_blank' : undefined"
          :rel="c.website ? 'noopener' : undefined"
          class="stage"
          @pointerenter="light($event, c.id)"
          @pointerleave="lit = null"
        >
          <span class="work" aria-hidden="true">
            <img :src="cdn(`/media/${c.media}.jpg`)" alt="" width="1280" height="800" loading="lazy" decoding="async">
            <Transition name="play">
              <span v-if="lit === c.id" class="playing"><ScreenVideo :name="c.media" label="" fill /></span>
            </Transition>
          </span>
          <img :src="cdn(c.logo.src)" alt="" :width="c.logo.width" :height="c.logo.height" class="logo" loading="lazy" decoding="async">
          <span class="caption">
            <span class="name">{{ c.name }}</span>
            <span v-if="c.website" class="url">{{ host(c.website) }} <ArrowUpRight aria-hidden="true" /></span>
          </span>
        </component>
      </li>
    </ul>

    <ul v-if="rows.length" class="rows">
      <li v-for="c in rows" :key="c.id">
        <component :is="c.website ? 'a' : 'span'" :href="c.website ?? undefined" :target="c.website ? '_blank' : undefined" :rel="c.website ? 'noopener' : undefined" class="row">
          <span class="row-mark"><img v-if="ROW_LOGOS[c.name]" :src="cdn(ROW_LOGOS[c.name]!.src)" alt="" :width="ROW_LOGOS[c.name]!.width" :height="ROW_LOGOS[c.name]!.height" loading="lazy" decoding="async"></span>
          <span class="row-name">{{ c.name }}</span>
          <span v-if="c.website" class="url">{{ host(c.website) }} <ArrowUpRight aria-hidden="true" /></span>
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.clients { padding-top: var(--section); }
.stages { margin-top: clamp(2.5rem, 5vw, 4rem); display: grid; gap: clamp(0.75rem, 1.4vw, 1.25rem); }
.stages li { display: grid; min-width: 0; }
.stage {
  position: relative;
  display: grid;
  min-width: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--radius-screen);
  background: var(--color-raise);
  color: var(--color-ink);
  text-decoration: none;
}
@media (min-width: 48rem) {
  .stages { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
  .stages li:first-child { grid-row: span 2; }
  .stage { aspect-ratio: 16 / 10; }
}
@media (min-width: 48rem) { .stages li:first-child .stage { aspect-ratio: auto; height: 100%; } }
.work { position: absolute; inset: 0; z-index: -1; }
.work img, .playing { position: absolute; inset: 0; width: 100%; height: 100%; }
.work img { object-fit: cover; object-position: 50% 0; }
/* Out of focus and dimmed at rest, so the site's own headline never fights the logo. */
.work { filter: blur(7px) brightness(0.36) saturate(0.95); transform: scale(1.05); transition: filter 0.7s var(--ease-out-quart), transform 1.1s var(--ease-out-expo); }
.stage::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  z-index: -1;
  height: 55%;
  background: linear-gradient(to top, rgb(12 11 10 / 0.92), transparent);
}
.logo { place-self: center; width: auto; height: clamp(3.5rem, 5.5vw, 5.5rem); max-width: 62%; object-fit: contain; transition: opacity 0.45s var(--ease-out-quart), transform 0.9s var(--ease-out-expo); }
.stages li:first-child .logo { height: clamp(3.5rem, 8vw, 8rem); }
.caption { position: absolute; inset: auto 0 0; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.25rem 1rem; padding: clamp(1rem, 1.8vw, 1.5rem); }
.name { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.012em; }
.url { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.9375rem; color: var(--color-ink-2); transition: color 0.2s var(--ease-out-quart); }
.url svg { width: 1rem; height: 1rem; transition: transform 0.45s var(--ease-out-expo); }
a:hover .url, a:focus-visible .url { color: var(--color-ink); }
a:hover .url svg { transform: translate(0.125rem, -0.125rem); }
@media (hover: hover) {
  .stage:hover .work { filter: none; transform: none; }
  .stage:hover .logo { opacity: 0; transform: scale(0.96); }
}
.stage:focus-visible .work { filter: none; transform: none; }
.stage:focus-visible .logo { opacity: 0; }
.play-enter-active { transition: opacity 0.6s var(--ease-out-quart); }
.play-enter-from { opacity: 0; }

.rows { margin-top: clamp(1.5rem, 3vw, 2.5rem); border-top: 1px solid var(--color-line); }
.rows li { border-bottom: 1px solid var(--color-line); }
.row { display: grid; align-items: center; gap: 0.5rem 1.5rem; padding: 1.5rem 0; color: inherit; text-decoration: none; }
.row-mark { display: flex; align-items: center; min-height: 3.5rem; }
.row-mark img { width: auto; height: auto; max-width: 11rem; max-height: 3.5rem; opacity: 0.86; transition: opacity 0.2s var(--ease-out-quart); }
.row:hover .row-mark img, .row:focus-visible .row-mark img { opacity: 1; }
@media (min-width: 48rem) { .row { grid-template-columns: 14rem minmax(0, 1fr) auto; } }
.row-name { font-size: clamp(1.25rem, 1rem + 0.8vw, 1.625rem); font-weight: 700; letter-spacing: -0.02em; }
@media (prefers-reduced-motion: reduce) { .work, .logo, .play-enter-active { transition: none; } }
</style>
