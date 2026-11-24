<script setup lang="ts">
import { ArrowUpRight, ChevronRight, RefreshCw, Star } from '@lucide/vue'
import type { GitHubProfile, JobType, ReposPayload, ServiceState } from '#shared/types/api'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { number, relative, duration, date } = useFormat()

const [{ data: profile }, { data: repos }] = await Promise.all([
  useFetch<GitHubProfile>('/api/github/profile', { key: 'gh-profile' }),
  useFetch<ReposPayload>('/api/github/repos', { key: 'gh-repos' }),
])
const status = useSystemStatus()

// Keep the panel live while the page is open.
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => status.refresh(), 20_000) })
onBeforeUnmount(() => clearInterval(timer))

type Tone = 'ok' | 'warn' | 'down' | 'idle'
const tone = (s: ServiceState | undefined): Tone =>
  s === 'healthy' || s === 'operational' ? 'ok' : s === 'disabled' || s === undefined ? 'idle' : s === 'degraded' || s === 'running' || s === 'timeout' ? 'warn' : 'down'

const services = computed(() => {
  const s = status.data.value
  if (!s) return []
  return [
    { id: 'api', name: t('lab.svc.api'), tone: s.reachable ? tone(s.status) : 'down' as Tone, value: s.reachable ? `v${s.api_version} · ${t('lab.uptime', { d: duration(s.uptime_seconds) })}` : t('lab.unreachable') },
    { id: 'db', name: t('lab.svc.db'), tone: tone(s.services.database.status), value: s.services.database.latency_ms !== null ? `${number(s.services.database.latency_ms)} ms` : t(`lab.state.${s.services.database.status}`, s.services.database.status) },
    { id: 'worker', name: t('lab.svc.worker'), tone: tone(s.services.python_worker.status), value: s.services.python_worker.latency_ms !== null ? `${number(s.services.python_worker.latency_ms)} ms` : t(`lab.state.${s.services.python_worker.status}`, s.services.python_worker.status) },
    { id: 'smtp', name: t('lab.svc.smtp'), tone: tone(s.services.smtp.status), value: s.services.smtp.latency_ms !== null ? `${number(s.services.smtp.latency_ms)} ms` : t(`lab.state.${s.services.smtp.status}`, s.services.smtp.status) },
    { id: 'github', name: t('lab.svc.github'), tone: tone(s.github.status), value: s.github.last_sync ? t('lab.lastSync', { when: relative(s.github.last_sync) }) : t('lab.state.unknown') },
  ]
})

const archNodes = computed(() => [
  { name: t('lab.arch.browser'), role: t('lab.arch.browserRole'), live: false },
  { name: 'Nuxt · Nitro', role: t('lab.arch.nuxtRole'), live: false },
  { name: 'API · Rust (Axum)', role: t('lab.arch.apiRole'), live: true },
  { name: 'PostgreSQL', role: t('lab.arch.dbRole'), live: true },
  { name: 'Worker · Python (FastAPI)', role: t('lab.arch.workerRole'), live: true },
])

// ── Public sync ───────────────────────────────────────────────────────────
const job = usePublicJob()
const jobType = ref<JobType>('profile')
async function sync(type: JobType) {
  jobType.value = type
  await job.start(type)
}
watch(() => job.run.value?.status, (s) => {
  if (s === 'completed') {
    status.refresh()
    refreshNuxtData(['gh-profile', 'gh-repos'])
  }
})
onBeforeUnmount(() => job.stop())
const jobError = computed(() => (job.error.value ? t(`lab.sync.errors.${job.error.value}`) : ''))

