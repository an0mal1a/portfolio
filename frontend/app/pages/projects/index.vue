<script setup lang="ts">
import type { ProjectType } from '#shared/types/api'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const { data } = await useProjects()

const types: ('all' | ProjectType)[] = ['all', 'web', 'saas', 'automation', 'tool']
const active = computed(() => (types.includes(route.query.type as ProjectType) ? route.query.type as ProjectType : 'all'))
const all = computed(() => sortProjects(data.value ?? []))
const list = computed(() => (active.value === 'all' ? all.value : all.value.filter(p => p.project_type === active.value)))
const count = (type: 'all' | ProjectType) => (type === 'all' ? all.value.length : all.value.filter(p => p.project_type === type).length)
// Kinds with nothing to show are not offered.
const offered = computed(() => types.filter(type => type === 'all' || count(type) > 0))
const select = (type: 'all' | ProjectType) => router.replace({ query: type === 'all' ? {} : { type } })
const opening = useOpeningProject()
const to = (slug: string) => localePath({ name: 'projects-slug', params: { slug } })

usePageSeo({ title: t('seo.projects.title'), description: t('seo.projects.description') })
useSchemaOrg([
  defineBreadcrumb({ itemListElement: [{ name: t('breadcrumb.home'), item: localePath('index') }, { name: t('breadcrumb.projects'), item: localePath('projects') }] }),
])
</script>

<template>
  <div>
    <section class="container-x pt-[clamp(2rem,4vw,3.5rem)]">
      <h1 class="h-page max-w-[14ch]">{{ t('projects.title') }}</h1>
      <p class="lead mt-7 max-w-[56ch]">{{ t('projects.lead') }}</p>

      <div class="mt-12 flex flex-wrap gap-2" role="group" :aria-label="t('projects.filter')">
        <button
          v-for="type in offered"
          :key="type"
          type="button"
          class="filter"
          :aria-pressed="active === type"
          @click="select(type)"
        >
          {{ type === 'all' ? t('projects.all') : t(`work.types.${type}`) }}
          <span class="tabular opacity-55">{{ count(type) }}</span>
        </button>
      </div>
    </section>

    <section class="container-x pt-12" :aria-label="t('projects.listLabel')">
      <TransitionGroup tag="div" name="grid" class="grid gap-x-[var(--gutter)] gap-y-16 md:grid-cols-2">
        <article v-for="(p, i) in list" :key="p.slug" class="group" :class="{ 'md:col-span-2': i === 0 && active === 'all' }">
          <NuxtLink :to="to(p.slug)" class="block" @click="opening = p.slug">
            <ProjectFigure :project="p" :style="opening === p.slug ? { viewTransitionName: 'project-screen' } : undefined" :class="i === 0 && active === 'all' ? 'aspect-[16/10] md:aspect-[2/1]' : 'aspect-[16/10]'" :sizes="i === 0 ? 'xs:100vw lg:1400px' : 'xs:100vw md:720px'" :eager="i < 2" />
            <h2 class="mt-5 text-[1.5rem] font-bold leading-tight tracking-[-0.02em]" :class="{ 'md:text-[2.25rem]': i === 0 && active === 'all' }">{{ p.name }}</h2>
            <p class="mt-2 max-w-[60ch] text-ink-2">{{ p.tagline ?? p.description }}</p>
            <ProjectMeta :project="p" class="mt-3" />
          </NuxtLink>
        </article>
      </TransitionGroup>
      <p v-if="!list.length" class="border-t border-line py-10 text-lg text-mute">{{ t('projects.empty') }}</p>
    </section>

    <ContactSection />
  </div>
</template>

<style scoped>
.filter {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  height: 2.5rem;
  padding-inline: 1.1rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink-2);
  background: rgb(238 234 227 / 0.06);
  transition: background-color 0.2s var(--ease-out-quart), color 0.2s var(--ease-out-quart);
}
.filter:hover { background: rgb(238 234 227 / 0.12); color: var(--color-ink); }
.filter[aria-pressed="true"] { background: var(--color-ink); color: var(--color-ground); }
.grid-move, .grid-enter-active { transition: opacity 0.5s var(--ease-out-expo), transform 0.6s var(--ease-out-expo); }
.grid-enter-from { opacity: 0; transform: translateY(1rem); }
.grid-leave-active { display: none; }
</style>
