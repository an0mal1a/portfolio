<template>
    <header>
        <p class="mb-3 flex items-center gap-2 text-xs text-signal">
            <CircleDot :size="16" />
            {{ eyebrow }}
        </p>
        <h2
            class="m-0 font-display text-[clamp(3.8rem,7vw,7rem)] leading-[0.75] tracking-[-0.025em]"
        >
            {{ title }}
        </h2>
        <p class="mt-5 max-w-2xl text-[15px] leading-7 text-muted">
            {{ description }}
        </p>
    </header>
</template>

<script setup lang="ts">
import { CircleDot } from "@lucide/vue";

defineProps<{
    eyebrow: string;
    title: string;
    description: string;
}>();
</script>
