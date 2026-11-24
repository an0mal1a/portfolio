<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

/**
 * The flagship, told differently from the stage: copy on the left, the real
 * product on a screen in perspective on the right, running off the edge. As it
 * reaches the middle of the viewport the screen turns towards the visitor and
 * keeps a slight angle. Small screens stack it flat.
 */
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const facts = computed(() => (tm('home.vestta.facts') as { t: string, d: string }[]).map(f => ({ t: rt(f.t), d: rt(f.d) })))

const screen = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = screen.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const wide = window.matchMedia('(min-width: 64rem)')
  const ease = (p: number) => 1 - (1 - p) ** 3
  let raf = 0
  const update = () => {
    raf = 0
    if (!wide.matches) { el.style.transform = ''; return }
    const r = el.getBoundingClientRect()
    const p = ease(Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9))))
    el.style.transform = `translateX(${(1 - p) * 8}%) rotateY(${30 - p * 18}deg) rotateX(${(1 - p) * 6}deg)`
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
  window.addEventListener('scroll', onScroll, { passive: true })
  wide.addEventListener('change', update)
  update()
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    wide.removeEventListener('change', update)
  })
})
</script>

<template>
  <section id="vestta" class="vestta" aria-labelledby="vestta-title">
    <div class="split container-x">
      <div class="copy">
        <h2 id="vestta-title" v-reveal class="title h-section">{{ t('home.vestta.title') }}</h2>
        <p v-reveal="1" class="body lead">{{ t('home.vestta.body') }}</p>
        <dl class="facts">
          <div v-for="f in facts" :key="f.t">
            <dt>{{ f.t }}</dt>
            <dd>{{ f.d }}</dd>
          </div>
        </dl>
        <div class="links">
          <UiButton :to="localePath({ name: 'projects-slug', params: { slug: 'vestta' } })" variant="ghost">{{ t('home.vestta.case') }}</UiButton>
          <a class="link-more" href="https://www.vestta.app" target="_blank" rel="noopener">
            {{ t('home.vestta.live') }} <ChevronRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <figure class="stage">
        <div ref="screen" class="screen">
          <ScreenVideo name="vestta-tour" :label="t('home.vestta.video')" />
        </div>
        <figcaption class="note">{{ t('home.vestta.note') }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.vestta { overflow: hidden; padding-top: var(--section); padding-bottom: 1.5rem; }
.split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2.5rem, 5vw, 5.5rem);
  align-items: center;
}
.title { max-width: 13ch; }
.body { margin-top: clamp(1.25rem, 2.2vw, 1.75rem); max-width: 44ch; }
.facts { margin-top: clamp(2rem, 3.6vw, 3rem); display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem; }
.facts div { border-top: 1px solid var(--color-line); padding-top: 1rem; }
.facts dt { font-size: 1.0625rem; font-weight: 700; letter-spacing: -0.01em; }
.facts dd { margin-top: 0.375rem; color: var(--color-mute); font-size: 0.9375rem; line-height: 1.5; }
.links { margin-top: clamp(2rem, 3.6vw, 2.75rem); display: flex; flex-wrap: wrap; align-items: center; gap: 0.875rem 1.75rem; }

/* The screen runs past the right edge of the page. */
.stage { margin-right: calc(var(--gutter) * -1 - 18vw); perspective: 1800px; perspective-origin: 0% 50%; }
.screen {
  overflow: hidden;
  border-radius: var(--radius-screen);
  background: #f4f3f0;
  transform-origin: 0% 50%;
  box-shadow: 0 1px 0 rgb(238 234 227 / 0.1) inset, 0 36px 70px -24px rgb(0 0 0 / 0.85);
  will-change: transform;
}
.note { margin-top: 1rem; font-size: 0.8125rem; color: var(--color-mute); }

@media (max-width: 63.99rem) {
  .split { grid-template-columns: 1fr; gap: 0; }
  .copy { display: contents; }
  .title { order: 1; }
  .body { order: 2; }
  .stage { order: 3; margin: 2.5rem 0 0; }
  .facts { order: 4; }
  .links { order: 5; }
}
@media (max-width: 35rem) {
  .facts { grid-template-columns: 1fr; }
}
</style>
