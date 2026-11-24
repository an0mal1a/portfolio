<script setup lang="ts">
import type { ContributionDay, ContributionSummary } from '#shared/types/api'

/**
 * Twelve months of GitHub contributions, one column per week (oldest on the
 * left), Monday to Sunday top to bottom. Brighter ink, more code that day.
 * Today is the one live cell, in tally. Columns light up left to right the
 * first time the graph comes into view; without JS or motion it is whole.
 * Pointing at a day (or tapping it) labels it, as on GitHub. `match` dims every
 * day outside a selection (the lab's month and weekday filters).
 */
const props = withDefaults(defineProps<{ summary: ContributionSummary | null, match?: ((day: ContributionDay) => boolean) | null }>(), { match: null })
const { t, locale } = useI18n()
const { number, date } = useFormat()

const STEP = 12.5
const SIZE = 10

interface Cell { x: number, y: number, day: ContributionDay, col: number }

const layout = computed(() => {
  const days = [...(props.summary?.days ?? [])].sort((a, b) => a[0].localeCompare(b[0]))
  if (!days.length) return null
  const weekday = (iso: string) => (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7
  const cells: Cell[] = []
  const months: { x: number, label: string }[] = []
  let col = 0
  let lastMonth = ''
  days.forEach((d, i) => {
    const wd = weekday(d[0])
    if (wd === 0 && i > 0) col++
    cells.push({ x: col * STEP, y: 16 + wd * STEP, day: d, col })
    const m = d[0].slice(0, 7)
    if (m !== lastMonth && Number(d[0].slice(8, 10)) <= 7 && wd === 0) {
      months.push({ x: col * STEP, label: new Intl.DateTimeFormat(locale.value === 'en' ? 'en-GB' : 'es-ES', { month: 'short', timeZone: 'UTC' }).format(new Date(`${d[0]}T12:00:00Z`)) })
      lastMonth = m
    }
  })
  return { cells, months, cols: col + 1, width: (col + 1) * STEP - (STEP - SIZE), height: 16 + 7 * STEP - (STEP - SIZE) }
})
const lastDate = computed(() => layout.value?.cells.at(-1)?.day[0] ?? '')

const ariaLabel = computed(() => props.summary
  ? t('home.daily.aria', { total: number(props.summary.total), active: number(props.summary.activeDays) })
  : '')

// Label over the day under the pointer. It lives outside the scroller so it is never
// clipped, and stays inside the figure's edges.
const hovered = ref<Cell | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const figure = ref<HTMLElement | null>(null)
const tip = ref<HTMLElement | null>(null)
const tipAt = ref({ x: 0, y: 0, shift: 0 })
function onPoint(e: PointerEvent) {
  const l = layout.value
  const el = svg.value
  const fig = figure.value
  if (!l || !el || !fig) return
  const r = el.getBoundingClientRect()
  const k = r.width / l.width
  const x = (e.clientX - r.left) / k
  const y = (e.clientY - r.top) / k
  const cell = l.cells.find(c => x >= c.x && x < c.x + STEP && y >= c.y && y < c.y + STEP) ?? null
  if (cell === hovered.value) return
  hovered.value = cell
  if (!cell) return
  const f = fig.getBoundingClientRect()
  tipAt.value = { x: r.left - f.left + (cell.x + SIZE / 2) * k, y: r.top - f.top + cell.y * k, shift: 0 }
  nextTick(() => {
    const half = (tip.value?.offsetWidth ?? 0) / 2
    const { x: cx } = tipAt.value
    tipAt.value.shift = Math.max(0, half - cx) - Math.max(0, cx + half - f.width)
  })
}
const hide = () => { hovered.value = null }
const dayName = (iso: string) => date(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Light up once, column by column.
const wrap = ref<HTMLElement | null>(null)
const armed = ref(false)
const lit = ref(false)
onMounted(() => {
  const el = wrap.value
  if (!el) return
  // Narrow screens scroll the graph: start at today.
  el.scrollLeft = el.scrollWidth
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  if (r.top < window.innerHeight * 0.85) return
  armed.value = true
  const io = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting) return
    lit.value = true
    io.disconnect()
  }, { threshold: 0.4 })
  io.observe(el)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <figure ref="figure" class="graph">
    <div ref="wrap" class="scroll" :class="{ armed, lit }" @scroll.passive="hide">
      <svg
        v-if="layout"
        ref="svg"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        role="img"
        :aria-label="ariaLabel"
        @pointermove="onPoint"
        @pointerdown="onPoint"
        @pointerleave="hide"
      >
        <text v-for="m in layout.months" :key="m.x" :x="m.x" y="9" class="month">{{ m.label }}</text>
        <rect
          v-for="c in layout.cells"
          :key="c.day[0]"
          :x="c.x"
          :y="c.y"
          :width="SIZE"
          :height="SIZE"
          rx="2.5"
          class="cell"
          :class="{ off: props.match && !props.match(c.day) }"
          :data-level="c.day[0] === lastDate ? 'today' : c.day[2]"
          :style="{ '--col': c.col }"
        />
        <rect v-if="hovered" class="ring" :x="hovered.x - 1" :y="hovered.y - 1" :width="SIZE + 2" :height="SIZE + 2" rx="3.5" />
      </svg>
      <div v-else class="empty" />
    </div>
    <div
      v-if="hovered"
      ref="tip"
      class="tip tabular"
      aria-hidden="true"
      :style="{ left: `${tipAt.x}px`, top: `${tipAt.y}px`, '--shift': `${tipAt.shift}px` }"
    >
      <strong>{{ t('wall.count', { n: number(hovered.day[1]) }, hovered.day[1]) }}</strong>
      <span>{{ dayName(hovered.day[0]) }}</span>
    </div>
    <figcaption class="readout tabular" aria-hidden="true">
      <span v-if="lastDate" class="today"><i data-level="today" />{{ t('home.daily.today') }} · {{ date(lastDate) }}</span>
      <span class="legend">{{ t('wall.less') }}<i v-for="l in 5" :key="l" :data-level="l - 1" />{{ t('wall.more') }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.graph { position: relative; }
.scroll { overflow-x: auto; scrollbar-width: none; }
.scroll::-webkit-scrollbar { display: none; }
svg { width: 100%; min-width: 40rem; height: auto; overflow: visible; }
.month { font-size: 7px; fill: var(--color-mute); }
/* Narrow screens scroll the graph at about 1:1, so its months need real pixels. */
@media (max-width: 48rem) { .month { font-size: 11px; } svg { min-width: 46rem; } }
.cell { fill: rgb(238 234 227 / 0.06); transition: opacity 0.6s var(--ease-out-expo); transition-delay: calc(var(--col) * 14ms); }
.cell[data-level="1"] { fill: rgb(238 234 227 / 0.2); }
.cell[data-level="2"] { fill: rgb(238 234 227 / 0.38); }
.cell[data-level="3"] { fill: rgb(238 234 227 / 0.62); }
.cell[data-level="4"] { fill: var(--color-ink); }
.cell[data-level="today"] { fill: var(--color-tally); }
.cell.off { opacity: 0.22; transition-delay: 0s; transition-duration: 0.3s; }
.ring { fill: none; stroke: var(--color-ink); stroke-width: 1; pointer-events: none; }
.armed:not(.lit) .cell { opacity: 0; transition: none; }
.tip {
  position: absolute;
  z-index: 2;
  display: grid;
  padding: 0.5rem 0.75rem 0.55rem;
  border-radius: 0.625rem;
  background: var(--color-ink);
  color: var(--color-ground);
  font-size: 0.8125rem;
  line-height: 1.35;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(calc(-50% + var(--shift)), calc(-100% - 0.6rem));
  box-shadow: 0 14px 30px -12px rgb(0 0 0 / 0.9);
}
.tip strong { font-weight: 700; }
.tip::after {
  content: "";
  position: absolute;
  left: calc(50% - var(--shift));
  bottom: -0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  margin-left: -0.25rem;
  border-radius: 1px;
  background: inherit;
  transform: rotate(45deg);
}
.empty { aspect-ratio: 53 / 8; border-radius: var(--radius-screen); background: rgb(238 234 227 / 0.04); }
.readout { margin-top: 0.875rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 1.5rem; font-size: 0.875rem; color: var(--color-mute); }
.readout i { display: inline-block; width: 0.625rem; height: 0.625rem; border-radius: 0.15625rem; background: rgb(238 234 227 / 0.06); }
.readout i[data-level="1"] { background: rgb(238 234 227 / 0.2); }
.readout i[data-level="2"] { background: rgb(238 234 227 / 0.38); }
.readout i[data-level="3"] { background: rgb(238 234 227 / 0.62); }
.readout i[data-level="4"] { background: var(--color-ink); }
.readout i[data-level="today"] { background: var(--color-tally); }
.today, .legend { display: inline-flex; align-items: center; gap: 0.4rem; }
</style>
