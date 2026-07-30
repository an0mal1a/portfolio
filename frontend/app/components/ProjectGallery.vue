<template>
  <section id="work" class="work" aria-labelledby="work-title">
    <div class="shell">
      <header class="work__header reveal">
        <div>
          <p class="eyebrow">Selected work · {{ projects.length.toString().padStart(2, '0') }}</p>
          <h2 id="work-title" class="section-heading">Built to<br><span>endure.</span></h2>
        </div>
        <p>Not a wall of thumbnails. A connected record of the product, the client and the code behind it.</p>
      </header>

      <div v-if="status === 'pending'" class="work__loading" aria-live="polite">
        <span v-for="index in 3" :key="index">Loading project {{ index.toString().padStart(2, '0') }}</span>
      </div>

      <div v-else-if="projects.length" class="work__list">
        <article v-for="(project, index) in projects" :key="project.id" class="project reveal" :class="{ 'project--featured': project.is_featured }">
          <div class="project__poster" :style="posterStyle(project, index)">
            <span class="project__poster-index">{{ (index + 1).toString().padStart(2, '0') }}</span>
            <p>{{ project.project_type }}</p>
            <strong>{{ shortTitle(project.name) }}</strong>
            <div class="project__rings" aria-hidden="true"><i /><i /><i /></div>
            <span class="project__poster-status">{{ statusLabel(project.status) }}</span>
          </div>

          <div class="project__content">
            <div class="project__topline">
              <p>{{ yearOf(project) }} / {{ project.project_type }}</p>
              <span v-if="project.is_featured">Featured</span>
            </div>
            <h3>{{ project.name }}</h3>
            <p class="project__tagline">{{ project.tagline || project.description }}</p>
            <p v-if="project.tagline" class="project__description">{{ project.description }}</p>

            <div class="project__relations">
              <div v-if="project.client" class="project__relation">
                <span>Client</span>
                <a v-if="project.client.website" :href="project.client.website" target="_blank" rel="noopener noreferrer">{{ project.client.name }} ↗</a>
                <strong v-else>{{ project.client.name }}</strong>
              </div>
              <div v-if="project.repository?.primary_language" class="project__relation">
                <span>Core language</span>
                <strong><i :style="{ background: languageColor(project.repository.primary_language) }" />{{ project.repository.primary_language }}</strong>
              </div>
              <div v-if="project.repository?.contributors?.length" class="project__relation project__relation--people">
                <span>Contributors</span>
                <div class="avatars" :aria-label="`${project.repository.contributors.length} contributors`">
                  <a
                    v-for="person in project.repository.contributors.slice(0, 5)"
                    :key="person.github_login"
                    :href="person.profile_url || undefined"
                    :title="person.github_login"
                    :aria-label="person.github_login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img v-if="person.avatar_url" :src="person.avatar_url" :alt="person.github_login" loading="lazy">
                    <span v-else>{{ initials(person.github_login) }}</span>
                  </a>
                  <b v-if="project.repository.contributors.length > 5">+{{ project.repository.contributors.length - 5 }}</b>
                </div>
              </div>
            </div>

            <div class="project__actions">
              <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener noreferrer">View live <span>↗</span></a>
              <a v-if="sourceUrl(project)" :href="sourceUrl(project)!" target="_blank" rel="noopener noreferrer">Source code <span>↗</span></a>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="work__empty reveal">
        <span>00</span>
        <p>The public project log is being curated. The system is ready when the work is.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'
import type { PortfolioProject } from '~/types/portfolio'

defineProps<{ projects: PortfolioProject[]; status: AsyncDataRequestStatus }>()

