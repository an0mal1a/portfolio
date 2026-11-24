<script setup lang="ts">
import type { ProjectSummary } from '#shared/types/api'

const props = defineProps<{ project: ProjectSummary }>()
const { t } = useI18n()
</script>

<template>
  <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-mute tabular">
    <span class="text-ink-2">{{ t(`work.types.${props.project.project_type}`) }}</span>
    <template v-if="props.project.client">
      <span aria-hidden="true">·</span><span>{{ props.project.client.name }}</span>
    </template>
    <template v-if="projectYear(props.project)">
      <span aria-hidden="true">·</span><span>{{ projectYear(props.project) }}</span>
    </template>
    <span v-if="props.project.status === 'in_progress'" class="ml-1.5 inline-flex h-6 items-center rounded-full px-2.5 text-[0.8125rem] font-semibold text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-strong)]">
      {{ t('work.inProgress') }}
    </span>
  </p>
</template>
