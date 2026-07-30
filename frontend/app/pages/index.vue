<template>
  <div>
    <Hero :project-count="projects.length" :client-count="clients.length" />
    <TrustedClients :clients="clients" />
    <ProjectGallery :projects="projects" :status="status" />
    <GithubLab :repositories="repositories" />
    <AboutSection />
    <ContactSection :send-contact="sendContact" />

    <aside v-if="error" class="api-notice" role="status">
      <span>Live data is temporarily offline.</span>
      <button type="button" @click="refresh()">Retry</button>
    </aside>
  </div>
</template>

<script setup lang="ts">
const { projects, repositories, clients, status, error, refresh, sendContact } = usePortfolio()

useSeoMeta({
  title: 'Pablo Diez — Backend Engineer & Creative Developer',
  description: 'Independent backend engineer and creative developer building reliable systems, APIs and digital products.',
  ogTitle: 'Pablo Diez — Systems with a pulse',
  ogDescription: 'Backend engineering, product thinking and creative development.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

let observer: IntersectionObserver | undefined
const observeReveals = async () => {
  await nextTick()
  document.querySelectorAll<HTMLElement>('.reveal:not([data-observed])').forEach((element) => {
    element.dataset.observed = 'true'
    observer?.observe(element)
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer?.unobserve(entry.target)
    })
  }, { threshold: .1, rootMargin: '0px 0px -7% 0px' })
  observeReveals()
})

watch(status, observeReveals)
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.api-notice { position: fixed; z-index: 100; right: 1rem; bottom: 1rem; display: flex; align-items: center; gap: 1rem; padding: .8rem 1rem; border: 1px solid rgb(255 255 255 / 16%); color: var(--ink); background: #171715; box-shadow: 0 1rem 3rem rgb(0 0 0 / 35%); font-size: .68rem; }.api-notice button { padding: .45rem .65rem; border: 0; color: white; background: var(--red); cursor: pointer; font-size: .6rem; font-weight: 700; text-transform: uppercase; }
</style>
