import Lenis from 'lenis'

// Smooth scrolling for pointer users. Skipped entirely under reduced motion,
// and it never blocks first paint (client-only plugin, runs after hydration).
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: { offset: -80 } })
  nuxtApp.provide('lenis', lenis)
  nuxtApp.hook('page:finish', () => lenis.resize())
  const router = useRouter()
  router.afterEach((to, from) => {
    if (to.hash || to.path === from.path) return
    lenis.scrollTo(0, { immediate: true })
  })
})
