<script setup lang="ts">
import { X } from '@lucide/vue'
import type { ContributionDay, ContributionSummary } from '#shared/types/api'

/**
 * A year of contributions, and the two questions it answers: which month, which
 * weekday. Both charts are filters: picking one lights only those days in the
 * graph above and rewrites the sentence under it.
 */
const props = defineProps<{ summary: ContributionSummary | null }>()
const { t, tm, rt, locale } = useI18n()
const { number, date } = useFormat()

type Pick = { kind: 'month', key: string } | { kind: 'weekday', key: number }
const pick = ref<Pick | null>(null)
const is = (kind: Pick['kind'], key: string | number) => pick.value?.kind === kind && pick.value.key === key
function toggle(kind: Pick['kind'], key: string | number) {
  pick.value = is(kind, key) ? null : { kind, key } as Pick
}

const weekdayOf = (iso: string) => (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7
const match = computed(() => {
  const p = pick.value
  if (!p) return null
  return (d: ContributionDay) => (p.kind === 'month' ? d[0].startsWith(p.key) : weekdayOf(d[0]) === p.key)
})

const weekday = (i: number, width: 'short' | 'long') =>
  new Intl.DateTimeFormat(locale.value === 'en' ? 'en-GB' : 'es-ES', { weekday: width, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)))
const weekdays = computed(() => {
  const values = props.summary?.byWeekday ?? []
  const max = Math.max(1, ...values)
  return values.map((v, i) => ({ i, name: weekday(i, 'short'), full: weekday(i, 'long'), value: v, share: v / max }))
})
const months = computed(() => {
  const values = props.summary?.byMonth ?? []
  const max = Math.max(1, ...values.map(m => m.count))
  return values.map(m => ({ key: m.month, label: date(`${m.month}-15`, { month: 'short' }), full: date(`${m.month}-15`, { month: 'long', year: 'numeric' }), value: m.count, share: m.count / max }))
})

const sentence = computed(() => {
  const s = props.summary
  if (!s) return ''
  const p = pick.value
  if (!p) return t('home.daily.summary', { total: number(s.total), active: number(s.activeDays), streak: number(s.longestStreak) })
  const days = s.days.filter(d => match.value!(d))
  const total = days.reduce((n, d) => n + d[1], 0)
  const active = days.filter(d => d[1] > 0).length
  const best = days.reduce((b, d) => (d[1] > b[1] ? d : b), days[0]!)
  if (p.kind === 'month') {
    return t('lab.graph.inMonth', {
      label: date(`${p.key}-15`, { month: 'long', year: 'numeric' }),
      total: number(total),
      active: number(active),
      day: date(best[0], { day: 'numeric', month: 'long' }),
      best: number(best[1]),
    })
  }
  return t('lab.graph.onWeekday', {
    label: rt((tm('lab.graph.days') as string[])[p.key]!),
    total: number(total),
    avg: number(total / Math.max(1, days.length), { maximumFractionDigits: 1 }),
    day: date(best[0], { day: 'numeric', month: 'long' }),
    best: number(best[1]),
  })
})
</script>

