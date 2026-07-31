<template>
  <div class="mt-6 overflow-hidden rounded-sm border border-line bg-background">
    <div
      class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
    >
      <span class="flex items-center gap-2">
        <FileCode2 :size="16" />
        {{ filename }}
      </span>
      <button
        type="button"
        class="flex items-center gap-2 rounded-sm px-2 py-1 text-xs transition-colors hover:bg-surface hover:text-ink"
        @click="copyCode"
      >
        <Check v-if="copied" :size="16" />
        <Copy v-else :size="16" />
        {{ copied ? "Copiado" : "Copiar" }}
      </button>
    </div>
    <pre
      class="m-0 overflow-x-auto p-4 font-mono text-xs leading-6 text-white/70"
    ><code><span v-for="(line, index) in lines" :key="index" class="grid min-w-max grid-cols-[2rem_1fr]"><i class="select-none pr-3 text-right not-italic text-white/20">{{ index + 1 }}</i><span class="whitespace-pre">{{ line || ' ' }}</span></span></code></pre>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy, FileCode2 } from "@lucide/vue";

const props = defineProps<{
  filename: string;
  lines: string[];
}>();

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

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
