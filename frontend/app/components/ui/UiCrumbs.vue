<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { RouteLocationRaw } from 'vue-router'

/** Breadcrumb trail; the last item is the current page. */
const props = defineProps<{ items: { label: string, to?: RouteLocationRaw }[] }>()
const { t } = useI18n()
</script>

<template>
  <nav :aria-label="t('breadcrumb.label')" class="text-[0.9375rem] text-mute">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <li v-for="(item, i) in props.items" :key="i" class="flex items-center gap-1.5">
        <ChevronRight v-if="i > 0" class="size-3.5 text-faint" aria-hidden="true" />
        <NuxtLink v-if="item.to && i < props.items.length - 1" :to="item.to" class="link-quiet hover:text-ink">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page" class="text-ink-2">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
