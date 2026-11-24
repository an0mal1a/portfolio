<script setup lang="ts">
// The modular "P" from pablo-brand-kit/assets/logo-mark.svg. Geometry is fixed:
// never stretch, rotate, outline or shadow it (brand rules).
withDefaults(defineProps<{ title?: string }>(), { title: undefined })
</script>

<template>
  <svg viewBox="0 0 140 172" :role="title ? 'img' : undefined" :aria-hidden="title ? undefined : 'true'" fill="currentColor">
    <title v-if="title">{{ title }}</title>
    <path fill-rule="evenodd" d="M 0,0 H 104 L 140,34 V 46 H 0 Z M 0,72 H 140 V 84 L 106,118 H 0 Z M 0,0 H 38 V 172 H 0 Z" />
  </svg>
</template>
