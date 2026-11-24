<script setup lang="ts">
import { ArrowUpRight, ChevronDown, ChevronRight, GitFork, Search, Star } from '@lucide/vue'
import type { Repo, ReposPayload } from '#shared/types/api'
import { isListedRepo } from '~/content/repos'

/**
 * Every public repository on one time axis: each row's line runs from the day it
 * was created to its last push. Filter by language, search, sort.
 */
const props = defineProps<{ data: ReposPayload | null | undefined }>()
const { t } = useI18n()
const { number, date, relative } = useFormat()

const PAGE = 10
const DAY = 86_400_000
// One clock for server and browser, so the axis and its labels hydrate unchanged.
const now = useState('lab-now', () => Date.now())

type Sort = 'pushed' | 'stars' | 'created'
const SORTS: Sort[] = ['pushed', 'stars', 'created']
const language = ref<string | null>(null)
const sort = ref<Sort>('pushed')
const query = ref('')
const open = ref(false)

const listed = computed(() => (props.data?.repos ?? []).filter(r => r.visibility === 'public' && !r.is_fork && isListedRepo(r.display_name)))
const languages = computed(() => {
  const n = new Map<string, number>()
  for (const r of listed.value) if (r.primary_language) n.set(r.primary_language, (n.get(r.primary_language) ?? 0) + 1)
  return [...n.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})
const by: Record<Sort, (a: Repo, b: Repo) => number> = {
  pushed: (a, b) => (b.github_pushed_at ?? '').localeCompare(a.github_pushed_at ?? ''),
  stars: (a, b) => (b.stars_count ?? 0) - (a.stars_count ?? 0) || by.pushed(a, b),
  created: (a, b) => (a.github_created_at ?? '').localeCompare(b.github_created_at ?? ''),
}
const found = computed(() => {
  const q = query.value.trim().toLowerCase()
  return listed.value
    .filter(r => !language.value || r.primary_language === language.value)
    .filter(r => !q || `${r.display_name} ${r.description ?? ''}`.toLowerCase().includes(q))
    .sort(by[sort.value])
})
const rows = computed(() => (open.value ? found.value : found.value.slice(0, PAGE)))
const sum = (list: Repo[], key: 'stars_count' | 'forks_count') => list.reduce((n, r) => n + (r[key] ?? 0), 0)
const result = computed(() => {
  const stars = sum(found.value, 'stars_count')
  const forks = sum(found.value, 'forks_count')
  return [
    t('lab.repos.count', { n: number(found.value.length) }, found.value.length),
    stars && t('lab.repos.stars', { n: number(stars) }, stars),
    forks && t('lab.repos.forks', { n: number(forks) }, forks),
  ].filter(Boolean).join(', ')
})

// ── Time axis: from the first repository's year to today ──
const start = computed(() => {
  const first = listed.value.map(r => r.github_created_at).filter(Boolean).sort()[0]
  return Date.UTC(first ? Number(first.slice(0, 4)) : new Date(now.value).getUTCFullYear(), 0, 1)
})
const pos = (ms: number) => ((ms - start.value) / Math.max(1, now.value - start.value)) * 100
const years = computed(() => {
  const list: { year: number, x: number }[] = []
  for (let y = new Date(start.value).getUTCFullYear(); Date.UTC(y, 0, 1) < now.value; y++) list.push({ year: y, x: pos(Date.UTC(y, 0, 1)) })
  return list
})
function life(r: Repo) {
  const from = r.github_created_at ? Date.parse(r.github_created_at) : now.value
  const to = Math.max(from, r.github_pushed_at ? Date.parse(r.github_pushed_at) : from)
  return { left: `${pos(from)}%`, width: `${Math.max(0, pos(to) - pos(from))}%`, recent: now.value - to < 60 * DAY }
}
function span(r: Repo) {
  const opts = { month: 'short', year: 'numeric' } as const
  const from = date(r.github_created_at, opts)
  const to = date(r.github_pushed_at, opts)
  return from === to ? from : `${from} – ${to}`
}
</script>

<template>
  <section class="repos container-x" aria-labelledby="repos-title">
    <div class="head">
      <h2 id="repos-title" class="h-sub">{{ t('lab.repos.title') }}</h2>
      <p class="max-w-[52ch] text-ink-2">{{ t('lab.repos.lead') }}</p>
    </div>

    <div class="controls">
      <div class="chips" role="group" :aria-label="t('lab.repos.byLanguage')">
        <button type="button" class="chip" :aria-pressed="language === null" @click="language = null">
          {{ t('projects.all') }} <span class="tabular opacity-55">{{ listed.length }}</span>
        </button>
        <button v-for="l in languages" :key="l.name" type="button" class="chip" :aria-pressed="language === l.name" @click="language = language === l.name ? null : l.name">
          {{ l.name }} <span class="tabular opacity-55">{{ l.count }}</span>
        </button>
      </div>
      <div class="tools">
        <label class="search">
          <Search aria-hidden="true" />
          <span class="sr-only">{{ t('lab.repos.search') }}</span>
          <input v-model="query" type="search" :placeholder="t('lab.repos.search')" autocomplete="off" spellcheck="false">
        </label>
        <label class="sort">
          <span class="sr-only">{{ t('lab.repos.sort') }}</span>
          <select v-model="sort">
            <option v-for="s in SORTS" :key="s" :value="s">{{ t(`lab.repos.sorts.${s}`) }}</option>
          </select>
          <ChevronDown aria-hidden="true" />
        </label>
      </div>
    </div>

    <p class="result tabular" aria-live="polite">{{ result }}</p>

    <div class="axis" aria-hidden="true">
      <span v-for="y in years" :key="y.year" class="tabular" :style="{ left: `${y.x}%` }">{{ y.year }}</span>
    </div>
    <TransitionGroup tag="ul" name="row" class="rows">
      <li v-for="r in rows" :key="r.id" class="row">
        <a :href="r.repository_url ?? `https://github.com/${r.full_name}`" target="_blank" rel="noopener" class="link">
          <span class="what">
            <span class="name">{{ r.display_name }} <ArrowUpRight aria-hidden="true" /></span>
            <span v-if="r.description" class="desc">{{ r.description }}</span>
          </span>
          <span class="line">
            <i v-for="y in years" :key="y.year" class="tick" :style="{ left: `${y.x}%` }" aria-hidden="true" />
            <span class="life" :class="{ recent: life(r).recent }" :style="{ left: life(r).left, width: life(r).width }" />
            <span class="span tabular" :class="{ flip: Number.parseFloat(life(r).left) > 55 }" :style="{ '--x': life(r).left }">{{ span(r) }}</span>
          </span>
          <span class="facts tabular">
            <span v-if="r.primary_language" class="text-ink-2">{{ r.primary_language }}</span>
            <span v-if="r.stars_count" class="fact" :aria-label="t('lab.repos.stars', { n: r.stars_count }, r.stars_count)"><Star aria-hidden="true" />{{ number(r.stars_count) }}</span>
            <span v-if="r.forks_count" class="fact" :aria-label="t('lab.repos.forks', { n: r.forks_count }, r.forks_count)"><GitFork aria-hidden="true" />{{ number(r.forks_count) }}</span>
            <span v-if="r.github_pushed_at" class="when">{{ relative(r.github_pushed_at, now) }}</span>
          </span>
        </a>
      </li>
    </TransitionGroup>
    <p v-if="!rows.length" class="empty">{{ t('lab.repos.empty') }}</p>

    <div class="foot">
      <button v-if="found.length > PAGE" type="button" class="more" :aria-expanded="open" @click="open = !open">
        {{ open ? t('lab.repos.less') : t('lab.repos.more', { n: found.length }) }}
        <ChevronDown aria-hidden="true" />
      </button>
      <a href="https://github.com/an0mal1a" target="_blank" rel="noopener me" class="link-more">{{ t('lab.repos.all') }} <ChevronRight aria-hidden="true" /></a>
    </div>
  </section>
</template>

<style scoped>
.repos { padding-top: var(--section); }
.head { display: grid; gap: 1.25rem var(--gutter); align-items: end; }
@media (min-width: 64rem) { .head { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); } }

