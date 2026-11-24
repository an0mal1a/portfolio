<script setup lang="ts">
/**
 * A real recording of a shipped product. Plays only while on screen, never
 * downloads before it is near the viewport, and with reduced motion it stays on
 * its poster with controls, so the visitor decides.
 */
const props = defineProps<{ name: string, label: string, fill?: boolean }>()
const video = ref<HTMLVideoElement | null>(null)
const reduced = ref(false)

onMounted(() => {
  const el = video.value
  if (!el) return
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) return
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      el.preload = 'auto'
      el.play().catch(() => {})
    }
    else el.pause()
  }, { threshold: 0.35 })
  io.observe(el)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <video
    ref="video"
    class="block w-full bg-[#f4f3f0] object-cover object-top"
    :class="props.fill ? 'h-full' : 'aspect-[16/10]'"
    muted
    loop
    playsinline
    preload="none"
    :controls="reduced"
    :poster="`/media/${props.name}.jpg`"
    :aria-label="props.label"
    width="1280"
    height="800"
  >
    <source :src="`/media/${props.name}.av1.mp4`" type="video/mp4; codecs=av01.0.05M.08">
    <source :src="`/media/${props.name}.mp4`" type="video/mp4">
  </video>
</template>
