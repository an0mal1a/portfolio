<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { SERVICE_IDS, getServiceWork, getServices, type ServiceId } from '~/content/services'

/**
 * Three ways to start, as a shop window: pick one on the left and the screen on
 * the right plays real work of that kind. Tabs (vertical); every tab is also a
 * link to its landing, so it leads somewhere without JavaScript.
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const services = computed(() => getServices(locale.value))

const active = ref<ServiceId>(SERVICE_IDS[0]!)
const picked = reactive(Object.fromEntries(SERVICE_IDS.map(id => [id, 0])) as Record<ServiceId, number>)
const work = computed(() => getServiceWork(active.value, locale.value))
const shown = computed(() => work.value[picked[active.value]] ?? work.value[0]!)

// A resting pointer previews the service; passing over it does not.
let timer: ReturnType<typeof setTimeout> | undefined
function preview(e: PointerEvent, id: ServiceId) {
  if (e.pointerType !== 'mouse') return
  clearTimeout(timer)
  timer = setTimeout(() => { active.value = id }, 140)
}
const cancel = () => clearTimeout(timer)
function choose(e: MouseEvent, id: ServiceId) {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
  cancel()
  active.value = id
}
onBeforeUnmount(cancel)

const tabs = ref<HTMLAnchorElement[]>([])
function onKey(e: KeyboardEvent) {
  const i = SERVICE_IDS.indexOf(active.value)
  const last = SERVICE_IDS.length - 1
  const next = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
  if (next === undefined) return
  e.preventDefault()
  active.value = SERVICE_IDS[next]!
  tabs.value[next]?.focus()
}
</script>

<template>
  <section id="servicios" class="services container-x" aria-labelledby="services-title">
    <h2 id="services-title" v-reveal class="h-section max-w-[16ch]">{{ t('home.services.title') }}</h2>
    <p v-reveal="1" class="lead mt-6 max-w-[52ch]">{{ t('home.services.lead') }}</p>

    <div class="panel window">
      <div class="tabs" role="tablist" aria-orientation="vertical" :aria-label="t('home.services.title')" @keydown="onKey">
        <a
          v-for="id in SERVICE_IDS"
          :id="`service-tab-${id}`"
          :key="id"
          ref="tabs"
          :href="localePath(id)"
          role="tab"
          class="tab"
          :aria-selected="active === id"
          :aria-controls="`service-panel-${id}`"
          :tabindex="active === id ? 0 : -1"
          @click="choose($event, id)"
          @pointerenter="preview($event, id)"
          @pointerleave="cancel"
        >
          <span class="tab-name">{{ services[id].name }}</span>
          <ChevronRight aria-hidden="true" />
        </a>
      </div>

      <div class="stage">
        <div class="screen">
          <Transition name="cut">
            <div :key="shown.media" class="shot">
              <ScreenVideo :name="shown.media" :label="t('home.work.video', { name: shown.name })" fill />
            </div>
          </Transition>
        </div>
        <div class="made">
          <div class="names" role="group" :aria-label="t('home.services.made')">
            <button
              v-for="(w, i) in work"
              :key="w.media"
              type="button"
              class="made-name"
              :aria-pressed="shown.media === w.media"
              @click="picked[active] = i"
            >
              {{ w.name }}
            </button>
          </div>
          <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: shown.slug } })" class="link-more">
            {{ t('home.work.case') }} <ChevronRight aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>

      <div class="details">
        <div
          v-for="id in SERVICE_IDS"
          v-show="active === id"
          :id="`service-panel-${id}`"
          :key="id"
          role="tabpanel"
          class="detail"
          :aria-labelledby="`service-tab-${id}`"
        >
          <p class="pitch">{{ services[id].pitch }}</p>
          <p class="includes">{{ services[id].includes.join(' · ') }}</p>
          <UiButton :to="localePath(id)" variant="ghost" class="more">{{ t('home.services.more') }}</UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services { padding-top: var(--section); }
.window {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding: clamp(1.25rem, 3.5vw, 3rem);
  display: grid;
  gap: 1.75rem clamp(2rem, 4vw, 4rem);
}
@media (min-width: 64rem) {
  .window {
    grid-template: "tabs stage" auto "details stage" 1fr / minmax(0, 5fr) minmax(0, 8fr);
  }
  .tabs { grid-area: tabs; }
  .stage { grid-area: stage; }
  .details { grid-area: details; align-self: end; }
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(0.875rem, 1.5vw, 1.25rem) 0;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-mute);
  text-decoration: none;
  transition: color 0.3s var(--ease-out-quart);
}
.tab:first-child { padding-top: 0; }
.tab-name {
  font-size: clamp(1.5rem, 1.1rem + 1.35vw, 2.25rem);
  font-weight: 720;
  line-height: 1.08;
  letter-spacing: -0.03em;
}
.tab svg { width: 1.25rem; height: 1.25rem; flex: none; opacity: 0; transform: translateX(-0.5rem); transition: opacity 0.3s var(--ease-out-quart), transform 0.5s var(--ease-out-expo); }
.tab:hover { color: var(--color-ink-2); }
.tab[aria-selected="true"] { color: var(--color-ink); }
.tab[aria-selected="true"] svg { opacity: 1; transform: none; }

.screen {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius-screen);
  background: var(--color-raise-2);
  box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 36px 70px -24px rgb(0 0 0 / 0.85);
}
.shot { position: absolute; inset: 0; }
/* The screen cuts to the next piece of work: the new one lights up over the old. */
.cut-enter-active { z-index: 1; transition: opacity 0.6s var(--ease-out-quart), filter 0.9s var(--ease-out-quart); }
.cut-enter-from { opacity: 0; filter: brightness(0.3); }
.cut-leave-active { transition: opacity 0s 0.6s; }
.cut-leave-to { opacity: 0.99; }

.made { margin-top: 1.25rem; display: grid; justify-items: start; gap: 1.125rem; }
.names { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.made-name {
  min-height: 2.5rem;
  padding: 0.4rem 1.1rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-ink-2);
  background: rgb(238 234 227 / 0.06);
  transition: background-color 0.2s var(--ease-out-quart), color 0.2s var(--ease-out-quart);
}
.made-name:hover { background: rgb(238 234 227 / 0.12); color: var(--color-ink); }
.made-name[aria-pressed="true"] { background: var(--color-ink); color: var(--color-ground); }

.pitch { max-width: 40ch; font-size: clamp(1.0625rem, 0.95rem + 0.5vw, 1.25rem); line-height: 1.45; color: var(--color-ink-2); }
.includes { margin-top: 1rem; max-width: 44ch; font-size: 0.9375rem; color: var(--color-mute); }
.more { margin-top: 1.75rem; }
.detail { animation: detail-in 0.5s var(--ease-out-expo); }
@keyframes detail-in { from { opacity: 0; transform: translateY(0.5rem); } }
@media (prefers-reduced-motion: reduce) {
  .detail { animation: none; }
  .cut-enter-active, .cut-leave-active, .tab svg { transition: none; }
}
</style>
