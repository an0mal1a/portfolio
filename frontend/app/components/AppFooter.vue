<template>
    <footer class="border-t border-line bg-background px-4 py-6 sm:px-6">
        <div
            class="mx-auto flex max-w-[92rem] flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
        >
            <p class="m-0">
                {{ year }} Pablo Diez. Construido como un sistema, no como una
                plantilla.
            </p>
            <div class="flex items-center gap-4">
                <NuxtLink
                    to="/system"
                    class="flex items-center gap-1.5 transition-colors hover:text-ink"
                >
                    Ver arquitectura
                    <Network :size="16" />
                </NuxtLink>
                <a
                    href="#top"
                    class="flex items-center gap-1.5 transition-colors hover:text-ink"
                >
                    Volver arriba
                    <ArrowUp :size="16" />
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ArrowUp, Network } from "@lucide/vue";

const year = new Date().getFullYear();
</script>
