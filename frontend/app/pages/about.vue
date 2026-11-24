<script setup lang="ts">
import { ArrowUpRight, ChevronRight, FileText } from '@lucide/vue'
import type { Client } from '#shared/types/api'
import { CERTIFICATES, CV_URL, STUDIES } from '~/content/credentials'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const { number, date } = useFormat()
const { public: { siteUrl } } = useRuntimeConfig()
const { data: clients } = await useFetch<Client[]>('/api/clients', { key: 'clients', default: () => [] })

const list = <T,>(key: string) => tm(key) as T[]
const principles = computed(() => list<{ title: string, body: string }>('about.principles').map(p => ({ title: rt(p.title), body: rt(p.body) })))
const stack = computed(() => list<{ group: string, items: string }>('about.stack.groups').map(g => ({ group: rt(g.group), items: rt(g.items) })))

usePageSeo({ title: t('seo.about.title'), description: t('seo.about.description'), type: 'profile', image: '/images/pablo-color.jpg' })
useSchemaOrg([
  defineWebPage({ '@type': 'ProfilePage' }),
  definePerson({
    'name': 'Pablo Diez',
    'url': siteUrl,
    'hasCredential': [...STUDIES, ...CERTIFICATES].map(c => ({
      '@type': 'EducationalOccupationalCredential',
      'name': c.name,
      'credentialCategory': STUDIES.includes(c) ? 'degree' : 'certificate',
      'recognizedBy': { '@type': 'Organization', 'name': c.issuer },
      ...(c.verify && { url: c.verify, identifier: c.credentialId }),
      ...(c.date.length === 10 && { dateCreated: c.date }),
    })),
  } as Record<string, unknown>),
  defineBreadcrumb({ itemListElement: [{ name: t('breadcrumb.home'), item: localePath('index') }, { name: t('nav.about'), item: localePath('about') }] }),
])
</script>

