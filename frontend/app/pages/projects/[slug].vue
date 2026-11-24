<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Languages } from '@lucide/vue'
import { logoForSlug, mediaForSlug } from '~/content/showcase'
import type { ProjectDetail } from '#shared/types/api'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { public: { siteUrl } } = useRuntimeConfig()
const { date, relative } = useFormat()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useFetch<ProjectDetail>(() => `/api/projects/${slug.value}`, { key: `project-${slug.value}` })
if (error.value || !data.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Project not found', fatal: true })
}
const { data: list } = await useProjects()

const project = computed(() => data.value!.project)
const client = computed(() => data.value!.client)
const repo = computed(() => data.value!.repo)
const summary = computed(() => ({ ...project.value, client: client.value, repo: null }))
const logo = computed(() => logoForSlug(slug.value))
const hasFigure = computed(() => !!project.value.image || !!mediaForSlug(slug.value))

const ordered = computed(() => sortProjects(list.value ?? []))
const next = computed(() => {
  const i = ordered.value.findIndex(p => p.slug === slug.value)
  return ordered.value.length > 1 ? ordered.value[(i + 1) % ordered.value.length] : null
})

const period = computed(() => {
  const p = project.value
  const from = p.started_at ? date(p.started_at, { month: 'short', year: 'numeric' }) : ''
  const to = p.completed_at ? date(p.completed_at, { month: 'short', year: 'numeric' }) : p.status === 'in_progress' ? t('project.now') : ''
  return [from, to].filter(Boolean).join(' – ')
})

// Case studies are authored in Spanish in the database. Strip anything executable
// defensively even though the source is trusted.
const html = computed(() => (project.value.content_html ?? '')
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  // An italic aside authored before the first heading would read as a label above
  // it: keep the owner's words unchanged, but place them right after that heading.
  .replace(/^(\s*<div>)?\s*<p>\s*(<em>[\s\S]*?<\/em>)\s*<\/p>\s*(<h[23][^>]*>[\s\S]*?<\/h[23]>)/i, '$1$3<p class="case-note">$2</p>'))
const chapters = computed(() => toChapters(html.value))
const titled = computed(() => chapters.value.filter(c => c.title))

// ── The screen grows to fill the stage as it rises (VesttaFeature's rhythm) ──
const opening = useOpeningProject()
const run = ref<HTMLElement | null>(null)
const screen = ref<HTMLElement | null>(null)

// ── Which chapter is being read ──
const reading = ref('')

