<script setup lang="ts">
import type { ProjectSummary } from '#shared/types/api'
import { mediaForSlug } from '~/content/showcase'

// A project on its screen. When the product has a real recording it plays that;
// otherwise the screenshot. Projects without either get a typeset plate, never a
// stock picture.
const props = defineProps<{ project: Pick<ProjectSummary, 'name' | 'image' | 'project_type'> & { slug?: string }, sizes?: string, eager?: boolean, still?: boolean }>()
const { t } = useI18n()

const sizes = computed(() => props.sizes ?? 'xs:100vw md:720px')
const media = computed(() => (!props.still && props.project.slug ? mediaForSlug(props.project.slug) : undefined))
const cdn = computed(() => isCloudinary(props.project.image))
const failed = ref(false)
const img = ref<HTMLImageElement | null>(null)

// An image that errored before hydration never reaches @error: check once mounted.
onMounted(() => {
  const el = img.value
  if (el && el.complete && el.naturalWidth === 0) failed.value = true
})
</script>

<template>
  <div class="figure relative overflow-hidden rounded-[var(--radius-screen)] bg-raise">
    <ScreenVideo v-if="media" :name="media" :label="t('home.work.video', { name: props.project.name })" fill />
    <template v-else-if="props.project.image && !failed">
      <img
        v-if="cdn"
        ref="img"
        :src="cloudinaryUrl(props.project.image, 1280)"
        :srcset="cloudinarySrcset(props.project.image)"
        :sizes="toSizesAttr(sizes)"
        :alt="t('work.imageAlt', { name: props.project.name })"
        width="1600"
        height="1000"
        :loading="props.eager ? 'eager' : 'lazy'"
        :fetchpriority="props.eager ? 'high' : undefined"
        decoding="async"
        class="size-full object-cover object-left-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
        @error="failed = true"
      >
      <NuxtImg
        v-else
        :src="props.project.image"
        :alt="t('work.imageAlt', { name: props.project.name })"
        :sizes="sizes"
        width="1600"
        height="1000"
        :loading="props.eager ? 'eager' : 'lazy'"
        class="size-full object-cover object-left-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
        @error="failed = true"
      />
    </template>
    <div v-else class="flex size-full flex-col justify-between p-6 md:p-8">
      <BrandMark class="h-10 w-auto self-start text-faint" />
      <span class="text-[clamp(1.75rem,1rem+2.5vw,3rem)] font-bold leading-none tracking-[-0.03em]">{{ props.project.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.figure { box-shadow: 0 1px 0 var(--color-ink-wash) inset, 0 30px 60px -30px rgb(0 0 0 / 0.85); }
</style>
