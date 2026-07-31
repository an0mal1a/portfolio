<template>
  <div class="case-page">
    <div v-if="status === 'pending'" class="case-loading shell" aria-live="polite">Loading case study…</div>

    <template v-else-if="project">
      <section class="case-hero">
        <div class="case-hero__grid" aria-hidden="true" />
        <div class="case-hero__inner shell">
          <NuxtLink class="case-hero__back" to="/projects">← Project archive</NuxtLink>
          <div class="case-hero__meta">
            <span>{{ yearOf(project) }}</span><span>{{ project.project_type }}</span><span>{{ statusLabel(project.status) }}</span>
          </div>
          <h1>{{ project.name }}</h1>
          <p>{{ project.tagline || project.description }}</p>

          <div class="case-hero__actions">
            <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener noreferrer">View live <span>↗</span></a>
            <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">Source code <span>↗</span></a>
          </div>

          <div class="case-hero__visual">
            <span class="case-hero__visual-code">CASE / {{ project.id.toString().padStart(3, '0') }}</span>
            <strong>{{ shortTitle(project.name) }}</strong>
            <div class="case-hero__orbit" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      <section class="case-body">
        <div class="case-body__inner shell">
          <aside class="case-facts" aria-label="Project details">
            <div><span>Timeline</span><strong>{{ dateRange(project) }}</strong></div>
            <div v-if="project.client"><span>Client</span><a v-if="project.client.website" :href="project.client.website" target="_blank" rel="noopener noreferrer">{{ project.client.name }} ↗</a><strong v-else>{{ project.client.name }}</strong></div>
            <div v-if="project.repository?.primary_language"><span>Core language</span><strong><i />{{ project.repository.primary_language }}</strong></div>
            <div v-if="project.repository?.contributors?.length"><span>Contributors</span><ContributorStack :contributors="project.repository.contributors" :limit="6" /></div>
          </aside>

          <div class="case-story">
            <p class="eyebrow">The project</p>
            <h2>{{ project.tagline || 'Designed for clarity. Engineered for change.' }}</h2>
            <p>{{ project.description }}</p>

            <div class="case-story__principles">
              <article><span>01</span><h3>Reliable by design</h3><p>Clear boundaries, deliberate failure states and an architecture that stays understandable as the project grows.</p></article>
              <article><span>02</span><h3>Human on the surface</h3><p>Technical depth translated into a direct experience with less friction and no decorative noise.</p></article>
              <article><span>03</span><h3>Built to evolve</h3><p>Decisions made for maintainability, observability and the next real requirement  not the imaginary hundredth.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section class="case-next">
        <NuxtLink v-if="nextProject" :to="`/projects/${nextProject.slug}`" class="shell">
          <span>Next project</span><strong>{{ nextProject.name }}</strong><i>↗</i>
        </NuxtLink>
        <NuxtLink v-else to="/projects" class="shell"><span>End of archive</span><strong>View all projects</strong><i>↗</i></NuxtLink>
      </section>
    </template>

    <section v-else class="case-missing shell">
      <p class="eyebrow">404 / Project unavailable</p><h1>This case study isn’t here.</h1><p>{{ error ? 'The live project feed could not be reached.' : 'It may be private, archived or using a different address.' }}</p>
      <button v-if="error" type="button" @click="refresh()">Retry</button><NuxtLink to="/projects">Back to projects ↗</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'
const route = useRoute()
const { projects, status, error, refresh } = usePortfolio()
const project = computed(() => projects.value.find(item => item.slug === route.params.slug))
const nextProject = computed(() => {
  if (!project.value || projects.value.length < 2) return null
  const index = projects.value.findIndex(item => item.id === project.value?.id)
  return projects.value[(index + 1) % projects.value.length] || null
})
const sourceUrl = computed(() => project.value?.is_public && project.value.repository?.visibility === 'public' ? (project.value.repository.repository_url || project.value.repository_url || null) : null)
const yearOf = (item: PortfolioProject) => new Date(item.completed_at || item.started_at || item.created_at).getFullYear()
const shortTitle = (name: string) => name.split(/\s+/).slice(0, 3).join(' ')
const statusLabel = (value: string) => ({ published: 'Live', in_progress: 'In progress', archived: 'Archive', draft: 'Draft' }[value] || value)
const dateLabel = (value?: string | null) => value ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value)) : null
const dateRange = (item: PortfolioProject) => [dateLabel(item.started_at || item.created_at), dateLabel(item.completed_at)].filter(Boolean).join(' — ') || yearOf(item).toString()

