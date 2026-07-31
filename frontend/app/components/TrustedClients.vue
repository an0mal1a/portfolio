<template>
  <section class="trust" aria-labelledby="trust-title">
    <div class="trust__inner shell reveal">
      <div class="trust__intro">
        <p class="eyebrow">Selected relationships</p>
        <h2 id="trust-title">Trusted by people<br>building what’s next.</h2>
      </div>

      <div v-if="clients.length" class="trust__logos">
        <component
          :is="client.website ? 'a' : 'div'"
          v-for="client in clients"
          :key="client.id"
          class="trust__client"
          :href="client.website || undefined"
          :target="client.website ? '_blank' : undefined"
          :rel="client.website ? 'noopener noreferrer' : undefined"
          :aria-label="client.website ? `Visit ${client.name}` : client.name"
        >
          <img v-if="client.logo_url && !failedLogos.has(client.id)" :src="client.logo_url" :alt="client.name" @error="failedLogos.add(client.id)">
          <span v-else>{{ client.name }}</span>
        </component>
      </div>

      <div v-else class="trust__empty">
        <span>Independent by nature</span>
        <p>Open to thoughtful collaborations with teams that care about the details.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Client } from '~/types/portfolio'
defineProps<{ clients: Client[] }>()
const failedLogos = reactive(new Set<number>())
</script>

<style scoped>
.trust { padding: clamp(5rem, 10vw, 10rem) 0; border-bottom: 1px solid var(--line); background: var(--paper-raised); color: var(--ink); }
.trust__inner { display: grid; grid-template-columns: minmax(17rem, .8fr) 1.6fr; gap: clamp(3rem, 8vw, 10rem); }
.trust__intro h2 { margin: 2rem 0 0; font-size: clamp(1.6rem, 2.4vw, 2.8rem); font-weight: 550; line-height: 1.05; letter-spacing: -.04em; }
.trust__logos { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.trust__client { display: grid; min-height: 8.5rem; padding: 1.5rem; place-items: center; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); filter: grayscale(1); transition: background .25s ease, filter .25s ease; }
.trust__client:hover { background: rgb(225 29 46 / 12%); filter: none; }.trust__client img { width: min(8rem, 80%); max-height: 3rem; object-fit: contain; }.trust__client span { font-size: clamp(1.1rem, 1.8vw, 1.7rem); font-weight: 600; letter-spacing: -.04em; text-align: center; }
.trust__empty { padding: 2.5rem; border: 1px solid var(--line); }.trust__empty span { color: var(--red); font-size: clamp(2rem, 4vw, 4.5rem); font-weight: 650; letter-spacing: -.06em; }.trust__empty p { max-width: 28rem; margin: 1rem 0 0; color: var(--ink-dim); line-height: 1.6; }
@media (max-width: 760px) { .trust__inner { grid-template-columns: 1fr; }.trust__logos { grid-template-columns: repeat(2, 1fr); }.trust__client { min-height: 6.5rem; } }
</style>
