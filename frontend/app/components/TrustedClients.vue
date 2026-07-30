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
.trust { padding: clamp(5rem, 10vw, 10rem) 0; background: #eeece4; color: #10100f; }
.trust__inner { display: grid; grid-template-columns: minmax(17rem, .8fr) 1.6fr; gap: clamp(3rem, 8vw, 10rem); }
.trust .eyebrow { color: #74716b; }.trust__intro h2 { margin: 2rem 0 0; font-size: clamp(1.6rem, 2.4vw, 2.8rem); font-weight: 500; line-height: 1.05; letter-spacing: -.04em; }
.trust__logos { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgb(0 0 0 / 18%); border-left: 1px solid rgb(0 0 0 / 18%); }
.trust__client { display: grid; min-height: 8.5rem; padding: 1.5rem; place-items: center; border-right: 1px solid rgb(0 0 0 / 18%); border-bottom: 1px solid rgb(0 0 0 / 18%); filter: grayscale(1); transition: background .25s ease, filter .25s ease; }
.trust__client:hover { background: var(--acid); filter: none; }.trust__client img { width: min(8rem, 80%); max-height: 3rem; object-fit: contain; }.trust__client span { font-family: var(--font-display); font-size: clamp(1.25rem, 2vw, 2rem); text-align: center; text-transform: uppercase; }
.trust__empty { padding: 2.5rem; border: 1px solid rgb(0 0 0 / 18%); }.trust__empty span { color: var(--red); font-family: var(--font-display); font-size: clamp(2rem, 4vw, 4.5rem); text-transform: uppercase; }.trust__empty p { max-width: 28rem; margin: 1rem 0 0; color: #74716b; line-height: 1.6; }
@media (max-width: 760px) { .trust__inner { grid-template-columns: 1fr; }.trust__logos { grid-template-columns: repeat(2, 1fr); }.trust__client { min-height: 6.5rem; } }
</style>
