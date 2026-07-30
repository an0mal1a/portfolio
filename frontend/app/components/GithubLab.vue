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
    <div class="lab__marquee" aria-hidden="true"><span>READABLE CODE — BORING INFRASTRUCTURE — FAST SYSTEMS — HUMAN OUTCOMES — </span><span>READABLE CODE — BORING INFRASTRUCTURE — FAST SYSTEMS — HUMAN OUTCOMES — </span></div>
  </section>
</template>

<script setup lang="ts">
import type { Repository } from '~/types/portfolio'
defineProps<{ repositories: Repository[] }>()
const languageColor = (language?: string | null) => ({ Rust: '#dea584', TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5', Vue: '#41b883', Go: '#00add8' }[language || ''] || '#e21b2d')
</script>

<style scoped>
.lab { overflow: hidden; padding: clamp(6rem, 11vw, 12rem) 0 0; color: #10100f; background: var(--acid); }.lab__inner { display: grid; grid-template-columns: .75fr 1.25fr; gap: clamp(3rem, 8vw, 10rem); }.lab .eyebrow { color: #565f20; }.lab__header h2 { margin: 2rem 0; font-family: var(--font-display); font-size: clamp(5rem, 10vw, 11rem); font-weight: 400; line-height: .72; text-transform: uppercase; }.lab__header h2 i { color: var(--red); font-style: normal; }.lab__header > p:last-child { max-width: 28rem; color: #596021; font-size: .88rem; line-height: 1.65; }
.lab__list { border-top: 1px solid rgb(0 0 0 / 30%); }.repo { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 7rem auto 2rem; gap: 1rem; align-items: center; padding: 1.6rem .5rem; border-bottom: 1px solid rgb(0 0 0 / 30%); transition: padding .25s ease, background .25s ease; }.repo:hover { padding-inline: 1rem; background: rgb(255 255 255 / 34%); }.repo__index { font-size: .58rem; font-weight: 700; }.repo strong { font-family: var(--font-display); font-size: clamp(1.6rem, 2.7vw, 3rem); font-weight: 400; text-transform: uppercase; }.repo p { margin: .25rem 0 0; overflow: hidden; color: #596021; font-size: .67rem; text-overflow: ellipsis; white-space: nowrap; }.repo__language { font-size: .62rem; font-weight: 700; text-transform: uppercase; }.repo__language i { display: inline-block; width: .45rem; aspect-ratio: 1; margin-right: .45rem; border: 1px solid rgb(0 0 0 / 30%); border-radius: 50%; }.repo__faces { display: flex; }.repo__faces img { width: 1.8rem; aspect-ratio: 1; margin-left: -.35rem; border: 2px solid var(--acid); border-radius: 50%; background: #222; }.repo__arrow { font-size: 1.25rem; transition: transform .25s ease; }.repo:hover .repo__arrow { transform: rotate(45deg); }
.lab__empty { padding: 2rem; border: 1px solid rgb(0 0 0 / 30%); line-height: 1.6; }.lab__marquee { display: flex; width: max-content; margin-top: clamp(6rem, 10vw, 10rem); color: var(--ink); background: var(--red); font-family: var(--font-display); font-size: clamp(4.5rem, 9vw, 10rem); line-height: .9; white-space: nowrap; transform: rotate(-2deg) translate(-1%, 10%); }.lab__marquee span { animation: marquee 24s linear infinite; }
@keyframes marquee { to { transform: translateX(-100%); } }
@media (max-width: 820px) { .lab__inner { grid-template-columns: 1fr; }.repo { grid-template-columns: 2rem minmax(0, 1fr) auto; }.repo__language, .repo__faces { display: none; } }
</style>
