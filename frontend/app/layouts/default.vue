<template>
  <div class="site-frame">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <AppHeader />
    <main id="main-content" tabindex="-1"><slot /></main>
    <AppFooter />
  </div>
</template>

<style scoped>
.site-frame { min-height: 100vh; background: var(--paper); }.skip-link { position: fixed; z-index: 999; top: .75rem; left: .75rem; padding: .75rem 1rem; color: white; background: var(--red); transform: translateY(-200%); transition: transform .2s ease; }.skip-link:focus { transform: none; }
</style>