// ── Data views ────────────────────────────────────────────────────────────
const summary = computed(() => profile.value?.contributions ?? null)
const weekdays = computed(() => {
  const values = summary.value?.byWeekday ?? []
  const max = Math.max(1, ...values)
  const names = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale.value === 'en' ? 'en-GB' : 'es-ES', { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))))
  return values.map((v, i) => ({ name: names[i], value: v, share: v / max }))
})
const months = computed(() => {
  const values = summary.value?.byMonth ?? []
  const max = Math.max(1, ...values.map(m => m.count))
  return values.map(m => ({ label: date(`${m.month}-15`, { month: 'short' }), full: date(`${m.month}-15`, { month: 'long', year: 'numeric' }), value: m.count, share: m.count / max }))
})
const languages = computed(() => {
  const list = repos.value?.languages ?? []
  const max = Math.max(1, ...list.map(l => l.repos))
  return list.slice(0, 10).map(l => ({ ...l, share: l.repos / max }))
})
// Offensive-security tooling stays on GitHub but out of the sales site (brand: no hacker theatre).
const HIDDEN_REPOS = new Set(['DarkSpecter'])
const publicRepos = computed(() => (repos.value?.repos ?? [])
  .filter(r => r.visibility === 'public' && !r.is_fork && !HIDDEN_REPOS.has(r.display_name))
  .sort((a, b) => (b.github_pushed_at ?? '').localeCompare(a.github_pushed_at ?? ''))
  .slice(0, 8))

usePageSeo({ title: t('seo.lab.title'), description: t('seo.lab.description') })
useSchemaOrg([
  defineBreadcrumb({ itemListElement: [{ name: t('breadcrumb.home'), item: localePath('index') }, { name: t('nav.lab'), item: localePath('lab') }] }),
])
</script>