onMounted(() => {
  const el = run.value
  const target = screen.value
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const heads = titled.value.map(c => document.getElementById(c.id)).filter(h => h !== null)
  reading.value = titled.value[0]?.id ?? ''
  let raf = 0
  const update = () => {
    raf = 0
    if (el && target && !still) {
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const from = window.innerHeight * 0.72
      const p = Math.min(1, Math.max(0, (from - el.getBoundingClientRect().top) / (from - header)))
      target.style.setProperty('--p', p.toFixed(4))
    }
    const line = window.innerHeight * 0.38
    let current = heads[0]?.id ?? ''
    for (const h of heads) if (h.getBoundingClientRect().top < line) current = h.id
    reading.value = current
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
})

usePageSeo({
  title: `${project.value.name} · ${t(`work.types.${project.value.project_type}`)}`,
  description: project.value.tagline ?? project.value.description,
  image: project.value.image ?? undefined,
  type: 'article',
})
useSchemaOrg([
  defineArticle({
    '@type': 'CreativeWork',
    'headline': project.value.name,
    'description': project.value.tagline ?? project.value.description,
    'image': project.value.image ?? undefined,
    'inLanguage': 'es-ES',
    'datePublished': project.value.completed_at ?? project.value.created_at,
    'dateModified': project.value.updated_at,
    'author': { '@type': 'Person', 'name': 'Pablo Diez', 'url': siteUrl },
  } as Record<string, unknown>),
  defineBreadcrumb({
    itemListElement: [
      { name: t('breadcrumb.home'), item: localePath('index') },
      { name: t('breadcrumb.projects'), item: localePath('projects') },
      { name: project.value.name, item: localePath({ name: 'projects-slug', params: { slug: slug.value } }) },
    ],
  }),
])
</script>

<template>
  <article>
    <header class="opening container-x">
      <UiCrumbs :items="[{ label: t('breadcrumb.home'), to: localePath('index') }, { label: t('breadcrumb.projects'), to: localePath('projects') }, { label: project.name }]" />
      <h1 class="title">{{ project.name }}</h1>
      <p v-if="project.tagline" class="lead tagline" lang="es">{{ project.tagline }}</p>
      <div v-if="project.live_url || project.repository_url" class="actions">
        <UiButton v-if="project.live_url" :href="project.live_url" size="md">
          {{ t('project.live') }}
          <template #icon><ArrowUpRight aria-hidden="true" /></template>
        </UiButton>
        <UiButton v-if="project.repository_url" :href="project.repository_url" variant="ghost" size="md">
          {{ t('project.code') }}
          <template #icon><ArrowUpRight aria-hidden="true" /></template>
        </UiButton>
      </div>
    </header>

    <div v-if="hasFigure" ref="run" class="premiere">
      <div class="premiere-stage">
        <div ref="screen" class="premiere-screen" :style="opening === slug ? { viewTransitionName: 'project-screen' } : undefined">
          <ProjectFigure :project="summary" class="size-full !rounded-none !shadow-none" sizes="100vw" eager />
        </div>
      </div>
    </div>

    <dl class="facts container-x" :aria-label="t('project.facts')">
      <div v-if="client">
        <dt>{{ t('project.client') }}</dt>
        <dd class="client">
          <img v-if="logo" :src="logo.src" alt="" :width="logo.width" :height="logo.height" class="logo" decoding="async">
          <a v-if="client.website" :href="client.website" target="_blank" rel="noopener" class="link-quiet">{{ client.name }}</a>
          <template v-else>{{ client.name }}</template>
        </dd>
      </div>
      <div><dt>{{ t('project.type') }}</dt><dd>{{ t(`work.types.${project.project_type}`) }}</dd></div>
      <div v-if="period"><dt>{{ t('project.period') }}</dt><dd class="tabular">{{ period }}</dd></div>
      <div><dt>{{ t('project.status') }}</dt><dd>{{ t(`project.statuses.${project.status}`) }}</dd></div>
      <div v-if="repo?.primary_language"><dt>{{ t('project.language') }}</dt><dd>{{ repo.primary_language }}</dd></div>
      <div v-if="repo?.github_pushed_at"><dt>{{ t('project.lastPush') }}</dt><dd class="tabular">{{ relative(repo.github_pushed_at) }}</dd></div>
    </dl>

    <div class="case container-x" :class="{ 'has-index': titled.length > 1 }">
      <nav v-if="titled.length > 1" class="index" :aria-label="t('project.chapters')">
        <ol lang="es">
          <li v-for="c in titled" :key="c.id">
            <a :href="`#${c.id}`" :aria-current="reading === c.id ? 'location' : undefined">{{ c.title }}</a>
          </li>
        </ol>
      </nav>

      <div class="chapters">
        <p v-if="locale !== 'es'" class="panel mb-12 flex items-start gap-3 p-5 text-[0.9375rem] text-ink-2" lang="en">
          <Languages class="mt-0.5 size-5 flex-none text-mute" aria-hidden="true" />
          {{ t('project.spanishOnly') }}
        </p>
        <template v-if="chapters.length">
          <section v-for="c in chapters" :id="c.id" :key="c.id" class="chapter" lang="es" :aria-labelledby="c.title ? `${c.id}-title` : undefined">
            <h2 v-if="c.title" :id="`${c.id}-title`" v-reveal class="h-sub">{{ c.title }}</h2>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="prose" v-html="c.html" />
          </section>
        </template>
        <div v-else class="prose" lang="es"><p>{{ project.description }}</p></div>
      </div>
    </div>

    <nav v-if="next" class="container-x" :aria-label="t('project.nextLabel')">
      <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: next.slug } })" class="next" @click="opening = next.slug">
        <span class="next-copy">
          <span class="next-name">{{ next.name }}</span>
          <span v-if="next.tagline" class="next-tagline" lang="es">{{ next.tagline }}</span>
          <span class="next-go">{{ t('project.next') }} <ArrowRight aria-hidden="true" /></span>
        </span>
        <span class="next-space">
          <span class="next-screen" :style="opening === next.slug ? { viewTransitionName: 'project-screen' } : undefined">
            <ProjectFigure :project="next" class="aspect-[16/10]" sizes="xs:100vw md:640px" still />
          </span>
        </span>
      </NuxtLink>
    </nav>

    <ContactSection />
  </article>