const palettes = [
  ['#e21b2d', '#4c020a'], ['#d9ff43', '#4f5e0d'], ['#c0b7ff', '#342b6b'], ['#ff7a32', '#6c2205'], ['#67d9ff', '#0b4559'],
]
const posterStyle = (_project: PortfolioProject, index: number) => ({ '--poster': palettes[index % palettes.length]![0], '--poster-dark': palettes[index % palettes.length]![1] })
const shortTitle = (name: string) => name.split(/\s+/).slice(0, 3).join('\n')
const initials = (value: string) => value.slice(0, 2).toUpperCase()
const yearOf = (project: PortfolioProject) => new Date(project.completed_at || project.started_at || project.created_at).getFullYear()
const statusLabel = (status: string) => ({ published: 'Live', in_progress: 'In progress', archived: 'Archive', draft: 'Draft' }[status] || status)
const languageColor = (language: string) => ({ Rust: '#dea584', TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5', Vue: '#41b883', Go: '#00add8' }[language] || '#e21b2d')
const sourceUrl = (project: PortfolioProject) => {
  if (!project.is_public || project.repository?.visibility !== 'public') return null
  return project.repository.repository_url || project.repository_url || null
}
</script>

<style scoped>
.work { padding: clamp(6rem, 11vw, 12rem) 0; background: var(--paper); }
.work__header { display: grid; grid-template-columns: 1.4fr .6fr; align-items: end; gap: 3rem; margin-bottom: clamp(5rem, 9vw, 9rem); }.work__header .section-heading { margin-top: 2.5rem; }.work__header h2 span { color: var(--red); }.work__header > p { max-width: 24rem; margin: 0 0 1rem auto; color: var(--ink-dim); line-height: 1.65; }
.work__list { display: grid; gap: clamp(6rem, 10vw, 11rem); }.project { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(19rem, .8fr); gap: clamp(2rem, 6vw, 7rem); align-items: center; }.project:nth-child(even) { grid-template-columns: minmax(19rem, .8fr) minmax(0, 1.2fr); }.project:nth-child(even) .project__poster { order: 2; }.project:nth-child(even) .project__content { order: 1; }
.project__poster { position: relative; isolation: isolate; display: flex; min-height: clamp(28rem, 55vw, 48rem); padding: clamp(1.25rem, 2.5vw, 2.5rem); overflow: hidden; flex-direction: column; justify-content: space-between; color: var(--paper); background: var(--poster); }.project__poster::before { position: absolute; z-index: -1; inset: 0; opacity: .75; background: repeating-linear-gradient(90deg, transparent 0 12.4%, rgb(0 0 0 / 10%) 12.5% 12.7%); content: ""; }.project__poster::after { position: absolute; z-index: -1; right: -20%; bottom: -35%; width: 85%; aspect-ratio: 1; border-radius: 50%; background: var(--poster-dark); filter: blur(2px); content: ""; transition: transform .7s cubic-bezier(.2,.75,.2,1); }.project:hover .project__poster::after { transform: scale(1.16) translate(-5%, -5%); }
.project__poster-index, .project__poster-status, .project__poster p { position: relative; z-index: 2; font-size: .65rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }.project__poster p { align-self: flex-end; margin: -1.1rem 0 0; }.project__poster strong { position: relative; z-index: 2; max-width: 90%; font-family: var(--font-display); font-size: clamp(5rem, 10vw, 12rem); font-weight: 400; line-height: .72; text-transform: uppercase; white-space: pre-line; }.project__poster-status { align-self: flex-end; padding: .6rem .8rem; border: 1px solid currentColor; border-radius: 2rem; }
.project__rings { position: absolute; z-index: -1; top: 14%; right: -5%; width: 68%; aspect-ratio: 1; }.project__rings i { position: absolute; inset: 0; border: 1px solid rgb(8 8 8 / 35%); border-radius: 50%; }.project__rings i:nth-child(2) { inset: 16%; }.project__rings i:nth-child(3) { inset: 33%; background: rgb(255 255 255 / 8%); }
.project__topline { display: flex; justify-content: space-between; padding-bottom: 1.1rem; border-bottom: 1px solid var(--line); color: var(--ink-dim); font-size: .62rem; font-weight: 650; letter-spacing: .1em; text-transform: uppercase; }.project__topline p { margin: 0; }.project__topline span { color: var(--red); }.project__content h3 { margin: 2.2rem 0 1.25rem; font-family: var(--font-display); font-size: clamp(3.5rem, 6vw, 7rem); font-weight: 400; line-height: .8; text-transform: uppercase; }.project__tagline { max-width: 32rem; margin: 0; font-size: clamp(1.2rem, 1.8vw, 1.8rem); line-height: 1.25; letter-spacing: -.025em; }.project__description { max-width: 31rem; margin: 1.4rem 0 0; color: var(--ink-dim); font-size: .88rem; line-height: 1.7; }
.project__relations { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 2.5rem; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }.project__relation { min-height: 5.5rem; padding: 1rem; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }.project__relation > span { display: block; margin-bottom: .8rem; color: #67645f; font-size: .56rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }.project__relation strong, .project__relation > a { font-size: .75rem; font-weight: 650; }.project__relation strong i { display: inline-block; width: .45rem; aspect-ratio: 1; margin-right: .45rem; border-radius: 50%; }.project__relation--people { grid-column: 1 / -1; }
.avatars { display: flex; padding-left: .4rem; }.avatars a, .avatars b { display: grid; width: 2.25rem; aspect-ratio: 1; margin-left: -.4rem; overflow: hidden; place-items: center; border: 2px solid var(--paper-soft); border-radius: 50%; background: #282725; font-size: .55rem; font-weight: 700; }.avatars a { transition: transform .2s ease; }.avatars a:hover { z-index: 2; transform: translateY(-.25rem); }.avatars img { width: 100%; height: 100%; object-fit: cover; }
.project__actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }.project__actions a { display: flex; min-width: 9.5rem; padding: .85rem 1rem; justify-content: space-between; border: 1px solid var(--line); font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; transition: .25s ease; }.project__actions a:hover { border-color: var(--red); background: var(--red); }.project__actions span { font-size: 1rem; }
.work__loading { display: grid; gap: 1px; background: var(--line); }.work__loading span { padding: 2rem; color: var(--ink-dim); background: var(--paper); animation: pulse 1.2s ease-in-out infinite alternate; }.work__empty { display: flex; align-items: center; gap: 2rem; padding: 3rem 0; border-block: 1px solid var(--line); }.work__empty span { color: var(--red); font-family: var(--font-display); font-size: 5rem; }.work__empty p { max-width: 28rem; color: var(--ink-dim); line-height: 1.6; }
@keyframes pulse { to { color: var(--ink); background: #111; } }
@media (max-width: 850px) { .work__header, .project, .project:nth-child(even) { grid-template-columns: 1fr; }.work__header > p { margin-left: 0; }.project:nth-child(even) .project__poster, .project:nth-child(even) .project__content { order: initial; }.project__poster { min-height: 34rem; }.project__content { padding-inline: .25rem; } }
@media (max-width: 520px) { .project__poster { min-height: 29rem; }.project__relations { grid-template-columns: 1fr; }.project__relation--people { grid-column: auto; } }
</style>
