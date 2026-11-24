<script setup lang="ts">
import { ArrowRight, ChevronRight } from '@lucide/vue'
import { getServices, type ServiceId } from '~/content/services'

/** Shared template of the three service landings (one search intent per URL). */
const props = defineProps<{ id: ServiceId }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { public: { siteUrl } } = useRuntimeConfig()

const service = computed(() => getServices(locale.value)[props.id])
const { data: projects } = await useProjects()
const related = computed(() => sortProjects((projects.value ?? []).filter(p => service.value.projectTypes.includes(p.project_type))))
const heroProject = computed(() => related.value.find(p => p.slug === service.value.heroSlug && p.image) ?? related.value.find(p => p.image) ?? related.value[0])
const to = (slug: string) => localePath({ name: 'projects-slug', params: { slug } })

usePageSeo({ title: service.value.seo.title, description: service.value.seo.description, titleTemplate: false })
useSchemaOrg([
  defineService({
    'name': service.value.name,
    'description': service.value.seo.description,
    'serviceType': service.value.name,
    'provider': { '@id': `${siteUrl}/#business` },
    'areaServed': [{ '@type': 'Place', 'name': 'Ibiza' }, { '@type': 'Country', 'name': 'España' }],
    'availableLanguage': ['es', 'en'],
  } as Record<string, unknown>),
  defineBreadcrumb({
    itemListElement: [
      { name: t('breadcrumb.home'), item: localePath('index') },
      { name: service.value.name, item: localePath(props.id) },
    ],
  }),
])
</script>

<template>
  <div>
    <section class="intro container-x">
      <div class="intro-copy">
        <UiCrumbs :items="[{ label: t('breadcrumb.home'), to: localePath('index') }, { label: service.name }]" />
        <h1 class="title">{{ service.h1 }}</h1>
        <p class="lead mt-7 max-w-[58ch]">{{ service.lead }}</p>
        <div class="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
          <UiButton :to="localePath('contact')" size="lg">
            {{ t('cta.primary') }}
            <template #icon><ArrowRight aria-hidden="true" /></template>
          </UiButton>
          <a v-if="related.length" href="#trabajo" class="link-more">{{ t('service.seeWork') }} <ChevronRight aria-hidden="true" /></a>
        </div>
      </div>
      <NuxtLink v-if="heroProject" :to="to(heroProject.slug)" class="intro-figure group">
        <ProjectFigure :project="heroProject" class="aspect-[16/10]" sizes="xs:100vw lg:720px" eager />
        <p class="mt-4 flex justify-between gap-4 text-[0.9375rem] text-mute">
          <span class="font-semibold text-ink">{{ heroProject.name }}</span>
          <span>{{ t(`work.types.${heroProject.project_type}`) }}</span>
        </p>
      </NuxtLink>
    </section>

    <section class="part container-x" aria-labelledby="for-whom">
      <h2 id="for-whom" class="h-sub max-w-[18ch]">{{ t('service.forWhom') }}</h2>
      <ul class="for-whom">
        <li v-for="item in service.forWhom" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </li>
      </ul>
    </section>

    <section class="part container-x" aria-labelledby="included">
      <h2 id="included" class="h-sub max-w-[18ch]">{{ t('service.included') }}</h2>
      <dl class="included">
        <div v-for="item in service.deliverables" :key="item.title">
          <dt>{{ item.title }}</dt>
          <dd>{{ item.body }}</dd>
        </div>
      </dl>
    </section>

    <section class="part container-x" aria-labelledby="process">
      <div class="panel process">
        <h2 id="process" class="h-sub max-w-[16ch]">{{ t('service.process') }}</h2>
        <ol class="steps">
          <li v-for="(step, i) in service.steps" :key="step.title" :style="{ '--n': i + 1, '--of': service.steps.length }">
            <span class="course" aria-hidden="true" />
            <p class="step-of tabular" :aria-label="t('service.step', { n: i + 1, total: service.steps.length })">{{ t('service.stepOf', { n: i + 1, total: service.steps.length }) }}</p>
            <h3>{{ step.title }}</h3>
            <p class="body">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section v-if="related.length" id="trabajo" class="part container-x" aria-labelledby="service-work">
      <h2 id="service-work" class="h-sub max-w-[20ch]">{{ service.workTitle }}</h2>
      <div class="work">
        <article v-for="p in related" :key="p.slug" class="group">
          <NuxtLink :to="to(p.slug)" class="block">
            <ProjectFigure :project="p" class="aspect-[16/10]" sizes="xs:100vw md:720px" />
            <h3 class="mt-5 text-[1.375rem] font-bold leading-tight tracking-[-0.015em]">{{ p.name }}</h3>
            <p class="mt-2 max-w-[56ch] text-ink-2">{{ p.tagline ?? p.description }}</p>
            <ProjectMeta :project="p" class="mt-3" />
          </NuxtLink>
        </article>
      </div>
    </section>

    <FaqList :items="service.faq" :title="t('home.faq.title')" :heading-id="`${props.id}-faq`" />
    <ContactSection />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 3.5rem var(--gutter);
  padding-top: clamp(2rem, 4vw, 3.5rem);
  align-items: end;
}
@media (min-width: 64rem) { .intro { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } }
.title {
  margin-top: clamp(2rem, 4vw, 3rem);
  max-width: 20ch;
  font-size: clamp(2.375rem, 1.3rem + 3.4vw, 4.25rem);
  font-weight: 760;
  line-height: 1;
  letter-spacing: -0.036em;
}
.part { padding-top: var(--section); }
.for-whom { margin-top: clamp(2.5rem, 5vw, 3.5rem); display: grid; gap: 2.5rem var(--gutter); }
@media (min-width: 48rem) { .for-whom { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.for-whom li { border-top: 1px solid var(--color-line); padding-top: 1.5rem; }
.for-whom h3 { font-size: clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem); font-weight: 700; line-height: 1.25; letter-spacing: -0.015em; }
.for-whom p { margin-top: 0.75rem; color: var(--color-ink-2); }
.included { margin-top: clamp(2.5rem, 5vw, 3.5rem); border-top: 1px solid var(--color-line); }
.included > div { display: grid; gap: 0.5rem var(--gutter); padding: 1.5rem 0; border-bottom: 1px solid var(--color-line); }
@media (min-width: 48rem) { .included > div { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: baseline; } }
.included dt { font-size: clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem); font-weight: 700; letter-spacing: -0.015em; }
.included dd { color: var(--color-ink-2); max-width: 56ch; }
.process { padding: clamp(2rem, 5vw, 4rem); }
.steps { margin-top: clamp(2.5rem, 5vw, 3.5rem); display: grid; gap: 2.5rem clamp(1.5rem, 3vw, 2.5rem); }
@media (min-width: 48rem) { .steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 72rem) { .steps { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.steps li { position: relative; padding-top: 1.5rem; }
/* Each step's rule carries how far along the work is by then. */
.steps li::before { content: ""; position: absolute; inset: 0 0 auto; height: 1px; background: var(--color-line); }
.course { position: absolute; top: -1px; left: 0; height: 3px; border-radius: 2px; width: calc(var(--n) / var(--of) * 100%); background: var(--color-ink); }
.step-of { font-size: 0.875rem; color: var(--color-mute); }
.steps h3 { margin-top: 0.5rem; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.015em; }
.steps .body { margin-top: 0.625rem; color: var(--color-ink-2); }
.work { margin-top: clamp(2.5rem, 5vw, 3.5rem); display: grid; gap: 3.5rem var(--gutter); }
@media (min-width: 48rem) { .work { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
