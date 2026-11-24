<script setup lang="ts">
import { RefreshCw } from '@lucide/vue'
import type { GitHubProfile, JobType, ReposPayload, ServiceState } from '#shared/types/api'

const { t } = useI18n()
const localePath = useLocalePath()
const { number, relative, duration } = useFormat()

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

    <CodeYear :summary="profile?.contributions ?? null" />
    <RepoExplorer :data="repos" />

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
</style>
