<template>
  <div>
    <section class="page-intro">
      <div class="shell">
        <p class="eyebrow">Project archive / {{ projects.length.toString().padStart(2, '0') }}</p>
        <h1>Work that holds<br><span>up under load.</span></h1>
        <p class="page-intro__lead">Products, infrastructure and experiments presented as connected case studies  what they solve, how they work and who helped build them.</p>
      </div>
    </section>

    <section class="archive" aria-labelledby="archive-title">
      <div class="shell">
        <div class="archive__toolbar">
          <h2 id="archive-title">All projects</h2>
          <div v-if="projectTypes.length > 1" class="archive__filters" aria-label="Filter projects">
            <button type="button" :class="{ active: activeFilter === 'All' }" @click="activeFilter = 'All'">All <span>{{ projects.length }}</span></button>
            <button v-for="type in projectTypes" :key="type" type="button" :class="{ active: activeFilter === type }" @click="activeFilter = type">{{ type }} <span>{{ countByType(type) }}</span></button>
          </div>
        </div>

        <div v-if="status === 'pending'" class="archive__loading"><span v-for="n in 4" :key="n">Loading</span></div>
        <div v-else-if="filteredProjects.length" class="archive__grid">
          <ProjectCard v-for="(project, index) in filteredProjects" :key="project.id" :project="project" :index="index + 1" />
        </div>
        <div v-else class="archive__empty">
          <strong>00</strong><p>{{ error ? 'The live project feed is temporarily unavailable.' : 'No public projects match this filter yet.' }}</p>
          <button v-if="error" type="button" @click="refresh()">Retry data feed</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { projects, status, error, refresh } = usePortfolio()
const activeFilter = ref('All')
const projectTypes = computed(() => [...new Set(projects.value.map(project => project.project_type))].sort())
const filteredProjects = computed(() => activeFilter.value === 'All' ? projects.value : projects.value.filter(project => project.project_type === activeFilter.value))
const countByType = (type: string) => projects.value.filter(project => project.project_type === type).length

useSeoMeta({
  title: 'Projects · Pablo Diez',
  description: 'Selected backend engineering, APIs, product development and creative technology projects by Pablo Diez.',
  ogTitle: 'Projects · Pablo Diez',
  ogDescription: 'A connected archive of digital products, infrastructure and experiments.',
  ogType: 'website',
})
</script>

<style scoped>
.archive { padding: clamp(4rem, 8vw, 8rem) 0 clamp(7rem, 12vw, 12rem); }
.archive__toolbar { display: flex; margin-bottom: clamp(3rem, 6vw, 6rem); align-items: flex-end; justify-content: space-between; gap: 2rem; }.archive__toolbar h2 { margin: 0; font-size: clamp(1.7rem, 2.6vw, 2.8rem); font-weight: 600; letter-spacing: -.05em; }
.archive__filters { display: flex; max-width: 60%; flex-wrap: wrap; justify-content: flex-end; gap: .55rem; }.archive__filters button { padding: .62rem .8rem; border: 1px solid var(--line); color: var(--ink-dim); background: transparent; cursor: pointer; font-family: var(--font-mono); font-size: .58rem; letter-spacing: .06em; text-transform: uppercase; transition: .2s ease; }.archive__filters button:hover, .archive__filters button.active { border-color: var(--red); color: white; background: var(--red); }.archive__filters span { margin-left: .35rem; opacity: .7; }
.archive__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 3vw, 3.5rem); }.archive__grid > :nth-child(even) { margin-top: clamp(3rem, 7vw, 7rem); }
.archive__loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--line); }.archive__loading span { min-height: 20rem; padding: 1rem; color: var(--ink-dim); background: var(--paper-raised); font-family: var(--font-mono); font-size: .6rem; text-transform: uppercase; }
.archive__empty { display: flex; min-height: 18rem; padding: 2rem 0; align-items: center; gap: 2rem; border-block: 1px solid var(--line); }.archive__empty strong { color: var(--red); font-size: 4rem; letter-spacing: -.06em; }.archive__empty p { max-width: 26rem; color: var(--ink-dim); }.archive__empty button { margin-left: auto; padding: .75rem 1rem; border: 1px solid var(--red); color: white; background: transparent; cursor: pointer; font-family: var(--font-mono); font-size: .62rem; text-transform: uppercase; }
@media (max-width: 760px) { .archive__toolbar { align-items: flex-start; flex-direction: column; }.archive__filters { max-width: none; justify-content: flex-start; }.archive__grid, .archive__loading { grid-template-columns: 1fr; }.archive__grid > :nth-child(even) { margin-top: 0; }.archive__empty { align-items: flex-start; flex-direction: column; }.archive__empty button { margin-left: 0; } }
</style>
