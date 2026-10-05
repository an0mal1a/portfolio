<template>
    <header class="group/heading">
        <p class="mb-3 flex items-center gap-2 text-xs text-signal">
            <CircleDot :size="16" />
            {{ eyebrow }}
        </p>
        <h2
            class="m-0 flex items-end gap-3 font-display text-[clamp(3.8rem,7vw,7rem)] leading-[0.75] tracking-[-0.025em]"
        >
            <span>{{ title }}</span>
            <button
                v-if="anchor"
                type="button"
                class="mb-2 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border border-line bg-surface px-2 py-1 font-sans text-[11px] leading-none tracking-normal text-muted opacity-0 transition-opacity group-hover/heading:opacity-100 hover:text-ink focus-visible:opacity-100"
                :aria-label="`Copiar enlace a ${title}`"
                @click="copyLink"
            >
                <Check v-if="copied" :size="13" />
                <Link2 v-else :size="13" />
                {{ copied ? "Copiado" : "Enlace" }}
            </button>
        </h2>
        <p class="mt-5 max-w-2xl text-[15px] leading-7 text-muted">
            {{ description }}
        </p>
    </header>
</template>

<script setup lang="ts">
import { Check, CircleDot, Link2 } from "@lucide/vue";

const props = defineProps<{
    eyebrow: string;
    title: string;
    description: string;
    anchor?: string;
}>();

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const copyLink = async () => {
    if (!props.anchor) return;

    const url = `${window.location.origin}${window.location.pathname}#${props.anchor}`;
    history.replaceState(history.state, "", `#${props.anchor}`);

    try {
        await navigator.clipboard.writeText(url);
        copied.value = true;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            copied.value = false;
        }, 1600);
    } catch {
        // Sin permiso de portapapeles: al menos queda el hash en la URL.
    }
};

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>
