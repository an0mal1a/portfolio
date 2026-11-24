<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Pill buttons. `tally` is the one primary action on a screen; `ghost` is its quiet
 * companion. Both are fully rounded, keynote-style.
 */
const props = withDefaults(defineProps<{
  to?: RouteLocationRaw
  href?: string
  type?: 'button' | 'submit'
  variant?: 'tally' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), { to: undefined, href: undefined, type: 'button', variant: 'tally', size: 'md', disabled: false })

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: '_blank', rel: 'noopener' }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" class="pill" :class="[`pill-${variant}`, `pill-${size}`]">
    <slot />
    <slot name="icon" />
  </component>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.2s var(--ease-out-quart), color 0.2s var(--ease-out-quart), transform 0.25s var(--ease-out-expo);
  -webkit-tap-highlight-color: transparent;
}
.pill-sm { height: 2.375rem; padding-inline: 1.1rem; font-size: 0.9375rem; }
.pill-md { height: 3.25rem; padding-inline: 1.6rem; font-size: 1rem; }
.pill-lg { height: clamp(3.25rem, 2.6rem + 1.6vw, 4.5rem); padding-inline: clamp(1.6rem, 1.2rem + 1vw, 2.25rem); font-size: clamp(1rem, 0.8rem + 0.6vw, 1.5rem); }

.pill-tally { background: var(--color-tally); color: var(--color-on-tally); }
.pill-tally:hover { background: var(--color-tally-hover); }

.pill-ghost { background: var(--color-ink-wash); color: var(--color-ink); font-weight: 600; }
.pill-ghost:hover { background: var(--color-ink-wash-hover); }

.pill:active { transform: scale(0.98); }
.pill:disabled { cursor: not-allowed; opacity: 0.5; }
.pill:disabled:active { transform: none; }
.pill :deep(svg) { width: 1.1em; height: 1.1em; flex: none; transition: transform 0.3s var(--ease-out-expo); }
.pill:hover :deep(svg) { transform: translateX(0.15em); }
</style>
