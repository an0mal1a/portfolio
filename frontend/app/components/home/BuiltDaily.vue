<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

/**
 * "And it gets built every day": the year of code as a graph, told in one
 * sentence (no stat tiles), and the one live line about this very site.
 */
const { t } = useI18n()
const { number } = useFormat()
const { data: overview } = useOverview()
const { state, latency } = useSystemStatus()
// The overview may land after SSR; keep the status line on "checking" until mounted
// so hydration matches the server HTML.
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const liveState = computed(() => (mounted.value ? state.value : 'checking'))

const summary = computed(() => overview.value?.contributions ?? null)
</script>

<template>
  <section id="cada-dia" class="daily container-x" aria-labelledby="daily-title">
    <div class="head">
      <h2 id="daily-title" v-reveal class="h-section max-w-[14ch]">{{ t('home.daily.title') }}</h2>
      <p v-reveal="1" class="lead max-w-[46ch]">{{ t('home.daily.lead') }}</p>
    </div>

    <ContributionGraph :summary="summary" class="mt-[clamp(2.5rem,5vw,4rem)]" />

    <div class="foot">
      <p v-if="summary" class="summary">
        {{ t('home.daily.summary', { total: number(summary.total), active: number(summary.activeDays), streak: number(summary.longestStreak) }) }}
      </p>
      <p class="now" aria-live="polite">
        <span class="dot" :data-state="liveState" aria-hidden="true" />
        <span>
          {{ t('home.daily.now') }}: {{ t(`facts.status.${liveState}`).toLowerCase() }}<template v-if="liveState === 'operational' && latency !== null">, {{ t('home.daily.db', { ms: number(latency) }) }}</template>.
        </span>
      </p>
      <NuxtLinkLocale to="lab" class="link-more whitespace-nowrap">{{ t('home.daily.lab') }} <ChevronRight aria-hidden="true" /></NuxtLinkLocale>
    </div>
  </section>
</template>

<style scoped>
.daily { padding-top: var(--section); }
.head { display: grid; gap: 1.5rem clamp(2.5rem, 5vw, 5rem); align-items: end; }
@media (min-width: 64rem) { .head { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); } }
.foot {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-line);
  display: grid;
  gap: 1rem 2.5rem;
  align-items: baseline;
}
@media (min-width: 64rem) { .foot { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto; } }
.summary { color: var(--color-ink-2); max-width: 52ch; }
.now { display: flex; align-items: baseline; gap: 0.75rem; color: var(--color-ink-2); }
.dot { position: relative; top: -0.1em; width: 0.5rem; height: 0.5rem; flex: none; border-radius: 999px; background: var(--color-faint); }
.dot[data-state="operational"] { background: var(--color-tally); animation: breathe 2.4s var(--ease-out-quart) infinite; }
.dot[data-state="degraded"], .dot[data-state="down"] { background: var(--color-error); }
@keyframes breathe { 50% { opacity: 0.35; } }
</style>
