<script setup lang="ts">
import type { NuxtError } from '#app'
import { ArrowRight, ChevronRight } from '@lucide/vue'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: notFound.value ? t('error.notFoundTitle') : t('error.title') })
useSeoMeta({ robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section class="container-x grid min-h-[70dvh] content-center gap-10 py-20 lg:grid-cols-12 lg:items-center">
      <div class="lg:col-span-7">
        <h1 class="h-page max-w-[14ch]">{{ notFound ? t('error.notFoundTitle') : t('error.title') }}</h1>
        <p class="lead mt-6 max-w-[48ch]">{{ notFound ? t('error.notFound') : t('error.body') }}</p>
        <p class="mt-4 text-[0.9375rem] text-mute tabular">Error {{ props.error.statusCode }}</p>
        <div class="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <UiButton :to="localePath('index')" size="lg" @click="clearError()">
            {{ t('error.home') }}
            <template #icon><ArrowRight aria-hidden="true" /></template>
          </UiButton>
          <NuxtLinkLocale to="projects" class="link-more" @click="clearError()">{{ t('cta.projects') }} <ChevronRight aria-hidden="true" /></NuxtLinkLocale>
        </div>
      </div>
      <div class="hidden lg:col-span-3 lg:col-start-10 lg:block" aria-hidden="true">
        <BrandMark class="w-full text-ink" missing-middle />
      </div>
    </section>
  </NuxtLayout>
</template>
