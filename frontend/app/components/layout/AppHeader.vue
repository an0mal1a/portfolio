<script setup lang="ts">
import { ArrowRight, Menu, X } from '@lucide/vue'

/**
 * Over the home stage the header is just the logo and five links, as in the
 * approved comp. Once the visitor scrolls past the stage (or on any other page)
 * it settles into a solid bar that also carries the primary action.
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const getRouteBaseName = useRouteBaseName()

const isHome = computed(() => getRouteBaseName(route) === 'index')
const open = ref(false)
const pastStage = ref(false)
const solid = computed(() => !isHome.value || pastStage.value || open.value)

const links = computed(() => [
  { to: `${localePath('index')}#servicios`, label: t('nav.services') },
  { to: localePath('projects'), label: t('nav.projects') },
  { to: localePath('lab'), label: t('nav.lab') },
  { to: localePath('about'), label: t('nav.about') },
])
const otherLocale = computed(() => (locale.value === 'es' ? 'en' : 'es'))

watch(() => route.fullPath, () => { open.value = false })

if (import.meta.client) {
  const onScroll = () => { pastStage.value = window.scrollY > window.innerHeight * 0.72 }
  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
  watch(open, v => document.documentElement.classList.toggle('overflow-hidden', v))
}
</script>

<template>
  <header class="site-header" :class="{ 'is-solid': solid, 'is-stage': !solid }" data-intro-part="nav">
    <a href="#main" class="sr-only-focusable absolute left-4 top-3 z-50 rounded-full bg-tally px-4 py-2 text-sm font-bold text-on-tally">{{ t('a11y.skip') }}</a>
    <div class="bar">
      <NuxtLinkLocale to="/" class="brand" :aria-label="t('a11y.home')">
        <BrandLogo />
      </NuxtLinkLocale>

      <nav class="hidden lg:block" :aria-label="t('a11y.mainNav')">
        <ul class="links">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" class="link" active-class="is-active">{{ link.label }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="switchLocalePath(otherLocale)" class="link" :hreflang="otherLocale" :aria-label="t('a11y.switchLocale')">
              ES / EN
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <Transition name="cta">
        <UiButton v-if="solid && !open" :to="localePath('contact')" size="sm" class="ml-6 hidden lg:inline-flex">{{ t('cta.primary') }}</UiButton>
      </Transition>

      <button
        type="button"
        class="-mr-2 ml-auto inline-flex size-11 items-center justify-center rounded-full lg:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? t('a11y.closeMenu') : t('a11y.openMenu')"
        @click="open = !open"
      >
        <X v-if="open" class="size-6" aria-hidden="true" />
        <Menu v-else class="size-6" aria-hidden="true" />
      </button>
    </div>

    <Transition name="sheet">
      <div v-if="open" id="mobile-nav" class="sheet lg:hidden">
        <nav :aria-label="t('a11y.mainNav')">
          <ul>
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="flex items-center justify-between py-3 text-[2.5rem] font-bold leading-tight tracking-[-0.035em]">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="mt-auto grid gap-3 pt-10">
          <UiButton :to="localePath('contact')" size="lg" class="w-full">
            {{ t('cta.primary') }}
            <template #icon><ArrowRight aria-hidden="true" /></template>
          </UiButton>
          <NuxtLink :to="switchLocalePath(otherLocale)" class="py-3 text-center font-semibold text-ink-2" :hreflang="otherLocale">
            {{ otherLocale === 'en' ? 'English' : 'Español' }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  transition: background-color 0.35s var(--ease-out-quart), box-shadow 0.35s var(--ease-out-quart);
}
.site-header.is-solid {
  background: var(--color-ground);
  box-shadow: 0 1px 0 var(--color-line);
}
.bar {
  display: flex;
  align-items: center;
  height: var(--bar-h);
  padding-inline: var(--gutter);
  transition: height 0.45s var(--ease-out-expo);
}
/* Over the stage the header takes the comp's proportions, capped like the hero
   type (smaller of width and height); solid, it compacts. */
.is-stage { --bar-h: clamp(4.25rem, min(6.6vw, 10.5svh), 5.75rem); --brand: clamp(1.375rem, min(3vw, 4.8svh), 2.25rem); --link: clamp(0.9375rem, min(1.19vw, 1.9svh), 1.125rem); }
.is-stage .bar { padding-right: calc(var(--gutter) * 0.78); }
/* In the comp the links ride a little above the logo's centre line. */
.is-stage .links { transform: translateY(max(-0.45vw, -0.375rem)); }
.is-stage .link { font-weight: 540; }
.is-solid { --bar-h: var(--header-h); --brand: clamp(1.25rem, 1rem + 0.5vw, 1.5rem); --link: 0.9375rem; }
.brand { display: flex; margin-right: auto; font-size: var(--brand); transition: font-size 0.45s var(--ease-out-expo), transform 0.45s var(--ease-out-expo); }
/* The caps hang from the top of the mark: a hair lower, word and nav share a line. */
.is-solid .brand { transform: translateY(0.1em); }
.links { display: flex; align-items: center; gap: clamp(1.25rem, 1.7vw, 2rem); }
.link {
  font-size: var(--link);
  font-weight: 500;
  color: var(--color-ink);
  text-decoration: none;
  transition: color 0.2s var(--ease-out-quart);
}
.is-solid .link { color: var(--color-ink-2); }
.is-solid .link:hover, .link.is-active { color: var(--color-ink); }

.sheet {
  position: fixed;
  inset: var(--header-h) 0 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem var(--gutter) 2.5rem;
  background: var(--color-ground);
}

.cta-enter-active, .cta-leave-active { transition: opacity 0.3s var(--ease-out-quart), transform 0.45s var(--ease-out-expo); }
.cta-enter-from, .cta-leave-to { opacity: 0; transform: translateY(-0.4rem); }
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.3s var(--ease-out-quart), transform 0.45s var(--ease-out-expo); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; transform: translateY(-0.75rem); }
</style>
