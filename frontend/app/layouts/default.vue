<script setup lang="ts">
// The header is fixed. Every page but the home stage starts below it.
const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const isHome = computed(() => getRouteBaseName(route) === 'index')
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main id="main" class="flex-1 outline-none" :class="{ 'pt-[var(--header-h)]': !isHome }" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