.controls { margin-top: 2.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; }
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip, .more {
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
.chip:hover, .more:hover { background: rgb(238 234 227 / 0.12); color: var(--color-ink); }
.chip[aria-pressed="true"] { background: var(--color-ink); color: var(--color-ground); }
.tools { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.search, .sort { position: relative; display: flex; align-items: center; }
.search svg { position: absolute; left: 1rem; width: 1rem; height: 1rem; color: var(--color-mute); pointer-events: none; }
.sort svg { position: absolute; right: 0.9rem; width: 1rem; height: 1rem; color: var(--color-mute); pointer-events: none; }
.search input, .sort select {
  height: 2.5rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: rgb(238 234 227 / 0.04);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.9375rem;
  transition: border-color 0.2s var(--ease-out-quart);
}
.search input { width: 13rem; padding-inline: 2.5rem 1rem; }
.search input::placeholder { color: var(--color-mute); opacity: 1; }
.search input::-webkit-search-cancel-button { filter: grayscale(1) invert(0.6); }
.sort select { appearance: none; padding-inline: 1.1rem 2.5rem; }
.sort option { background: var(--color-raise); color: var(--color-ink); }
.search input:hover, .sort select:hover { border-color: var(--color-line-strong); }
.search input:focus-visible, .sort select:focus-visible { outline: none; border-color: var(--color-ink); box-shadow: 0 0 0 3px rgb(238 234 227 / 0.12); }
@media (max-width: 40rem) { .tools { width: 100%; } .search { flex: 1 1 10rem; } .search input { width: 100%; } }

.result { margin-top: 1.5rem; font-size: 0.9375rem; color: var(--color-mute); }

/* One grid for the axis and every row: the line column carries the years. */
.axis, .link { display: grid; gap: 0.75rem clamp(1.5rem, 3vw, 3rem); }
.axis { position: relative; margin-top: 2rem; height: 1.75rem; font-size: 0.8125rem; color: var(--color-mute); }
.axis span { position: absolute; }
.rows { position: relative; border-top: 1px solid var(--color-line); }
.row { border-bottom: 1px solid var(--color-line); }
.link { padding: 1.125rem 0; color: inherit; text-decoration: none; }
.what { min-width: 0; display: grid; gap: 0.25rem; align-content: center; }
.name { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 1.0625rem; font-weight: 650; letter-spacing: -0.01em; }
.name svg { width: 1rem; height: 1rem; color: var(--color-mute); opacity: 0; transform: translate(-0.25rem, 0.25rem); transition: opacity 0.25s var(--ease-out-quart), transform 0.45s var(--ease-out-expo); }
.link:hover .name svg, .link:focus-visible .name svg { opacity: 1; transform: none; }
.desc { font-size: 0.9375rem; line-height: 1.4; color: var(--color-mute); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.line { position: relative; display: block; height: 2.25rem; }
.tick { position: absolute; top: 0; bottom: 0; width: 1px; background: rgb(238 234 227 / 0.06); }
.life { position: absolute; top: calc(50% - 0.25rem); min-width: 0.5rem; height: 0.5rem; border-radius: 999px; background: rgb(238 234 227 / 0.5); transition: background-color 0.25s var(--ease-out-quart); }
.life.recent { background: var(--color-ink); }
.link:hover .life { background: var(--color-ink); }
.span { position: absolute; left: var(--x); top: 1.5rem; font-size: 0.8125rem; line-height: 1; color: var(--color-mute); white-space: nowrap; opacity: 0; transition: opacity 0.25s var(--ease-out-quart); }
.span.flip { left: auto; right: 0; }
.link:hover .span, .link:focus-visible .span { opacity: 1; }
.facts { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem 0.875rem; font-size: 0.875rem; color: var(--color-mute); }
.fact { display: inline-flex; align-items: center; gap: 0.3rem; }
.fact svg { width: 0.875rem; height: 0.875rem; }
@media (min-width: 64rem) {
  .link { grid-template-columns: minmax(0, 4.5fr) minmax(0, 5fr) minmax(0, 3fr); align-items: center; }
  .axis { margin-left: calc((100% - 2 * clamp(1.5rem, 3vw, 3rem)) * 4.5 / 12.5 + clamp(1.5rem, 3vw, 3rem)); width: calc((100% - 2 * clamp(1.5rem, 3vw, 3rem)) * 5 / 12.5); }
  .line { height: 3rem; }
  .span { top: 2.15rem; }
  .facts { justify-content: flex-end; }
  .when { min-width: 7.5rem; text-align: right; }
}
@media (max-width: 63.99rem) {
  /* No hover to reveal it: the period sits in the open. */
  .span { opacity: 1; }
  .line { height: 3rem; }
  .span { top: 2rem; }
}
.empty { padding: 2.5rem 0; border-bottom: 1px solid var(--color-line); color: var(--color-mute); }

.foot { margin-top: 2rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; }
.more svg { width: 1rem; height: 1rem; transition: transform 0.35s var(--ease-out-expo); }
.more[aria-expanded="true"] svg { transform: rotate(180deg); }

.row-move, .row-enter-active { transition: opacity 0.4s var(--ease-out-quart), transform 0.6s var(--ease-out-expo); }
.row-enter-from { opacity: 0; transform: translateY(0.75rem); }
.row-leave-active { display: none; }
@media (prefers-reduced-motion: reduce) { .row-move, .row-enter-active { transition: none; } }
</style>
