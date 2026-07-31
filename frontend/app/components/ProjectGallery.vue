<template>
  <section id="work" class="work" aria-labelledby="work-title">
    <div class="shell">
      <header class="work__header reveal">
        <div>
          <p class="eyebrow">Selected work · {{ projects.length.toString().padStart(2, '0') }}</p>
          <h2 id="work-title" class="section-heading">Selected<br><span>systems.</span></h2>
        </div>
        <div class="work__intro">
          <p>A curated set of products, platforms and experiments. Every project connects the visible experience to the engineering underneath.</p>
          <NuxtLink class="text-link" to="/projects">View all projects <span>↗</span></NuxtLink>
        </div>
      </header>

      <div v-if="status === 'pending'" class="work__loading" aria-live="polite">
        <span v-for="index in 4" :key="index">Loading project {{ index.toString().padStart(2, '0') }}</span>
      </div>
      <div v-else-if="projects.length" class="work__grid">
        <ProjectCard v-for="(project, index) in projects.slice(0, 4)" :key="project.id" class="reveal" :project="project" :index="index + 1" />
      </div>
      <div v-else class="work__empty reveal"><span>00</span><p>The public project log is being curated. New case studies will appear here automatically.</p></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'
import type { PortfolioProject } from '~/types/portfolio'
defineProps<{ projects: PortfolioProject[]; status: AsyncDataRequestStatus }>()
</script>

<style scoped>
.work { padding: clamp(6rem, 11vw, 12rem) 0; background: var(--paper); }
.work__header { display: grid; grid-template-columns: 1.3fr .7fr; align-items: end; gap: clamp(3rem, 8vw, 9rem); margin-bottom: clamp(4rem, 7vw, 7rem); }.work__header .section-heading { margin-top: 2.2rem; }.work__intro { padding-bottom: .6rem; }.work__intro p { max-width: 32rem; margin: 0 0 1.8rem; color: var(--ink-dim); font-size: 1rem; line-height: 1.7; }
.work__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 3vw, 3.5rem); }.work__grid > :nth-child(even) { margin-top: clamp(3rem, 7vw, 7rem); }
.work__loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--line); }.work__loading span { min-height: 16rem; padding: 1.5rem; color: var(--ink-dim); background: var(--paper-raised); font-family: var(--font-mono); font-size: .62rem; text-transform: uppercase; animation: pulse 1.2s ease-in-out infinite alternate; }
.work__empty { display: flex; align-items: center; gap: 2rem; padding: 3rem 0; border-block: 1px solid var(--line); }.work__empty span { color: var(--red); font-size: 4rem; font-weight: 650; letter-spacing: -.06em; }.work__empty p { max-width: 28rem; color: var(--ink-dim); line-height: 1.6; }
@keyframes pulse { to { color: var(--ink); background: #121212; } }
@media (max-width: 760px) { .work__header { grid-template-columns: 1fr; }.work__grid { grid-template-columns: 1fr; }.work__grid > :nth-child(even) { margin-top: 0; }.work__loading { grid-template-columns: 1fr; } }
</style>
