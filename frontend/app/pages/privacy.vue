<script setup lang="ts">
const { t, tm, rt } = useI18n()
const sections = computed(() => (tm('privacy.sections') as { title: string, body: string }[]).map(s => ({ title: rt(s.title), body: rt(s.body) })))
usePageSeo({ title: t('seo.privacy.title'), description: t('seo.privacy.description') })
</script>

<template>
  <section class="container-x grid gap-x-[var(--gutter)] gap-y-10 pb-[var(--section)] pt-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-12">
    <div class="lg:col-span-4">
      <h1 class="h-page">{{ t('privacy.title') }}</h1>
      <p class="mt-6 text-[0.9375rem] text-mute">{{ t('privacy.updated') }}</p>
    </div>
    <div class="max-w-[68ch] lg:col-span-7 lg:col-start-6">
      <p class="lead">{{ t('privacy.intro') }}</p>
      <div v-for="s in sections" :key="s.title" class="mt-10 border-t border-line pt-6">
        <h2 class="text-[1.5rem] font-bold leading-tight tracking-[-0.02em]">{{ s.title }}</h2>
        <p class="mt-3 text-ink-2">{{ s.body }}</p>
      </div>
    </div>
  </section>
</template>
