<script setup lang="ts">
// The three-piece P from pablo-brand-kit/assets/logo-mark.svg.
defineProps<{ title?: string; missingMiddle?: boolean }>()
</script>

<template>
  <svg viewBox="0 0 138 150" :role="title ? 'img' : undefined" :aria-hidden="title ? undefined : 'true'" fill="currentColor">
    <title v-if="title">{{ title }}</title>
    <path d="M 0 0 H 104 L 138 35 V 41 H 0 Z M 0 56 H 44 V 150 H 0 Z" />
    <path
      d="M 45 111 L 56 81 H 97 V 58 L 138 49 V 71 L 99 111 Z"
      :class="{ 'fill-none stroke-faint': missingMiddle }"
      stroke-width="1.5"
      stroke-dasharray="4 4"
    />
  </svg>
</template>