<template>
  <div>
    <section class="intro container-x">
      <div>
        <h1 class="h-page max-w-[12ch]">{{ t('lab.title') }}</h1>
        <p class="lead mt-7 max-w-[52ch]">{{ t('lab.lead') }}</p>

        <figure class="mt-12 max-w-[36rem]">
          <figcaption class="text-[0.9375rem] font-semibold text-ink-2">{{ t('lab.arch.title') }}</figcaption>
          <ol class="arch mt-5">
            <li v-for="node in archNodes" :key="node.name" class="arch-node" :class="{ 'is-live': node.live }">
              <span class="arch-dot" aria-hidden="true" />
              <span class="font-semibold">{{ node.name }}</span>
              <span class="text-[0.9375rem] text-mute">{{ node.role }}</span>
            </li>
          </ol>
        </figure>
      </div>

      <!-- Live system panel -->
      <div class="panel system">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-4">
          <h2 class="text-[1.125rem] font-bold">{{ t('lab.system') }}</h2>
          <p class="text-[0.875rem] text-mute tabular" aria-live="polite">
            <template v-if="status.data.value">{{ t('lab.observed', { when: relative(status.data.value.observed_at) }) }}</template>
            <template v-else>{{ t('facts.status.checking') }}</template>
          </p>
        </div>
        <ul :aria-busy="!status.data.value">
          <li v-for="svc in services" :key="svc.id" class="flex items-center justify-between gap-4 border-b border-line py-3.5 text-[0.9375rem]">
            <span class="flex items-center gap-3 whitespace-nowrap"><span class="dot flex-none" :data-tone="svc.tone" aria-hidden="true" />{{ svc.name }}</span>
            <span class="text-right text-mute tabular">{{ svc.value }}</span>
          </li>
          <template v-if="!status.data.value">
            <li v-for="i in 5" :key="i" class="h-[3.1rem] border-b border-line"><span class="skeleton" /></li>
          </template>
        </ul>

        <div class="mt-7">
          <p class="text-[1.0625rem] font-semibold">{{ t('lab.sync.title') }}</p>
          <p class="mt-2 text-[0.9375rem] text-ink-2">{{ t('lab.sync.body') }}</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <UiButton size="sm" :disabled="job.busy.value" @click="sync('profile')">
              {{ t('lab.sync.profile') }}
              <template #icon><RefreshCw :class="{ 'animate-spin': job.busy.value && jobType === 'profile' }" aria-hidden="true" /></template>
            </UiButton>
            <UiButton size="sm" variant="ghost" :disabled="job.busy.value" @click="sync('repo_sync')">
              {{ t('lab.sync.repos') }}
            </UiButton>
          </div>
          <div v-if="job.run.value" class="mt-5" aria-live="polite">
            <div class="h-1 w-full overflow-hidden rounded-full bg-line" role="progressbar" :aria-valuenow="Math.round(job.run.value.progress)" aria-valuemin="0" aria-valuemax="100" :aria-label="t('lab.sync.progress')">
              <div class="h-full rounded-full bg-tally transition-[width] duration-500 ease-[var(--ease-out-expo)]" :style="{ width: `${Math.max(2, job.run.value.progress)}%` }" />
            </div>
            <p class="mt-2.5 flex justify-between gap-4 text-[0.875rem] text-mute tabular">
              <span>{{ job.run.value.message ?? t(`lab.sync.states.${job.run.value.status}`) }}</span>
              <span>{{ Math.round(job.run.value.progress) }}%</span>
            </p>
          </div>
          <p v-if="jobError" class="mt-4 text-[0.9375rem] text-error" role="alert">{{ jobError }}</p>
          <p v-if="job.remaining.value !== null" class="mt-3 text-[0.875rem] text-mute">{{ t('lab.sync.remaining', { n: job.remaining.value }) }}</p>
        </div>
      </div>
    </section>

    <section class="part container-x" aria-labelledby="graph-title">
      <h2 id="graph-title" class="h-sub max-w-[16ch]">{{ t('lab.graph.title') }}</h2>
      <p class="mt-5 max-w-[56ch] text-ink-2">{{ t('lab.graph.lead') }}</p>
      <ContributionGraph :summary="summary" class="mt-10" />
      <p v-if="summary" class="mt-2 max-w-[60ch] text-ink-2">
        {{ t('home.daily.summary', { total: number(summary.total), active: number(summary.activeDays), streak: number(summary.longestStreak) }) }}
      </p>
    </section>

    <section class="part container-x grid gap-x-[var(--gutter)] gap-y-16 lg:grid-cols-12" aria-labelledby="rhythm-title">
      <div class="lg:col-span-5">
        <h2 id="rhythm-title" class="h-sub">{{ t('lab.rhythm.title') }}</h2>
        <p class="mt-5 max-w-[44ch] text-ink-2">{{ t('lab.rhythm.lead') }}</p>
        <ol class="mt-10 grid gap-2.5">
          <li v-for="d in weekdays" :key="d.name" class="grid grid-cols-[3.5rem_1fr_4rem] items-center gap-3 text-[0.9375rem]">
            <span class="text-mute">{{ d.name }}</span>
            <span class="bar"><span :style="{ width: `${d.share * 100}%` }" /></span>
            <span class="text-right tabular">{{ number(d.value) }}</span>
          </li>
        </ol>
      </div>
      <div class="lg:col-span-6 lg:col-start-7">
        <h3 class="text-[1.125rem] font-bold">{{ t('lab.rhythm.months') }}</h3>
        <ol class="mt-8 flex h-56 items-end gap-1.5 border-b border-line-strong">
          <li v-for="m in months" :key="m.full" class="group relative flex h-full flex-1 flex-col justify-end" :title="`${m.full}: ${number(m.value)}`">
            <span class="absolute -top-1 left-1/2 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-1.5 py-1 text-[0.75rem] font-semibold text-ground tabular group-hover:block">{{ number(m.value) }}</span>
            <span class="block rounded-t-[3px] bg-ink-2 transition-colors group-hover:bg-ink" :style="{ height: `${Math.max(2, m.share * 100)}%` }" />
          </li>
        </ol>
        <ol class="mt-2 flex gap-1.5" aria-hidden="true">
          <li v-for="m in months" :key="m.full" class="flex-1 text-center text-[0.6875rem] text-mute">{{ m.label.slice(0, 3) }}</li>
        </ol>
        <table class="sr-only">
          <caption>{{ t('lab.rhythm.months') }}</caption>
          <tbody><tr v-for="m in months" :key="m.full"><th scope="row">{{ m.full }}</th><td>{{ m.value }}</td></tr></tbody>
        </table>
      </div>
    </section>

    <section class="part container-x grid gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-12" aria-labelledby="stack-title">
      <div class="lg:col-span-5">
        <h2 id="stack-title" class="h-sub">{{ t('lab.languages.title') }}</h2>
        <p class="mt-5 max-w-[44ch] text-ink-2">{{ t('lab.languages.lead', { repos: number(repos?.totals.repos ?? 0), langs: number(repos?.languages.length ?? 0) }) }}</p>
        <ol class="mt-10 grid gap-3">
          <li v-for="l in languages" :key="l.language" class="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3 text-[0.9375rem]">
            <span class="truncate font-medium">{{ l.language }}</span>
            <span class="bar"><span :style="{ width: `${l.share * 100}%` }" /></span>
            <span class="text-right tabular">{{ l.repos }}</span>
          </li>
        </ol>
      </div>
      <div class="lg:col-span-6 lg:col-start-7">
        <h2 class="h-sub">{{ t('lab.repos.title') }}</h2>
        <p class="mt-5 max-w-[48ch] text-ink-2">{{ t('lab.repos.lead', { pub: number(repos?.totals.public ?? 0), priv: number(repos?.totals.private ?? 0) }) }}</p>
        <ul class="mt-8 border-t border-line">
          <li v-for="r in publicRepos" :key="r.id" class="border-b border-line">
            <a :href="r.repository_url ?? `https://github.com/${r.full_name}`" target="_blank" rel="noopener" class="group grid gap-1.5 py-4">
              <span class="flex items-center justify-between gap-4">
                <span class="font-semibold">{{ r.display_name }}</span>
                <ArrowUpRight class="size-4 flex-none text-mute transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </span>
              <span v-if="r.description" class="text-[0.9375rem] leading-snug text-ink-2">{{ r.description }}</span>
              <span class="flex flex-wrap gap-x-3 text-[0.875rem] text-mute tabular">
                <span v-if="r.primary_language" class="text-ink-2">{{ r.primary_language }}</span>
                <span v-if="r.stars_count" class="inline-flex items-center gap-1"><Star class="size-3" aria-hidden="true" />{{ r.stars_count }}</span>
                <span v-if="r.github_pushed_at">{{ relative(r.github_pushed_at) }}</span>
              </span>
            </a>
          </li>
        </ul>
        <a href="https://github.com/an0mal1a" target="_blank" rel="noopener me" class="link-more mt-8">{{ t('lab.repos.all') }} <ChevronRight aria-hidden="true" /></a>
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
}
@media (min-width: 64rem) { .intro { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; } }
.part { padding-top: var(--section); }
.system { padding: clamp(1.5rem, 3vw, 2.25rem); }

