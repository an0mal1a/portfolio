<template>
  <div class="min-h-screen bg-background text-ink">
    <a
      class="fixed top-3 left-3 z-[100] -translate-y-24 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform focus:translate-y-0"
      href="#main-content"
      >Saltar al contenido</a
    >
    <PointerFollower />
    <AppHeader />
    <main id="main-content" tabindex="-1"><slot /></main>
    <AppFooter />
  </div>
</template>