<template>
  <div>
    <section class="intro container-x">
      <div>
        <h1 class="h-page max-w-[13ch]">{{ t('about.title') }}</h1>
        <div class="lead mt-8 grid max-w-[60ch] gap-5">
          <p>{{ t('about.p1') }}</p>
          <p>{{ t('about.p2') }}</p>
          <p>{{ t('about.p3') }}</p>
        </div>
        <UiButton :href="CV_URL" variant="ghost" class="mt-9">
          {{ t('about.cv') }}
          <template #icon><FileText aria-hidden="true" /></template>
        </UiButton>
      </div>
      <figure>
        <div class="portrait">
          <NuxtImg src="/images/pablo-color.jpg" :alt="t('hero.portraitAlt')" width="560" height="700" densities="x1 x2" class="aspect-[4/5] w-full object-cover" loading="eager" fetchpriority="high" />
        </div>
        <figcaption class="mt-4 flex justify-between text-[0.9375rem] text-mute">
          <span class="font-semibold text-ink">Pablo Diez</span><span>{{ t('contact.place') }}</span>
        </figcaption>
      </figure>
    </section>

    <section class="part container-x" aria-labelledby="principles-title">
      <h2 id="principles-title" class="h-sub max-w-[16ch]">{{ t('about.principlesTitle') }}</h2>
      <dl class="rows">
        <div v-for="p in principles" :key="p.title">
          <dt>{{ p.title }}</dt>
          <dd>{{ p.body }}</dd>
        </div>
      </dl>
    </section>

    <section class="part container-x" aria-labelledby="stack-title">
      <div class="panel stack">
        <div>
          <h2 id="stack-title" class="h-sub">{{ t('about.stack.title') }}</h2>
          <p class="mt-5 max-w-[44ch] text-ink-2">{{ t('about.stack.lead') }}</p>
          <NuxtLinkLocale to="lab" class="link-more mt-8">{{ t('wall.lab') }} <ChevronRight aria-hidden="true" /></NuxtLinkLocale>
        </div>
        <dl class="stack-list">
          <div v-for="g in stack" :key="g.group">
            <dt>{{ g.group }}</dt>
            <dd>{{ g.items }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="part container-x" aria-labelledby="credentials-title">
      <div class="grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 id="credentials-title" class="h-sub max-w-[12ch]">{{ t('about.credentials.title') }}</h2>
          <p class="mt-5 max-w-[36ch] text-ink-2">{{ t('about.credentials.lead') }}</p>
        </div>
        <ul class="credentials lg:col-span-8">
          <li v-for="c in [...STUDIES, ...CERTIFICATES]" :key="c.id" class="credential">
            <div>
              <h3 class="credential-name" lang="es">{{ c.name }}</h3>
              <p class="credential-meta tabular">
                {{ c.issuer }} · {{ c.date.length === 10 ? date(c.date, { month: 'long', year: 'numeric' }) : c.date }}<template v-if="c.hours"> · {{ t('about.credentials.hours', { n: number(c.hours) }) }}</template>
              </p>
            </div>
            <a v-if="c.verify" :href="c.verify" target="_blank" rel="noopener" class="link-more" :aria-label="t('about.credentials.verifyOf', { name: c.name })">
              {{ t('about.credentials.verify') }} <ArrowUpRight aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="clients?.length" class="part container-x" aria-labelledby="clients-title">
      <div class="grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
        <h2 id="clients-title" class="h-sub max-w-[12ch] lg:col-span-4">{{ t('about.clients') }}</h2>
        <ul class="border-t border-line lg:col-span-8">
          <li v-for="c in clients" :key="c.id" class="border-b border-line">
            <component :is="c.website ? 'a' : 'span'" :href="c.website ?? undefined" :target="c.website ? '_blank' : undefined" :rel="c.website ? 'noopener' : undefined" class="group flex items-center justify-between gap-6 py-5 text-[clamp(1.375rem,1rem+1vw,2rem)] font-bold tracking-[-0.025em]">
              {{ c.name }}
              <ArrowUpRight v-if="c.website" class="size-5 flex-none text-mute transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
            </component>
          </li>
        </ul>
      </div>
    </section>

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
@media (min-width: 64rem) { .intro { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); } }
.portrait { overflow: hidden; border-radius: var(--radius-panel); background: var(--color-raise); }
.part { padding-top: var(--section); }
.rows { margin-top: clamp(2.5rem, 5vw, 3.5rem); border-top: 1px solid var(--color-line); }
.rows > div { display: grid; gap: 0.5rem var(--gutter); padding: 1.5rem 0; border-bottom: 1px solid var(--color-line); }
@media (min-width: 48rem) { .rows > div { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: baseline; } }
.rows dt { font-size: clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem); font-weight: 700; letter-spacing: -0.015em; }
.rows dd { color: var(--color-ink-2); max-width: 56ch; }
.credentials { border-top: 1px solid var(--color-line); }
.credential { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1.5rem; padding: 1.25rem 0; border-bottom: 1px solid var(--color-line); }
.credential-name { font-size: clamp(1.1875rem, 1rem + 0.5vw, 1.4375rem); font-weight: 700; line-height: 1.25; letter-spacing: -0.015em; }
.credential-meta { margin-top: 0.25rem; font-size: 0.9375rem; color: var(--color-mute); }
.stack { display: grid; gap: 2.5rem var(--gutter); padding: clamp(2rem, 5vw, 4rem); }
@media (min-width: 64rem) { .stack { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); } }
.stack-list { border-top: 1px solid var(--color-line); }
.stack-list > div { display: grid; gap: 0.375rem 1.5rem; padding: 1.125rem 0; border-bottom: 1px solid var(--color-line); }
@media (min-width: 40rem) { .stack-list > div { grid-template-columns: 10rem 1fr; align-items: baseline; } }
.stack-list dt { font-size: 0.9375rem; color: var(--color-mute); }
.stack-list dd { font-size: 1.0625rem; color: var(--color-ink); }
</style>
