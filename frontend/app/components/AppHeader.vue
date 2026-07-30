<template>
  <header class="site-header" :class="{ 'is-open': menuOpen }">
    <div class="site-header__inner shell">
      <a class="site-header__brand" href="#top" aria-label="Pablo Diez, back to top">
        PD<span>®</span>
      </a>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <a v-for="item in navItems" :key="item.href" :href="item.href" @click="menuOpen = false">
          <span>{{ item.index }}</span>{{ item.label }}
        </a>
      </nav>

      <a class="site-header__contact" href="#contact">Start a project <span>↗</span></a>
      <button class="site-header__menu" type="button" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
const navItems = [
  { index: '01', label: 'Work', href: '#work' },
  { index: '02', label: 'Lab', href: '#lab' },
  { index: '03', label: 'About', href: '#about' },
]
</script>

<style scoped>
.site-header { position: absolute; z-index: 90; top: 0; left: 0; width: 100%; }
.site-header__inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 5.5rem; border-bottom: 1px solid var(--line); }
.site-header__brand { width: max-content; font-family: var(--font-display); font-size: 2rem; line-height: 1; }
.site-header__brand span { color: var(--red); font-family: var(--font-body); font-size: .45rem; vertical-align: top; }
.site-header__nav { display: flex; gap: clamp(1.5rem, 3vw, 3.5rem); }
.site-header__nav a, .site-header__contact { font-size: .69rem; font-weight: 650; letter-spacing: .11em; text-transform: uppercase; transition: color .2s ease; }
.site-header__nav a span { margin-right: .45rem; color: #66635f; font-size: .55rem; }
.site-header__nav a:hover, .site-header__contact:hover { color: var(--red); }
.site-header__contact { justify-self: end; }
.site-header__contact span { color: var(--red); font-size: 1rem; }
.site-header__menu { display: none; border: 0; color: var(--ink); background: transparent; }

@media (max-width: 720px) {
  .site-header__inner { grid-template-columns: 1fr auto; height: 4.75rem; }
  .site-header__contact { display: none; }
  .site-header__menu { display: grid; gap: .35rem; width: 2rem; padding: .4rem 0; }
  .site-header__menu span { display: block; width: 100%; height: 1px; background: currentColor; transition: transform .25s ease; }
  .site-header__nav { position: absolute; top: 4.75rem; right: 1rem; left: 1rem; display: grid; gap: 0; padding: 1rem; visibility: hidden; opacity: 0; background: #151513; transform: translateY(-.5rem); transition: .25s ease; }
  .site-header__nav a { padding: 1rem .25rem; border-bottom: 1px solid var(--line); font-size: .85rem; }
  .is-open .site-header__nav { visibility: visible; opacity: 1; transform: none; }
  .is-open .site-header__menu span:first-child { transform: translateY(.2rem) rotate(45deg); }
  .is-open .site-header__menu span:last-child { transform: translateY(-.2rem) rotate(-45deg); }
}
</style>
