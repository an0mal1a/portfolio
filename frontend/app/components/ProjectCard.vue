<template>
  <article class="project-card">
    <NuxtLink class="project-card__visual" :to="`/projects/${project.slug}`" :aria-label="`View ${project.name} case study`">
      <span class="project-card__index">{{ index.toString().padStart(2, '0') }}</span>
      <span class="project-card__type">{{ project.project_type }}</span>
      <strong>{{ project.name }}</strong>
      <span class="project-card__orbit" aria-hidden="true"><i /><i /></span>
      <span class="project-card__open">Open case <i>↗</i></span>
    </NuxtLink>

    <div class="project-card__body">
      <div class="project-card__meta">
        <span>{{ yearOf(project) }}</span>
        <span v-if="project.is_featured" class="project-card__featured">Featured</span>
        <span>{{ statusLabel(project.status) }}</span>
      </div>
      <NuxtLink :to="`/projects/${project.slug}`"><h3>{{ project.name }}</h3></NuxtLink>
      <p>{{ project.tagline || project.description }}</p>
      <div class="project-card__footer">
        <div>
          <span v-if="project.repository?.primary_language" class="project-card__language"><i :style="{ background: languageColor(project.repository.primary_language) }" />{{ project.repository.primary_language }}</span>
          <span v-if="project.client">For {{ project.client.name }}</span>
        </div>
        <ContributorStack v-if="project.repository?.contributors?.length" :contributors="project.repository.contributors" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'
defineProps<{ project: PortfolioProject; index: number }>()
const yearOf = (project: PortfolioProject) => new Date(project.completed_at || project.started_at || project.created_at).getFullYear()
const statusLabel = (status: string) => ({ published: 'Live', in_progress: 'In progress', archived: 'Archive', draft: 'Draft' }[status] || status)
const languageColor = (language: string) => ({ Rust: '#e11d2e', TypeScript: '#ff3347', JavaScript: '#b9b9b5', Python: '#d1d1cd', Vue: '#8b8b87', Go: '#f5f5f3' }[language] || '#e11d2e')
</script>

<style scoped>
.project-card { min-width: 0; }
.project-card__visual { position: relative; isolation: isolate; display: block; aspect-ratio: 1.25 / 1; padding: clamp(1rem, 2vw, 1.75rem); overflow: hidden; border: 1px solid var(--line); background: radial-gradient(circle at 72% 62%, rgb(225 29 46 / 25%), transparent 20%), linear-gradient(145deg, #171717, #090909); }
.project-card__visual::before { position: absolute; z-index: -1; inset: 0; opacity: .6; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 4rem 4rem; content: ""; transition: transform .6s cubic-bezier(.2,.75,.2,1); }
.project-card__visual::after { position: absolute; z-index: -1; right: -16%; bottom: -30%; width: 66%; aspect-ratio: 1; border-radius: 50%; background: var(--red-dark); filter: blur(1px); content: ""; transition: transform .6s cubic-bezier(.2,.75,.2,1); }
.project-card__visual:hover::before { transform: scale(1.04); }.project-card__visual:hover::after { transform: translate(-7%, -8%) scale(1.12); }
.project-card__index, .project-card__type { position: absolute; top: 1.25rem; font-family: var(--font-mono); font-size: .58rem; font-weight: 650; letter-spacing: .1em; text-transform: uppercase; }.project-card__index { left: 1.25rem; color: var(--red-bright); }.project-card__type { right: 1.25rem; color: var(--ink-dim); }
.project-card__visual strong { position: absolute; z-index: 2; bottom: 1.4rem; left: 1.25rem; max-width: 75%; font-size: clamp(2.4rem, 4.5vw, 5.75rem); font-weight: 650; line-height: .88; letter-spacing: -.065em; }
.project-card__orbit { position: absolute; top: 18%; right: -6%; width: 55%; aspect-ratio: 1; border: 1px solid rgb(225 29 46 / 35%); border-radius: 50%; }.project-card__orbit i { position: absolute; inset: 19%; border: 1px solid rgb(225 29 46 / 25%); border-radius: inherit; }.project-card__orbit i:last-child { inset: 39%; background: var(--red); box-shadow: 0 0 3rem rgb(225 29 46 / 50%); }
.project-card__open { position: absolute; right: 1.25rem; bottom: 1.25rem; display: flex; align-items: center; gap: .65rem; color: var(--ink-dim); font-family: var(--font-mono); font-size: .57rem; text-transform: uppercase; }.project-card__open i { color: var(--red); font-size: .9rem; font-style: normal; }
.project-card__body { padding-top: 1.35rem; }.project-card__meta { display: flex; gap: .8rem; color: var(--ink-dim); font-family: var(--font-mono); font-size: .56rem; letter-spacing: .08em; text-transform: uppercase; }.project-card__featured { color: var(--red-bright); }.project-card h3 { margin: .85rem 0 .65rem; font-size: clamp(1.75rem, 2.4vw, 2.65rem); font-weight: 600; line-height: 1; letter-spacing: -.05em; }.project-card__body > p { max-width: 38rem; margin: 0; color: var(--ink-dim); font-size: .9rem; line-height: 1.65; }
.project-card__footer { display: flex; min-height: 3.25rem; margin-top: 1.2rem; padding-top: 1rem; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); }.project-card__footer > div:first-child { display: flex; flex-wrap: wrap; gap: .75rem; color: var(--ink-dim); font-family: var(--font-mono); font-size: .57rem; text-transform: uppercase; }.project-card__language i { display: inline-block; width: .4rem; aspect-ratio: 1; margin-right: .4rem; border-radius: 50%; }
@media (max-width: 540px) { .project-card__visual { aspect-ratio: 1 / 1.05; }.project-card__visual strong { max-width: 82%; }.project-card__open { display: none; } }
</style>
