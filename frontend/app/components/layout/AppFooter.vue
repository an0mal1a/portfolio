<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { SERVICE_IDS, getServices } from '~/content/services'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const services = computed(() => getServices(locale.value))
const { state: liveState, latency } = useSystemStatus()
// The footer renders before the home overview resolves on the server, so it stays
// on "checking" until mounted; otherwise hydration would disagree with the SSR HTML.
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const state = computed(() => (mounted.value ? liveState.value : 'checking'))
const { number } = useFormat()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container-x">
      <div class="top">
        <div>
          <NuxtLinkLocale to="index" class="brand" :aria-label="t('a11y.home')"><BrandLogo /></NuxtLinkLocale>
          <p class="line">{{ t('footer.line') }}</p>
        </div>

        <nav class="cols" :aria-label="t('footer.nav')">
          <div>
            <p class="col-title">{{ t('nav.services') }}</p>
            <ul>
              <li v-for="id in SERVICE_IDS" :key="id"><NuxtLink :to="localePath(id)">{{ services[id].name }}</NuxtLink></li>
            </ul>
          </div>
          <div>
            <p class="col-title">{{ t('footer.studio') }}</p>
            <ul>
              <li><NuxtLinkLocale to="projects">{{ t('nav.projects') }}</NuxtLinkLocale></li>
              <li><NuxtLinkLocale to="lab">{{ t('nav.lab') }}</NuxtLinkLocale></li>
              <li><NuxtLinkLocale to="about">{{ t('nav.about') }}</NuxtLinkLocale></li>
              <li><NuxtLinkLocale to="contact">{{ t('nav.contact') }}</NuxtLinkLocale></li>
            </ul>
          </div>
          <div>
            <p class="col-title">{{ t('footer.elsewhere') }}</p>
            <ul>
              <li>
                <a href="https://github.com/an0mal1a" target="_blank" rel="noopener me" class="inline-flex items-center gap-1.5">
                  GitHub <ArrowUpRight class="size-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="bottom">
        <p>© {{ year }} Pablo Diez · {{ t('contact.place') }}</p>
        <p class="status" aria-live="polite">
          <span class="dot" :data-state="state" aria-hidden="true" />
          {{ t(`facts.status.${state}`) }}<template v-if="state === 'operational' && latency !== null"> · {{ t('facts.db') }} {{ number(latency) }} ms</template>
        </p>
        <NuxtLinkLocale to="privacy">{{ t('footer.privacy') }}</NuxtLinkLocale>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--color-line); }
.top {
  display: grid;
  gap: 3rem var(--gutter);
  padding: clamp(3.5rem, 6vw, 5rem) 0;
}
@media (min-width: 48rem) { .top { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); } }
.brand { display: inline-flex; font-size: 1.625rem; text-decoration: none; }
.line { margin-top: 1.5rem; max-width: 22ch; font-size: clamp(1.375rem, 1.1rem + 0.9vw, 1.875rem); font-weight: 650; line-height: 1.2; letter-spacing: -0.02em; color: var(--color-ink-2); }
.cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem var(--gutter); }
@media (min-width: 48rem) { .cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.col-title { font-size: 0.875rem; font-weight: 600; color: var(--color-mute); }
.cols ul { margin-top: 1rem; display: grid; gap: 0.625rem; }
.cols a { color: var(--color-ink-2); text-decoration: none; transition: color 0.2s var(--ease-out-quart); }
.cols a:hover { color: var(--color-ink); }
.bottom {
  display: flex;
  flex-direction: column;
  gap: 0.75rem 2rem;
  padding: 1.5rem 0 2rem;
  border-top: 1px solid var(--color-line);
  font-size: 0.875rem;
  color: var(--color-mute);
}
@media (min-width: 40rem) { .bottom { flex-direction: row; align-items: center; justify-content: space-between; } }
.bottom a { color: var(--color-mute); text-decoration: none; }
.bottom a:hover { color: var(--color-ink); }
.status { display: flex; align-items: center; gap: 0.5rem; }
.dot { width: 0.4375rem; height: 0.4375rem; border-radius: 999px; background: var(--color-faint); }
.dot[data-state="operational"] { background: var(--color-tally); }
.dot[data-state="degraded"], .dot[data-state="down"] { background: var(--color-error); }
</style>
