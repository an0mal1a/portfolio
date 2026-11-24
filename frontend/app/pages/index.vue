<script setup lang="ts">
const { t, tm, rt } = useI18n()

// Hold the stage's start pose from the first paint, but only when JS will run the
// entrance and motion is allowed. Server-only: client navigations land on the final state.
if (import.meta.server) {
  useHead({
    script: [{
      key: 'stage-intro',
      tagPosition: 'head',
      innerHTML: 'if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="pending"',
    }],
  })
}

// The year of code and the live status read from the cached overview.
await useOverview()

const faq = computed(() => (tm('home.faq.items') as { q: string, a: string }[]).map(i => ({ q: rt(i.q), a: rt(i.a) })))

usePageSeo({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  titleTemplate: false,
})
</script>

<template>
  <div>
    <HomeHero />
    <VesttaFeature />
    <WorkRail />
    <ServicesIndex />
    <BuiltDaily />
    <SecurityBlock />
    <FaqList :items="faq" :title="t('home.faq.title')" heading-id="faq-title" />
    <ContactSection :title="t('contact.homeTitle')" />
  </div>
</template>
