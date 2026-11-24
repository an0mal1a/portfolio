import type { Directive } from 'vue'

/**
 * v-reveal: a section heading (or lead) rises into place the first time it
 * enters the viewport. Only elements that start below the fold are held back,
 * and only once JS runs with motion allowed, so the server HTML, no-JS and
 * reduced-motion visitors always see the final state. `v-reveal="2"` staggers.
 */
let io: IntersectionObserver | null = null

function observer() {
  io ??= new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      const el = e.target as HTMLElement
      el.dataset.reveal = 'in'
      io?.unobserve(el)
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
  return io
}

const reveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    el.style.setProperty('--reveal-i', String(binding.value ?? 0))
    el.dataset.reveal = 'pending'
    observer().observe(el)
  },
  beforeUnmount(el) {
    io?.unobserve(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
