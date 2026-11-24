<script setup lang="ts">
import { Plus } from '@lucide/vue'

// Visible FAQ + matching FAQPage JSON-LD (only ever emitted where the questions are on the page).
const props = defineProps<{ items: { q: string, a: string }[], title: string, headingId?: string }>()

useHead(() => ({
  script: [{
    type: 'application/ld+json',
    key: `faq-${props.headingId ?? 'faq'}`,
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': props.items.map(i => ({ '@type': 'Question', 'name': i.q, 'acceptedAnswer': { '@type': 'Answer', 'text': i.a } })),
    }),
  }],
}))
</script>

<template>
  <section class="faq container-x" :aria-labelledby="props.headingId ?? 'faq-title'">
    <h2 :id="props.headingId ?? 'faq-title'" v-reveal class="h-section max-w-[10ch]">{{ props.title }}</h2>
    <div class="list">
      <details v-for="item in props.items" :key="item.q" class="item group">
        <summary>
          <h3>{{ item.q }}</h3>
          <span class="toggle" aria-hidden="true"><Plus /></span>
        </summary>
        <p>{{ item.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq { padding-top: var(--section); display: grid; gap: 2.5rem clamp(2.5rem, 5vw, 5rem); }
@media (min-width: 64rem) { .faq { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); align-items: start; } }
.list { border-top: 1px solid var(--color-line); }
.item { border-bottom: 1px solid var(--color-line); }
summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 0;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary h3 { font-size: clamp(1.125rem, 1rem + 0.4vw, 1.3125rem); font-weight: 650; line-height: 1.3; letter-spacing: -0.012em; }
.toggle {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: -0.25rem;
  border-radius: 999px;
  background: var(--color-ink-wash);
  transition: background-color 0.2s var(--ease-out-quart), transform 0.5s var(--ease-out-expo);
}
.toggle svg { width: 1.125rem; height: 1.125rem; }
summary:hover .toggle { background: var(--color-ink-wash-hover); }
.item[open] .toggle { transform: rotate(45deg); }
.item p { max-width: 64ch; padding: 0 3.5rem 1.75rem 0; color: var(--color-ink-2); }
</style>
