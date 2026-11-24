<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { SERVICE_IDS, getServices } from '~/content/services'

/** Three ways to start, as three large rows that lead to their landings. */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const services = computed(() => getServices(locale.value))
</script>

<template>
  <section id="servicios" class="services container-x" aria-labelledby="services-title">
    <h2 id="services-title" v-reveal class="h-section max-w-[16ch]">{{ t('home.services.title') }}</h2>
    <p v-reveal="1" class="lead mt-6 max-w-[52ch]">{{ t('home.services.lead') }}</p>

    <ul class="rows">
      <li v-for="id in SERVICE_IDS" :key="id">
        <NuxtLink :to="localePath(id)" class="row">
          <h3 class="name">{{ services[id].name }}</h3>
          <p class="pitch">{{ services[id].pitch }}</p>
          <ul class="includes">
            <li v-for="item in services[id].includes" :key="item">{{ item }}</li>
          </ul>
          <span class="go" aria-hidden="true"><ChevronRight /></span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.services { padding-top: var(--section); }
.rows { margin-top: clamp(3rem, 6vw, 4.5rem); border-top: 1px solid var(--color-line); }
.rows > li { border-bottom: 1px solid var(--color-line); }
.row {
  display: grid;
  gap: 0.75rem 2.5rem;
  padding: clamp(1.75rem, 3vw, 2.5rem) 0;
  text-decoration: none;
  color: inherit;
  position: relative;
}
@media (min-width: 64rem) {
  .row { grid-template-columns: minmax(0, 5fr) minmax(0, 4.5fr) minmax(0, 2.5fr) auto; align-items: baseline; }
}
.name {
  font-size: clamp(1.75rem, 1.2rem + 1.9vw, 2.875rem);
  font-weight: 720;
  line-height: 1.04;
  letter-spacing: -0.03em;
  transition: transform 0.5s var(--ease-out-expo);
}
.pitch { color: var(--color-ink-2); max-width: 44ch; }
.includes { display: flex; flex-wrap: wrap; gap: 0.25rem 0.875rem; font-size: 0.875rem; color: var(--color-mute); }
.go {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: var(--color-ink-wash);
  transition: background-color 0.25s var(--ease-out-quart), color 0.25s var(--ease-out-quart), transform 0.45s var(--ease-out-expo);
  align-self: center;
}
@media (max-width: 63.99rem) {
  .go { position: absolute; top: clamp(1.75rem, 3vw, 2.5rem); right: 0; }
  .name { padding-right: 3.5rem; }
}
.go svg { width: 1.25rem; height: 1.25rem; }
.row:hover .name { transform: translateX(0.375rem); }
.row:hover .go { background: var(--color-ink); color: var(--color-ground); transform: translateX(0.25rem); }
@media (prefers-reduced-motion: reduce) {
  .row:hover .name, .row:hover .go { transform: none; }
}
</style>
