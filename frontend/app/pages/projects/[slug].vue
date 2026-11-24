<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Languages } from '@lucide/vue'
import { mediaForSlug } from '~/content/showcase'
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
    <header class="container-x pb-12 pt-[clamp(2rem,4vw,3.5rem)]">
      <UiCrumbs :items="[{ label: t('breadcrumb.home'), to: localePath('index') }, { label: t('breadcrumb.projects'), to: localePath('projects') }, { label: project.name }]" />
      <div class="mt-10 grid gap-x-[var(--gutter)] gap-y-8 md:mt-12 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <h1 class="h-page">{{ project.name }}</h1>
          <p v-if="project.tagline" class="lead mt-6 max-w-[54ch]">{{ project.tagline }}</p>
          <ProjectMeta :project="summary" class="mt-6" />
        </div>
        <div class="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <UiButton v-if="project.live_url" :href="project.live_url" size="md">
            {{ t('project.live') }}
            <template #icon><ArrowUpRight aria-hidden="true" /></template>
          </UiButton>
          <UiButton v-if="project.repository_url" :href="project.repository_url" variant="ghost" size="md">
            {{ t('project.code') }}
            <template #icon><ArrowUpRight aria-hidden="true" /></template>
          </UiButton>
        </div>
      </div>
    </header>

    <div v-if="hasFigure" class="container-x">
      <ProjectFigure :project="summary" class="aspect-[16/10]" sizes="xs:100vw lg:1400px" eager />
    </div>

    <div class="container-x grid gap-x-[var(--gutter)] gap-y-12 py-[var(--section)] lg:grid-cols-12">
      <aside class="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <dl class="meta">
          <div><dt>{{ t('project.type') }}</dt><dd>{{ t(`work.types.${project.project_type}`) }}</dd></div>
          <div v-if="client">
            <dt>{{ t('project.client') }}</dt>
            <dd>
              <a v-if="client.website" :href="client.website" target="_blank" rel="noopener" class="link-quiet">{{ client.name }}</a>
              <template v-else>{{ client.name }}</template>
            </dd>
          </div>
          <div v-if="period"><dt>{{ t('project.period') }}</dt><dd class="tabular">{{ period }}</dd></div>
          <div><dt>{{ t('project.status') }}</dt><dd>{{ t(`project.statuses.${project.status}`) }}</dd></div>
          <div v-if="repo?.primary_language"><dt>{{ t('project.language') }}</dt><dd>{{ repo.primary_language }}</dd></div>
          <div v-if="repo?.github_pushed_at"><dt>{{ t('project.lastPush') }}</dt><dd class="tabular">{{ relative(repo.github_pushed_at) }}</dd></div>
          <div v-if="repo"><dt>{{ t('project.repo') }}</dt><dd>{{ repo.visibility === 'private' ? t('project.private') : t('project.public') }}</dd></div>
        </dl>
      </aside>

      <div class="lg:col-span-7 lg:col-start-6">
        <p v-if="locale !== 'es'" class="panel mb-10 flex items-start gap-3 p-5 text-[0.9375rem] text-ink-2" lang="en">
          <Languages class="mt-0.5 size-5 flex-none text-mute" aria-hidden="true" />
          {{ t('project.spanishOnly') }}
        </p>
        <div v-if="html" class="case-prose" lang="es" v-html="html" />
        <p v-else class="case-prose" lang="es">{{ project.description }}</p>
      </div>
    </div>

    <nav v-if="next" class="container-x" :aria-label="t('project.nextLabel')">
      <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: next.slug } })" class="next group">
        <div>
          <span class="block text-[0.9375rem] text-mute">{{ t('project.next') }}</span>
          <span class="mt-3 flex items-center gap-4 text-[clamp(2rem,1.3rem+3vw,4rem)] font-bold leading-none tracking-[-0.035em]">
            {{ next.name }}
            <ArrowRight class="size-8 flex-none transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2" aria-hidden="true" />
          </span>
        </div>
        <ProjectFigure :project="next" class="aspect-[16/10]" sizes="xs:100vw md:480px" still />
      </NuxtLink>
    </nav>

    <ContactSection />
  </article>
</template>

<style scoped>
.meta { border-top: 1px solid var(--color-line); }
.meta > div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--color-line);
  font-size: 0.9375rem;
}
.meta dt { color: var(--color-mute); }
.meta dd { text-align: right; color: var(--color-ink); }

.next {
  display: grid;
  gap: 1.5rem var(--gutter);
  padding-top: 2rem;
  border-top: 1px solid var(--color-line);
  align-items: end;
}
@media (min-width: 48rem) { .next { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); } }

.case-prose { max-width: 68ch; font-size: 1.125rem; line-height: 1.7; color: var(--color-ink-2); }
.case-prose :deep(h2) { margin-top: 3.25rem; margin-bottom: 1rem; font-size: clamp(1.625rem, 1.2rem + 1.2vw, 2.25rem); font-weight: 720; line-height: 1.1; letter-spacing: -0.025em; color: var(--color-ink); }
.case-prose :deep(h2:first-child) { margin-top: 0; }
.case-prose :deep(h3) { margin-top: 2.25rem; margin-bottom: 0.75rem; font-size: 1.375rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.015em; color: var(--color-ink); }
.case-prose :deep(p) { margin-block: 1.1rem; }
.case-prose :deep(em) { font-style: italic; }
.case-prose :deep(.case-note) { margin-top: -0.25rem; font-size: 1rem; color: var(--color-mute); }
.case-prose :deep(strong) { font-weight: 650; color: var(--color-ink); }
.case-prose :deep(a) { color: var(--color-ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: var(--color-line-strong); transition: text-decoration-color 0.2s; }
.case-prose :deep(a:hover) { text-decoration-color: currentColor; }
.case-prose :deep(ul), .case-prose :deep(ol) { margin-block: 1.25rem; padding-left: 1.25rem; }
.case-prose :deep(ul) { list-style: disc; }
.case-prose :deep(ol) { list-style: decimal; }
.case-prose :deep(li) { margin-block: 0.45rem; padding-left: 0.25rem; }
.case-prose :deep(li::marker) { color: var(--color-mute); }
.case-prose :deep(blockquote) { margin-block: 2rem; padding-left: 1.25rem; box-shadow: inset 2px 0 0 var(--color-line-strong); font-size: 1.25rem; color: var(--color-ink); }
.case-prose :deep(code) { font-family: var(--font-mono); font-size: 0.85em; background: var(--color-raise-2); border-radius: 0.375rem; padding: 0.1em 0.4em; color: var(--color-ink); }
.case-prose :deep(img) { margin-block: 2rem; width: 100%; height: auto; border-radius: var(--radius-screen); }
</style>