/* Request path: a line through the stops, live services marked in tally. */
.arch-node {
  position: relative;
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  column-gap: 0.75rem;
  row-gap: 0.125rem;
  padding: 0.75rem 0;
}
.arch-node > :nth-child(3) { grid-column: 2; }
.arch-node::before {
  content: "";
  position: absolute;
  left: 0.34rem;
  top: 1.75rem;
  bottom: -0.6rem;
  width: 1px;
  background: var(--color-line-strong);
}
.arch-node:last-child::before { display: none; }
.arch-dot { width: 0.6875rem; height: 0.6875rem; margin-top: 0.42rem; border-radius: 999px; border: 1px solid var(--color-line-strong); background: var(--color-ground); }
.is-live .arch-dot { border-color: var(--color-tally); background: var(--color-tally); }

.dot { width: 0.5rem; height: 0.5rem; border-radius: 999px; background: var(--color-faint); }
.dot[data-tone="ok"] { background: var(--color-tally); }
.dot[data-tone="warn"] { background: var(--color-ink-2); }
.dot[data-tone="down"] { background: var(--color-error); }
.skeleton { display: block; height: 0.6rem; margin-top: 1.25rem; width: 60%; border-radius: 999px; background: var(--color-raise-2); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.4; } }
.bar { display: block; height: 0.625rem; border-radius: 999px; background: var(--color-line); overflow: hidden; }
.bar > span { display: block; height: 100%; border-radius: 999px; background: var(--color-ink-2); }
</style>