<template>
  <section class="year container-x" aria-labelledby="graph-title">
    <div class="head">
      <h2 id="graph-title" class="h-sub max-w-[16ch]">{{ t('lab.graph.title') }}</h2>
      <p class="max-w-[52ch] text-ink-2">{{ t('lab.graph.lead') }}</p>
    </div>
    <ContributionGraph :summary="props.summary" :match="match" class="mt-10" />
    <div class="said">
      <p class="max-w-[64ch] text-pretty text-ink-2" aria-live="polite">{{ sentence }}</p>
      <button v-if="pick" type="button" class="clear" @click="pick = null">{{ t('lab.graph.all') }} <X aria-hidden="true" /></button>
    </div>

    <div v-if="props.summary" class="charts">
      <div>
        <h3 id="weekday-title" class="chart-title">{{ t('lab.rhythm.weekdays') }}</h3>
        <ul class="weekdays" aria-labelledby="weekday-title">
          <li v-for="d in weekdays" :key="d.i">
            <button type="button" class="weekday" :aria-pressed="is('weekday', d.i)" :aria-label="`${d.full}: ${number(d.value)}`" @click="toggle('weekday', d.i)">
              <span class="weekday-name">{{ d.name }}</span>
              <span class="bar"><span :style="{ width: `${d.share * 100}%` }" /></span>
              <span class="text-right tabular">{{ number(d.value) }}</span>
            </button>
          </li>
        </ul>
      </div>
      <div>
        <h3 id="month-title" class="chart-title">{{ t('lab.rhythm.months') }}</h3>
        <ul class="months" aria-labelledby="month-title">
          <li v-for="m in months" :key="m.key">
            <button type="button" class="month" :aria-pressed="is('month', m.key)" :aria-label="`${m.full}: ${number(m.value)}`" @click="toggle('month', m.key)">
              <span class="month-plot">
                <span class="month-bar" :style="{ height: `${Math.max(1.5, m.share * 100)}%` }"><span class="month-value tabular">{{ number(m.value) }}</span></span>
              </span>
              <span class="month-name">{{ m.label.slice(0, 3) }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.year { padding-top: var(--section); }
.head { display: grid; gap: 1.25rem var(--gutter); align-items: end; }
@media (min-width: 64rem) { .head { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); } }
.said { margin-top: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 2rem; min-height: 2.5rem; }
.clear {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  height: 2.5rem;
  padding-inline: 1.1rem 0.9rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: var(--color-ink-wash);
  transition: background-color 0.2s var(--ease-out-quart);
}
.clear:hover { background: var(--color-ink-wash-hover); }
.clear svg { width: 1rem; height: 1rem; }

.charts { margin-top: clamp(2rem, 4vw, 3rem); padding-top: 2rem; border-top: 1px solid var(--color-line); display: grid; gap: 3rem var(--gutter); }
@media (min-width: 64rem) { .charts { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); } }
.chart-title { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; }

.weekdays { margin-top: 1rem; }
.weekday { width: 100%; display: grid; grid-template-columns: 3.25rem 1fr 3.5rem; align-items: center; gap: 0.75rem; min-height: 2.25rem; font-size: 0.9375rem; text-align: left; border-radius: 0.5rem; }
.weekday-name { color: var(--color-mute); transition: color 0.2s var(--ease-out-quart); }
.bar { display: block; height: 0.625rem; border-radius: 999px; background: var(--color-line); overflow: hidden; }
.bar > span { display: block; height: 100%; border-radius: 999px; background: rgb(190 186 179 / 0.65); transition: background-color 0.2s var(--ease-out-quart); }
.weekday:hover .weekday-name, .weekday[aria-pressed="true"] .weekday-name { color: var(--color-ink); }
.weekday:hover .bar > span, .weekday[aria-pressed="true"] .bar > span { background: var(--color-ink); }
.weekday[aria-pressed="true"] { font-weight: 700; }

.months { margin-top: 1rem; height: 16.5rem; display: flex; gap: clamp(0.125rem, 0.5vw, 0.375rem); }
.months li { flex: 1; min-width: 0; }
.month { width: 100%; height: 100%; display: grid; grid-template-rows: minmax(0, 1fr) auto; text-align: center; }
.month-plot { display: flex; align-items: flex-end; padding-top: 1.5rem; }
.month-bar { position: relative; display: block; width: 100%; border-radius: 0.25rem 0.25rem 0 0; background: rgb(190 186 179 / 0.65); transition: background-color 0.2s var(--ease-out-quart); }
.month-value { position: absolute; left: 50%; bottom: calc(100% + 0.25rem); transform: translateX(-50%); font-size: 0.8125rem; font-weight: 600; line-height: 1; color: var(--color-ink); opacity: 0; transition: opacity 0.2s var(--ease-out-quart); }
.month-name { height: 1.75rem; padding-top: 0.5rem; border-top: 1px solid var(--color-line-strong); font-size: 0.75rem; line-height: 1; color: var(--color-mute); transition: color 0.2s var(--ease-out-quart); }
.month:hover .month-bar, .month[aria-pressed="true"] .month-bar, .month:focus-visible .month-bar { background: var(--color-ink); }
.month:hover .month-value, .month[aria-pressed="true"] .month-value, .month:focus-visible .month-value { opacity: 1; }
.month:hover .month-name, .month[aria-pressed="true"] .month-name { color: var(--color-ink); }
@media (max-width: 30rem) { .month-value { font-size: 0.6875rem; } .month-name { font-size: 0.6875rem; } }
</style>
