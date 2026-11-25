<script setup lang="ts">
/**
 * Cloudflare Turnstile for one form. Nothing is requested until `prepare()` (the form
 * calls it on first focus), so pages that are only read never load Cloudflare's script.
 * The box stays hidden unless Cloudflare asks the visitor to act.
 * Without a site key the check is off and the token is empty.
 */
const props = defineProps<{ action: string }>()
const { t, locale } = useI18n()
const { public: { turnstileSiteKey } } = useRuntimeConfig()

// How long a submit waits for a token nobody has to click for.
const TOKEN_TIMEOUT = 20000

const box = ref<HTMLElement | null>(null)
const interactive = ref(false)

let api: Turnstile | null = null
let widget: string | undefined
let rendering: Promise<void> | null = null
let current = ''
let failed = false
let gone = false
let waiting: { resolve: (token: string) => void, reject: (reason: Error) => void, timer: ReturnType<typeof setTimeout> } | null = null

function settle(token: string | null) {
  if (!waiting) return
  const { resolve, reject, timer } = waiting
  waiting = null
  clearTimeout(timer)
  if (token) resolve(token)
  else reject(new Error('turnstile'))
}

function prepare(): Promise<void> {
  if (!turnstileSiteKey) return Promise.resolve()
  rendering ??= render().catch((e) => {
    rendering = null
    throw e
  })
  return rendering
}

async function render() {
  api = await loadTurnstile()
  if (gone || !box.value) return
  widget = api.render(box.value, {
    'sitekey': turnstileSiteKey,
    'action': props.action,
    'theme': 'dark',
    'language': locale.value,
    'size': 'flexible',
    'appearance': 'interaction-only',
    'callback': (token) => {
      current = token
      failed = false
      settle(token)
    },
    'expired-callback': () => { current = '' },
    'error-callback': () => {
      current = ''
      failed = true
      settle(null)
      return true
    },
    'before-interactive-callback': () => {
      interactive.value = true
      // The visitor sets the pace from here.
      if (waiting) clearTimeout(waiting.timer)
    },
    'after-interactive-callback': () => { interactive.value = false },
  })
  if (!widget) throw new Error('turnstile_render')
}

/** Resolves with a token for one request, or rejects if the check cannot run. */
async function token(): Promise<string> {
  if (!turnstileSiteKey) return ''
  await prepare()
  if (current) return current
  if (failed) reset()
  return new Promise((resolve, reject) => {
    waiting = { resolve, reject, timer: setTimeout(() => settle(null), TOKEN_TIMEOUT) }
    if (interactive.value) clearTimeout(waiting.timer)
  })
}

/** A token is good for one request: ask for the next one after each attempt. */
function reset() {
  current = ''
  failed = false
  interactive.value = false
  if (api && widget) api.reset(widget)
}

onBeforeUnmount(() => {
  gone = true
  settle(null)
  if (api && widget) api.remove(widget)
})

defineExpose({ prepare, token, reset })
</script>

<template>
  <div v-if="turnstileSiteKey" class="captcha" :class="{ 'is-on': interactive }">
    <p class="prompt" role="status">{{ interactive ? t('form.captcha') : '' }}</p>
    <div ref="box" />
  </div>
</template>

<style scoped>
/* Out of the form's grid (no empty gap) until there is something to do. */
.captcha { position: absolute; }
.captcha.is-on { position: static; display: grid; gap: 0.75rem; }
.prompt { font-size: 0.9375rem; color: var(--color-ink-2); }
</style>