</template>

<style scoped>
.opening { padding-top: clamp(2rem, 4vw, 3.5rem); }
.title {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
  text-align: center;
  font-size: clamp(2.75rem, 1.2rem + 7vw, 6rem);
  font-weight: 760;
  line-height: 0.96;
  letter-spacing: -0.038em;
}
.tagline { margin: clamp(1.25rem, 2.4vw, 1.75rem) auto 0; max-width: 52ch; text-align: center; }
.actions { margin-top: clamp(1.75rem, 3vw, 2.25rem); display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }

/* The recording walks on at 70% and grows to the edges as it reaches the top. */
.premiere { margin-top: clamp(2.5rem, 5vw, 4rem); overflow: clip; }
.premiere-screen {
  --p: 0;
  --from: 0.9;
  width: 100%;
  max-width: 106rem;
  margin-inline: auto;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  transform: scale(calc(var(--from) + (1 - var(--from)) * var(--p)));
  transform-origin: 50% 0;
  border-radius: calc(var(--radius-screen) * (1 - var(--p)) / var(--from));
  box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 36px 70px -24px rgb(0 0 0 / 0.85);
}
@media (min-width: 64rem) {
  .premiere { height: calc(100svh - var(--header-h) + 28svh); }
  .premiere-stage { position: sticky; top: var(--header-h); }
  .premiere-screen { --from: 0.7; max-height: calc(100svh - var(--header-h)); }
}
@media (min-width: 106rem) { .premiere-screen { border-radius: var(--radius-screen); } }
@media (prefers-reduced-motion: reduce) {
  .premiere { height: auto; padding-inline: var(--gutter); }
  .premiere-stage { position: static; }
  .premiere-screen { transform: none; border-radius: var(--radius-screen); max-width: 80rem; }
}

.facts {
  margin-top: clamp(3rem, 6vw, 5rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9.5rem, 100%), 1fr));
  gap: 1.75rem clamp(1.25rem, 3vw, 2.5rem);
}
.facts > div { padding-top: 1rem; border-top: 1px solid var(--color-line); }
.facts dt { font-size: 0.875rem; color: var(--color-mute); }
.facts dd { margin-top: 0.375rem; font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; }
.client { display: flex; align-items: center; gap: 0.75rem; }
.logo { width: auto; height: 1.75rem; flex: none; }

.case { padding-block: var(--section); display: grid; gap: 3rem var(--gutter); }
.chapters { min-width: 0; max-width: 44rem; }
.index { display: none; }
@media (min-width: 64rem) {
  .case.has-index { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); }
  .case:not(.has-index) .chapters { margin-inline: auto; }
  .index { display: block; position: sticky; top: calc(var(--header-h) + 2.5rem); align-self: start; }
}
.index ol { border-top: 1px solid var(--color-line); }
.index li { border-bottom: 1px solid var(--color-line); }
.index a {
  display: block;
  padding: 0.875rem 0;
  font-size: 0.9375rem;
  line-height: 1.35;
  color: var(--color-mute);
  text-decoration: none;
  text-wrap: balance;
  transition: color 0.3s var(--ease-out-quart), padding-left 0.5s var(--ease-out-expo);
}
.index a:hover { color: var(--color-ink-2); }
.index a[aria-current] { color: var(--color-ink); font-weight: 650; padding-left: 0.625rem; }