useSeoMeta({
  title: () => project.value ? `${project.value.name} · Pablo Diez` : 'Project · Pablo Diez',
  description: () => project.value?.tagline || project.value?.description || 'Project case study by Pablo Diez.',
  ogTitle: () => project.value ? `${project.value.name} · Pablo Diez` : 'Project · Pablo Diez',
  ogDescription: () => project.value?.tagline || project.value?.description || 'Project case study by Pablo Diez.',
  ogType: 'article',
})
</script>

<style scoped>
.case-loading, .case-missing { min-height: 80svh; padding-top: 12rem; color: var(--ink-dim); }.case-loading { font-family: var(--font-mono); font-size: .65rem; text-transform: uppercase; }
.case-hero { position: relative; min-height: 100svh; padding: 8.5rem 0 3rem; overflow: hidden; border-bottom: 1px solid var(--line); }.case-hero__grid { position: absolute; inset: 0; opacity: .45; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 7rem 7rem; mask-image: linear-gradient(to bottom, black 30%, transparent); }.case-hero__inner { position: relative; }.case-hero__back { display: inline-block; color: var(--ink-dim); font-family: var(--font-mono); font-size: .62rem; letter-spacing: .07em; text-transform: uppercase; }.case-hero__back:hover { color: var(--red-bright); }.case-hero__meta { display: flex; gap: .7rem; margin-top: clamp(4rem, 10vh, 8rem); color: var(--ink-dim); font-family: var(--font-mono); font-size: .6rem; letter-spacing: .08em; text-transform: uppercase; }.case-hero__meta span + span::before { margin-right: .7rem; color: var(--red); content: "/"; }
.case-hero h1 { position: relative; z-index: 2; max-width: 11ch; margin: 1rem 0 0; font-size: clamp(4.2rem, 10vw, 11.5rem); font-weight: 650; line-height: .82; letter-spacing: -.085em; }.case-hero__inner > p { position: relative; z-index: 2; max-width: 34rem; margin: 2rem 0 0; color: var(--ink-dim); font-size: clamp(1rem, 1.4vw, 1.25rem); line-height: 1.6; }.case-hero__actions { position: relative; z-index: 3; display: flex; gap: .7rem; margin-top: 2rem; }.case-hero__actions a { display: flex; min-width: 10rem; padding: .8rem .9rem; justify-content: space-between; border: 1px solid var(--line-strong); font-family: var(--font-mono); font-size: .62rem; text-transform: uppercase; transition: .2s ease; }.case-hero__actions a:hover { border-color: var(--red); background: var(--red); }
.case-hero__visual { position: absolute; right: clamp(1rem, 4vw, 5rem); bottom: 3rem; width: min(44rem, 43vw); aspect-ratio: 1.2 / 1; overflow: hidden; border: 1px solid var(--line); background: radial-gradient(circle at 68% 56%, rgb(225 29 46 / 25%), transparent 24%), #0d0d0d; }.case-hero__visual::before { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 12.4%, var(--line) 12.5% 12.65%); content: ""; }.case-hero__visual-code { position: absolute; top: 1.25rem; left: 1.25rem; color: var(--red); font-family: var(--font-mono); font-size: .57rem; }.case-hero__visual strong { position: absolute; z-index: 2; bottom: 1.25rem; left: 1.25rem; max-width: 80%; font-size: clamp(3rem, 5vw, 6rem); font-weight: 650; line-height: .85; letter-spacing: -.07em; }.case-hero__orbit { position: absolute; top: 10%; right: -8%; width: 70%; aspect-ratio: 1; border: 1px solid rgb(225 29 46 / 35%); border-radius: 50%; }.case-hero__orbit i { position: absolute; inset: 16%; border: 1px solid rgb(225 29 46 / 26%); border-radius: inherit; }.case-hero__orbit i:nth-child(2) { inset: 33%; }.case-hero__orbit i:nth-child(3) { inset: 46%; background: var(--red); box-shadow: 0 0 4rem rgb(225 29 46 / 55%); }
.case-body { padding: clamp(6rem, 12vw, 12rem) 0; }.case-body__inner { display: grid; grid-template-columns: minmax(13rem, .55fr) minmax(0, 1.45fr); gap: clamp(4rem, 11vw, 13rem); }.case-facts { border-top: 1px solid var(--line); }.case-facts > div { min-height: 5.25rem; padding: 1rem 0; border-bottom: 1px solid var(--line); }.case-facts > div > span { display: block; margin-bottom: .7rem; color: var(--ink-dim); font-family: var(--font-mono); font-size: .55rem; letter-spacing: .08em; text-transform: uppercase; }.case-facts strong, .case-facts a { font-size: .78rem; font-weight: 600; }.case-facts strong i { display: inline-block; width: .4rem; aspect-ratio: 1; margin-right: .45rem; border-radius: 50%; background: var(--red); }
.case-story h2 { max-width: 18ch; margin: 2rem 0; font-size: clamp(2.3rem, 4.3vw, 5rem); font-weight: 600; line-height: .98; letter-spacing: -.065em; }.case-story > p:not(.eyebrow) { max-width: 48rem; color: var(--ink-dim); font-size: clamp(1rem, 1.25vw, 1.16rem); line-height: 1.8; white-space: pre-line; }.case-story__principles { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: clamp(4rem, 8vw, 7rem); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }.case-story__principles article { min-height: 18rem; padding: 1.4rem; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }.case-story__principles span { color: var(--red); font-family: var(--font-mono); font-size: .57rem; }.case-story__principles h3 { margin: 4rem 0 1rem; font-size: 1.25rem; letter-spacing: -.03em; }.case-story__principles p { margin: 0; color: var(--ink-dim); font-size: .8rem; line-height: 1.65; }
.case-next { border-top: 1px solid var(--line); background: var(--paper-raised); }.case-next a { display: grid; grid-template-columns: 10rem 1fr auto; padding-block: clamp(3.5rem, 8vw, 7rem); align-items: center; gap: 2rem; }.case-next span { color: var(--ink-dim); font-family: var(--font-mono); font-size: .6rem; text-transform: uppercase; }.case-next strong { font-size: clamp(2.5rem, 6vw, 7rem); font-weight: 600; line-height: .9; letter-spacing: -.07em; }.case-next i { color: var(--red); font-size: 2rem; font-style: normal; }
.case-missing h1 { max-width: 12ch; margin: 2rem 0 1rem; color: var(--ink); font-size: clamp(3rem, 8vw, 8rem); line-height: .9; letter-spacing: -.07em; }.case-missing p:not(.eyebrow) { max-width: 28rem; }.case-missing a, .case-missing button { display: inline-block; margin: 1rem .75rem 0 0; padding: .75rem 1rem; border: 1px solid var(--red); color: white; background: transparent; font-family: var(--font-mono); font-size: .62rem; text-transform: uppercase; }
@media (max-width: 900px) { .case-hero { min-height: 58rem; }.case-hero__visual { right: -6rem; width: 30rem; opacity: .62; }.case-body__inner { grid-template-columns: 1fr; }.case-facts { display: grid; grid-template-columns: repeat(2, 1fr); }.case-facts > div { padding-right: 1rem; }.case-story__principles { grid-template-columns: 1fr; }.case-story__principles article { min-height: auto; }.case-story__principles h3 { margin-top: 2rem; } }
@media (max-width: 600px) { .case-hero { min-height: 51rem; padding-top: 6.5rem; }.case-hero__meta { margin-top: 3.5rem; }.case-hero h1 { font-size: clamp(3.7rem, 18vw, 6rem); }.case-hero__visual { right: -8rem; bottom: 2rem; width: 25rem; }.case-hero__actions { flex-direction: column; align-items: flex-start; }.case-hero__actions a { min-width: 12rem; }.case-facts { grid-template-columns: 1fr 1fr; }.case-next a { grid-template-columns: 1fr auto; }.case-next span { grid-column: 1 / -1; } }
</style>
