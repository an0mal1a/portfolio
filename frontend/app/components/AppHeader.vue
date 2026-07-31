<template>
  <header class="site-header" :class="{ 'is-open': menuOpen, 'is-scrolled': scrolled }">
    <div class="site-header__inner shell">
      <NuxtLink class="site-header__brand" to="/" aria-label="Pablo Diez, home" @click="menuOpen = false">
        <span class="site-header__brand-mark">PD</span>
        <span class="site-header__brand-copy">Pablo Diez<br>Backend engineer</span>
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" @click="menuOpen = false">
          <span>{{ item.index }}</span>{{ item.label }}
        </NuxtLink>
      </nav>

      <NuxtLink class="site-header__contact" to="/#contact">Let’s talk <span>↗</span></NuxtLink>
      <button class="site-header__menu" type="button" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
const scrolled = ref(false)
const navItems = [
  { index: '01', label: 'Projects', to: '/projects' },
  { index: '02', label: 'GitHub', to: '/#lab' },
  { index: '03', label: 'About', to: '/#about' },
]

const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.site-header { position: fixed; z-index: 90; top: 0; left: 0; width: 100%; transition: background .25s ease, backdrop-filter .25s ease; }
.site-header.is-scrolled, .site-header.is-open { background: rgb(8 8 8 / 82%); backdrop-filter: blur(18px); }
.site-header__inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 5.25rem; border-bottom: 1px solid var(--line); }
.site-header__brand { display: inline-flex; width: max-content; align-items: center; gap: .8rem; }
.site-header__brand-mark { display: grid; width: 2rem; aspect-ratio: 1; place-items: center; border: 1px solid var(--red); color: var(--ink); font-size: .7rem; font-weight: 750; letter-spacing: -.03em; }
.site-header__brand-copy { color: var(--ink-dim); font-family: var(--font-mono); font-size: .56rem; font-weight: 600; line-height: 1.35; letter-spacing: .07em; text-transform: uppercase; }
.site-header__nav { display: flex; gap: clamp(1.4rem, 3vw, 3.5rem); }
.site-header__nav a, .site-header__contact { font-family: var(--font-mono); font-size: .66rem; font-weight: 650; letter-spacing: .09em; text-transform: uppercase; transition: color .2s ease; }
.site-header__nav a span { margin-right: .5rem; color: #5f5f5c; font-size: .54rem; }
.site-header__nav a:hover, .site-header__nav a.router-link-active, .site-header__contact:hover { color: var(--red-bright); }
.site-header__contact { justify-self: end; }.site-header__contact span { margin-left: .3rem; color: var(--red); font-size: 1rem; }
.site-header__menu { display: none; width: 2.25rem; padding: .5rem 0; border: 0; color: var(--ink); background: transparent; }
.site-header__menu span { display: block; width: 100%; height: 1px; background: currentColor; transition: transform .25s ease; }

@media (max-width: 760px) {
  .site-header__inner { grid-template-columns: 1fr auto; min-height: 4.5rem; }
  .site-header__contact { display: none; }
  .site-header__menu { display: grid; gap: .38rem; }
  .site-header__nav { position: absolute; top: 4.5rem; right: 0; left: 0; display: grid; gap: 0; padding: .75rem 1rem 1.25rem; visibility: hidden; opacity: 0; background: rgb(8 8 8 / 97%); transform: translateY(-.5rem); transition: .2s ease; }
  .site-header__nav a { display: flex; padding: 1.2rem .25rem; align-items: baseline; border-bottom: 1px solid var(--line); font-size: 1rem; }
  .is-open .site-header__nav { visibility: visible; opacity: 1; transform: none; }
  .is-open .site-header__menu span:first-child { transform: translateY(.24rem) rotate(45deg); }
  .is-open .site-header__menu span:last-child { transform: translateY(-.24rem) rotate(-45deg); }
}
</style>
