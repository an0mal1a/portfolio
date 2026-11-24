<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { SECURITY_HEADERS, type SecurityHeaderName } from '#shared/security-headers'

/**
 * Security shown, not claimed. The server renders the headers it is configured
 * to send (shared/security-headers.ts, the same list the middleware uses), so the
 * sheet reads complete without JS. In the browser, a HEAD request to this page
 * then checks what actually arrived, row by row as the sheet comes into view.
 * The limits are the Rust API's (3/min contact, 120/min reads).
 */
const { t } = useI18n()
const localePath = useLocalePath()

const TOTAL = SECURITY_HEADERS.length
const received = ref<Record<string, string | null> | null>(null)
const response = ref<{ status: number, host: string } | null>(null)
const failed = ref(false)
const shown = ref<number>(TOTAL) // rows already checked once the HEAD answer is in

const sheet = ref<HTMLElement | null>(null)

onMounted(async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = sheet.value
  const belowFold = !!el && el.getBoundingClientRect().top > window.innerHeight * 0.85
  if (!reduced && belowFold) shown.value = 0

  try {
    const res = await fetch(window.location.pathname, { method: 'HEAD', cache: 'no-store', credentials: 'omit' })
    received.value = Object.fromEntries(SECURITY_HEADERS.map(([name]) => [name, res.headers.get(name)]))
    response.value = { status: res.status, host: window.location.host }
  }
  catch {
    failed.value = true
    return
  }

  if (shown.value === TOTAL || !el) return
  const io = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting) return
    io.disconnect()
    const tick = () => {
      shown.value++
      if (shown.value < TOTAL) setTimeout(tick, 220)
    }
    setTimeout(tick, 250)
  }, { threshold: 0.35 })
  io.observe(el)
  onBeforeUnmount(() => io.disconnect())
})

type RowState = 'configured' | 'pending' | 'ok' | 'missing'
const stateOf = (name: SecurityHeaderName, i: number): RowState => {
  if (!received.value) return 'configured'
  if (i >= shown.value) return 'pending'
  return received.value[name] ? 'ok' : 'missing'
}
const valueOf = (name: SecurityHeaderName, configured: string) => {
  if (!received.value) return configured
  return received.value[name] ?? t('security.missing')
}
const passed = computed(() => received.value
  ? SECURITY_HEADERS.slice(0, shown.value).filter(([name]) => received.value?.[name]).length
  : 0)
</script>

<template>
  <section id="seguridad" class="security container-x" aria-labelledby="security-title">
    <div class="head">
      <h2 id="security-title" v-reveal class="h-section mx-auto max-w-[17ch]">{{ t('security.title') }}</h2>
      <p v-reveal="1" class="lead mx-auto mt-6 max-w-[60ch]">{{ t('security.lead') }}</p>
    </div>

    <div ref="sheet" class="sheet panel">
      <div class="status">
        <code class="tabular"><b>HTTP {{ response?.status ?? 200 }}</b> · {{ response?.host ?? 'impablo.dev' }}</code>
        <span class="count tabular" aria-live="polite">
          <template v-if="failed">{{ t('security.failed') }}</template>
          <template v-else-if="received">{{ t('security.checked', { n: passed, total: TOTAL }) }}</template>
          <template v-else>{{ t('security.configured', { total: TOTAL }) }}</template>
        </span>
      </div>
      <ul>
        <li v-for="([name, configured], i) in SECURITY_HEADERS" :key="name" class="row" :data-state="stateOf(name, i)">
          <code><span class="dot" aria-hidden="true" />{{ name }}: <i>{{ valueOf(name, configured) }}</i></code>
          <p>{{ t(`security.rows.${name}`) }}</p>
        </li>
      </ul>
    </div>

    <dl class="limits">
      <div>
        <dt class="tabular">{{ t('security.limits.contact.value') }}</dt>
        <dd>{{ t('security.limits.contact.body') }}</dd>
      </div>
      <div>
        <dt class="tabular">{{ t('security.limits.api.value') }}</dt>
        <dd>{{ t('security.limits.api.body') }}</dd>
      </div>
    </dl>

    <p class="evidence">
      <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: 'nightmare-framework' } })" class="link-more more-quiet">
        {{ t('security.evidence') }} <ChevronRight aria-hidden="true" />
      </NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.security { padding-top: var(--section); }
.head { text-align: center; }
.sheet {
  max-width: 70rem;
  margin: clamp(3rem, 6vw, 4.5rem) auto 0;
  padding: 0.5rem clamp(1.25rem, 3vw, 2.5rem) 1rem;
}
.status {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.25rem 1rem;
  padding: 1.125rem 0;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-mute);
}
/* Mono only for the literal response line; the count is prose. */
.status code { font-family: var(--font-mono); font-size: 0.8125rem; }
.status b { color: var(--color-ink); font-weight: 500; }
.count { font-size: 0.875rem; }
.row {
  display: grid;
  gap: 0.5rem 3rem;
  padding: 1.125rem 0;
  border-bottom: 1px solid var(--color-line);
  align-items: baseline;
}
.row:last-child { border-bottom: 0; }
@media (min-width: 56rem) { .row { grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); } }
.row code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--color-ink);
  overflow-wrap: anywhere;
  padding-left: 1.25rem;
  text-indent: -1.25rem;
}
.row code i { font-style: normal; color: var(--color-mute); }
.row p { color: var(--color-ink-2); padding-left: 1.25rem; }
@media (min-width: 56rem) { .row p { padding-left: 0; } }
.dot {
  display: inline-block;
  width: 0.4375rem;
  height: 0.4375rem;
  margin-right: 0.8125rem;
  border-radius: 999px;
  vertical-align: 0.1em;
  background: var(--color-faint);
  transition: background-color 0.4s var(--ease-out-quart);
}
.row[data-state="configured"] .dot { background: var(--color-ink-2); }
.row[data-state="ok"] .dot { background: var(--color-tally); }
.row[data-state="missing"] .dot { background: var(--color-error); }
.row[data-state="pending"] p { color: var(--color-mute); }

.limits {
  max-width: 70rem;
  margin: clamp(2.5rem, 5vw, 3.5rem) auto 0;
  display: grid;
  gap: 1.5rem 3rem;
}
@media (min-width: 48rem) { .limits { grid-template-columns: 1fr 1fr; } }
.limits dt { font-size: clamp(1.75rem, 1.3rem + 1.5vw, 2.5rem); font-weight: 750; letter-spacing: -0.03em; line-height: 1.05; }
.limits dd { margin-top: 0.5rem; color: var(--color-ink-2); max-width: 44ch; }
.evidence { max-width: 70rem; margin: 2rem auto 0; }
.more-quiet { color: var(--color-ink-2); }
.more-quiet:hover { color: var(--color-ink); }
</style>
