<template>
  <section id="lab" class="lab" aria-labelledby="lab-title">
    <div class="lab__inner shell">
      <header class="lab__header reveal">
        <p class="eyebrow">Open source / Live from GitHub</p>
        <h2 id="lab-title">The lab is<br><i>always on.</i></h2>
        <p>Public repositories synced from GitHub. Experiments, tools and the engineering work behind selected projects.</p>
      </header>

      <div v-if="repositories.length" class="lab__list reveal">
        <a
          v-for="(repo, index) in repositories.slice(0, 8)"
          :key="repo.id"
          class="repo"
          :href="repo.repository_url || undefined"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="repo__index">{{ (index + 1).toString().padStart(2, '0') }}</span>
          <div><strong>{{ repo.display_name }}</strong><p>{{ repo.description || repo.full_name }}</p></div>
          <span class="repo__language"><i :style="{ background: languageColor(repo.primary_language) }" />{{ repo.primary_language || 'Code' }}</span>
          <div v-if="repo.contributors?.length" class="repo__faces" :title="`${repo.contributors.length} contributors`">
            <img v-for="person in repo.contributors.slice(0, 3)" :key="person.github_login" :src="person.avatar_url || undefined" :alt="person.github_login" loading="lazy">
          </div>
          <span class="repo__arrow">↗</span>
        </a>
      </div>

      <p v-else class="lab__empty reveal">The GitHub feed is quiet right now. Public repositories will appear here automatically after the next sync.</p>
    </div>
    <div class="lab__marquee" aria-hidden="true"><span>READABLE CODE  RESILIENT SYSTEMS  HUMAN OUTCOMES  </span><span>READABLE CODE  RESILIENT SYSTEMS  HUMAN OUTCOMES  </span></div>
  </section>
</template>

<script setup lang="ts">
import type { Repository } from '~/types/portfolio'
defineProps<{ repositories: Repository[] }>()
const languageColor = (language?: string | null) => ({ Rust: '#e11d2e', TypeScript: '#ff3347', JavaScript: '#b9b9b5', Python: '#d1d1cd', Vue: '#8b8b87', Go: '#f5f5f3' }[language || ''] || '#e11d2e')
</script>

<style scoped>
.lab { overflow: hidden; padding: clamp(6rem, 11vw, 12rem) 0 0; border-block: 1px solid var(--line); color: var(--ink); background: var(--paper-raised); }.lab__inner { display: grid; grid-template-columns: .75fr 1.25fr; gap: clamp(3rem, 8vw, 10rem); }.lab__header h2 { margin: 2rem 0; font-family: var(--font-display); font-size: clamp(3.8rem, 8.5vw, 9.5rem); font-weight: 650; line-height: .84; letter-spacing: -.075em; }.lab__header h2 i { color: var(--red); font-style: normal; }.lab__header > p:last-child { max-width: 28rem; color: var(--ink-dim); font-size: .92rem; line-height: 1.7; }
.lab__list { border-top: 1px solid var(--line); }.repo { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 7rem auto 2rem; gap: 1rem; align-items: center; padding: 1.5rem .5rem; border-bottom: 1px solid var(--line); transition: padding .25s ease, background .25s ease; }.repo:hover { padding-inline: 1rem; background: rgb(255 255 255 / 4%); }.repo__index { color: var(--red); font-family: var(--font-mono); font-size: .56rem; font-weight: 700; }.repo strong { font-family: var(--font-display); font-size: clamp(1.3rem, 2vw, 2.2rem); font-weight: 600; letter-spacing: -.035em; }.repo p { margin: .3rem 0 0; overflow: hidden; color: var(--ink-dim); font-size: .68rem; text-overflow: ellipsis; white-space: nowrap; }.repo__language { color: var(--ink-dim); font-family: var(--font-mono); font-size: .56rem; font-weight: 700; text-transform: uppercase; }.repo__language i { display: inline-block; width: .42rem; aspect-ratio: 1; margin-right: .45rem; border-radius: 50%; }.repo__faces { display: flex; }.repo__faces img { width: 1.8rem; aspect-ratio: 1; margin-left: -.35rem; border: 2px solid var(--paper-raised); border-radius: 50%; background: #222; }.repo__arrow { color: var(--red); font-size: 1.25rem; transition: transform .25s ease; }.repo:hover .repo__arrow { transform: rotate(45deg); }
.lab__empty { padding: 2rem; border: 1px solid var(--line); color: var(--ink-dim); line-height: 1.6; }.lab__marquee { display: flex; width: max-content; margin-top: clamp(6rem, 10vw, 10rem); color: white; background: var(--red); font-size: clamp(3.5rem, 7vw, 8rem); font-weight: 650; line-height: .92; letter-spacing: -.06em; white-space: nowrap; transform: rotate(-1.2deg) translate(-1%, 10%); }.lab__marquee span { animation: marquee 28s linear infinite; }
@keyframes marquee { to { transform: translateX(-100%); } }
@media (max-width: 820px) { .lab__inner { grid-template-columns: 1fr; }.repo { grid-template-columns: 2rem minmax(0, 1fr) auto; }.repo__language, .repo__faces { display: none; } }
</style>