.chapter + .chapter { margin-top: clamp(4rem, 7vw, 6.5rem); }
.chapter { scroll-margin-top: 1.5rem; }
.chapter h2 { max-width: 20ch; }
.prose { font-size: 1.125rem; line-height: 1.65; color: var(--color-ink-2); }
.chapter .prose { margin-top: 1.75rem; }
.prose :deep(h3) { margin-top: 2.25rem; margin-bottom: 0.75rem; font-size: 1.375rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.015em; color: var(--color-ink); }
.prose :deep(p) { margin-block: 1.1rem; max-width: 64ch; }
.prose :deep(> :first-child) { margin-top: 0; }
.prose :deep(em) { font-style: italic; }
.prose :deep(.case-note) { font-size: 1rem; color: var(--color-mute); }
.prose :deep(strong) { font-weight: 650; color: var(--color-ink); }
.prose :deep(a) { color: var(--color-ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: var(--color-line-strong); transition: text-decoration-color 0.2s; }
.prose :deep(a:hover) { text-decoration-color: currentColor; }
/* What was built reads as rows, like every list on the site. */
.prose :deep(ul), .prose :deep(ol) { margin-block: 2rem; border-top: 1px solid var(--color-line); }
.prose :deep(li) { padding: 0.875rem 0; border-bottom: 1px solid var(--color-line); color: var(--color-ink); line-height: 1.45; }
/* The line worth remembering, at stage size. */
.prose :deep(blockquote) {
  margin-block: clamp(2.5rem, 5vw, 4rem);
  font-size: clamp(1.5rem, 1.1rem + 1.7vw, 2.375rem);
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -0.025em;
  text-wrap: balance;
  color: var(--color-ink);
}
.prose :deep(code) { font-family: var(--font-mono); font-size: 0.85em; background: var(--color-raise-2); border-radius: 0.375rem; padding: 0.1em 0.4em; color: var(--color-ink); }
.prose :deep(figure) { margin-block: 2rem; }
.prose :deep(img) { width: 100%; height: auto; border-radius: var(--radius-screen); }
.prose :deep(figcaption) { margin-top: 0.75rem; font-size: 0.9375rem; color: var(--color-mute); }

.next {
  display: grid;
  gap: 2.5rem var(--gutter);
  align-items: center;
  padding-top: clamp(2.5rem, 5vw, 4rem);
  border-top: 1px solid var(--color-line);
  color: inherit;
  text-decoration: none;
}
.next-copy { display: grid; gap: 1.25rem; justify-items: start; }
.next-name { font-size: clamp(2.25rem, 1.2rem + 4vw, 4.5rem); font-weight: 750; line-height: 1; letter-spacing: -0.035em; text-wrap: balance; }
.next-tagline { max-width: 42ch; color: var(--color-ink-2); }
.next-go { display: inline-flex; align-items: center; gap: 0.4em; font-weight: 600; }
.next-go svg { width: 1.2em; height: 1.2em; transition: transform 0.45s var(--ease-out-expo); }
.next:hover .next-go svg { transform: translateX(0.25rem); }
.next-space { display: block; }
.next-screen { display: block; }
@media (min-width: 64rem) {
  .next { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  /* Waiting in the wings at an angle; it faces you when you reach for it. */
  .next-space { perspective: 1600px; perspective-origin: 20% 50%; }
  .next-screen { transform: rotateY(-16deg); transform-origin: 100% 50%; transition: transform 0.9s var(--ease-out-expo); }
  .next:hover .next-screen, .next:focus-visible .next-screen { transform: rotateY(-4deg); }
}
@media (prefers-reduced-motion: reduce) { .next-screen { transform: none; } }
</style>
