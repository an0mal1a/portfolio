<template>
    <div class="flex min-h-screen flex-col bg-background">
        <!-- <AppHeader v-model:menu-open="mobileMenuOpen" :nav-items="navItems" /> -->
        <main id="main-content" class="flex-1" tabindex="-1">
            <slot />
        </main>
        <!-- <AppFooter /> -->
        <!-- <CookieConsentBanner /> -->
    </div>
</template>

<script setup>
</script>