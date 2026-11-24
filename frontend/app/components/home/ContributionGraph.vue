<script setup lang="ts">
import type { ContributionDay, ContributionSummary } from '#shared/types/api'

/**
 * Twelve months of GitHub contributions, one column per week (oldest on the
 * left), Monday to Sunday top to bottom. Brighter ink, more code that day.
 * Today is the one live cell, in tally. Columns light up left to right the
 * first time the graph comes into view; without JS or motion it is whole.
 */
const props = defineProps<{ summary: ContributionSummary | null }>()
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

// Hover readout
const hovered = ref<Cell | null>(null)
const svg = ref<SVGSVGElement | null>(null)
function onMove(e: PointerEvent) {
  const l = layout.value
  const el = svg.value
  if (!l || !el) return
  const r = el.getBoundingClientRect()
  const x = ((e.clientX - r.left) / r.width) * l.width
  const y = ((e.clientY - r.top) / r.height) * l.height
  hovered.value = l.cells.find(c => x >= c.x && x < c.x + STEP && y >= c.y && y < c.y + STEP) ?? null
}

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
  <figure class="graph">
    <div ref="wrap" class="scroll" :class="{ armed, lit }">
      <svg
        v-if="layout"
        ref="svg"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        role="img"
        :aria-label="ariaLabel"
        @pointermove="onMove"
        @pointerleave="hovered = null"
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
          :data-level="c.day[0] === lastDate ? 'today' : c.day[2]"
          :style="{ '--col': c.col }"
        />
      </svg>
      <div v-else class="empty" />
    </div>
    <figcaption class="readout tabular" aria-hidden="true">
      <template v-if="hovered">{{ t('wall.count', hovered.day[1]) }} · {{ date(hovered.day[0]) }}</template>
      <template v-else-if="lastDate">{{ t('home.daily.today') }} · {{ date(lastDate) }}</template>
    </figcaption>
  </figure>
</template>

<style scoped>
.scroll { overflow-x: auto; scrollbar-width: none; }
.scroll::-webkit-scrollbar { display: none; }
svg { width: 100%; min-width: 40rem; height: auto; overflow: visible; }
.month { font-size: 7px; fill: var(--color-mute); }
.cell { fill: rgb(238 234 227 / 0.06); transition: opacity 0.6s var(--ease-out-expo); transition-delay: calc(var(--col) * 14ms); }
.cell[data-level="1"] { fill: rgb(238 234 227 / 0.2); }
.cell[data-level="2"] { fill: rgb(238 234 227 / 0.38); }
.cell[data-level="3"] { fill: rgb(238 234 227 / 0.62); }
.cell[data-level="4"] { fill: var(--color-ink); }
.cell[data-level="today"] { fill: var(--color-tally); }
.armed:not(.lit) .cell { opacity: 0; transition: none; }
.empty { aspect-ratio: 53 / 8; border-radius: var(--radius-screen); background: rgb(238 234 227 / 0.04); }
.readout { margin-top: 0.875rem; min-height: 1.5em; font-size: 0.875rem; color: var(--color-mute); }
</style>
