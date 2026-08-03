<template>
    <div
        class="mt-6 overflow-hidden rounded-sm border border-line bg-background"
    >
        <div
            class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
        >
            <span class="flex items-center gap-2">
                <FileCode2 :size="16" />
                {{ filename }}
            </span>
            <div class="flex items-center gap-1">
                <button
                    v-if="collapsible"
                    type="button"
                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-xs transition-colors hover:bg-surface hover:text-ink"
                    :aria-expanded="expanded"
                    @click="expanded = !expanded"
                >
                    <ChevronDown
                        :size="16"
                        class="transition-transform"
                        :class="expanded ? 'rotate-180' : ''"
                    />
                    {{ expanded ? "Ocultar" : "Ver todo" }}
                </button>
                <button
                    type="button"
                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-xs transition-colors hover:bg-surface hover:text-ink"
                    @click="copyCode"
                >
                    <Check v-if="copied" :size="16" />
                    <Copy v-else :size="16" />
                    {{ copied ? "Copiado" : "Copiar" }}
                </button>
            </div>
        </div>
        <pre
            class="m-0 overflow-x-auto p-4 font-mono text-xs leading-6 text-white/70"
        ><code><span v-for="(line, index) in visibleLines" :key="index" class="grid min-w-max grid-cols-[2rem_1fr]"><i class="select-none pr-3 text-right not-italic text-white/20">{{ index + 1 }}</i><span class="whitespace-pre">{{ line || ' ' }}</span></span></code></pre>
    </div>
</template>

<script setup lang="ts">
import { Check, ChevronDown, Copy, FileCode2 } from "@lucide/vue";

const props = defineProps<{
    filename: string;
    lines: string[];
    collapsible?: boolean;
    previewLines?: number;
}>();

const copied = ref(false);
const expanded = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const visibleLines = computed(() => {
    if (!props.collapsible || expanded.value) return props.lines;
    return props.lines.slice(0, props.previewLines || 15);
});

const copyCode = async () => {
    await navigator.clipboard.writeText(props.lines.join("\n"));
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        copied.value = false;
    }, 1600);
};

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>
