<template>
    <article
        class="rounded-sm border border-line bg-surface p-4 transition-colors hover:bg-surface-raised"
    >
        <span
            class="mb-10 grid size-7 place-items-center rounded-sm border border-line bg-background-secondary text-xs text-muted"
            >{{ number }}</span
        >
        <h3 class="m-0 text-base font-medium tracking-[-0.025em]">
            {{ title }}
        </h3>
        <p class="mt-2 mb-0 text-xs leading-5 text-muted">{{ text }}</p>
    </article>
</template>

<script setup lang="ts">
defineProps<{
    number: string;
    title: string;
    text: string;
}>();
</script>
