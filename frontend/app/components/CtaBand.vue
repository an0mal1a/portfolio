<template>
    <section
        class="soft-noise relative overflow-hidden border-t border-line bg-background-secondary px-4 py-16 sm:px-6 sm:py-24"
        :aria-labelledby="titleId"
    >
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(229,72,77,.09),transparent_40%)]"
            aria-hidden="true"
        />
        <div
            class="relative mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
            data-reveal
        >
            <div>
                <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                    <i class="signal-pulse size-1.5 rounded-full bg-signal" />
                    {{ eyebrow }}
                </p>
                <h2
                    :id="titleId"
                    class="m-0 max-w-[16ch] font-display text-[clamp(3.8rem,7vw,7rem)] leading-[0.76] font-normal tracking-[-0.03em]"
                >
                    {{ title }}
                </h2>
                <p class="mt-5 mb-0 max-w-xl text-sm leading-6 text-muted">
                    {{ text }}
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <NuxtLink
                    to="/#contact"
                    class="inline-flex items-center gap-2 rounded-sm bg-ink px-3.5 py-2.5 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                >
                    Cuéntame tu proyecto
                    <ArrowUpRight :size="16" />
                </NuxtLink>
                <NuxtLink
                    v-if="secondary"
                    :to="secondary.to"
                    class="inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-surface-raised"
                >
                    {{ secondary.label }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

withDefaults(
    defineProps<{
        eyebrow?: string;
        title: string;
        text: string;
        secondary?: { label: string; to: string } | null;
    }>(),
    {
        eyebrow: "Disponible para nuevos proyectos",
        secondary: null,
    },
);

const titleId = useId();
</script>
