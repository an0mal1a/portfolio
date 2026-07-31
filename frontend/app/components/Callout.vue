<template>
    <aside
        class="mt-6 flex gap-3 rounded-sm border border-line bg-surface p-3 text-sm leading-6 text-muted"
    >
        <Info :size="16" class="mt-1 shrink-0 text-signal" />
        <p class="m-0">
            <strong class="mr-2 font-medium text-ink">{{ title }}</strong
            ><slot />
        </p>
    </aside>
</template>

<script setup lang="ts">
import { Info } from "@lucide/vue";

defineProps<{
    title: string;
}>();
</script>
