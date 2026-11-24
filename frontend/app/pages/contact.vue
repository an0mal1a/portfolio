<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const steps = computed(() => (tm('contactPage.steps') as { title: string, body: string }[]).map(s => ({ title: rt(s.title), body: rt(s.body) })))

usePageSeo({ title: t('seo.contact.title'), description: t('seo.contact.description') })
useSchemaOrg([
  defineWebPage({ '@type': 'ContactPage' }),
  defineBreadcrumb({ itemListElement: [{ name: t('breadcrumb.home'), item: localePath('index') }, { name: t('nav.contact'), item: localePath('contact') }] }),
])
</script>

<template>
  <div>
    <ContactSection as="h1" :title="t('contact.title')" :lead="t('contactPage.lead')" class="contact-page" />
    <section class="container-x pb-[var(--section)]" :aria-label="t('contactPage.stepsLabel')">
      <ol class="grid gap-x-[var(--gutter)] gap-y-10 md:grid-cols-3">
        <li v-for="(s, i) in steps" :key="s.title" class="border-t border-line pt-6">
          <p class="text-[0.875rem] text-mute tabular" :aria-label="t('service.step', { n: i + 1, total: steps.length })">{{ t('service.stepOf', { n: i + 1, total: steps.length }) }}</p>
          <h2 class="mt-2 text-[1.25rem] font-bold tracking-[-0.015em]">{{ s.title }}</h2>
          <p class="mt-2.5 text-ink-2">{{ s.body }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.contact-page { padding-top: clamp(2rem, 4vw, 3.5rem); }
</style>
