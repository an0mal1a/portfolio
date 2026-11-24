import type { ContactError, ContactPayload } from '#shared/types/api'

type State = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Posts straight from the browser to the Rust API so its per-IP rate limit
 * (3/min) applies to each visitor, not to the Nuxt server.
 */
export function useContactForm() {
  const { apiBase } = useBackendBase()
  const state = ref<State>('idle')
  const error = ref<ContactError | null>(null)
  const retryAfter = ref<number | null>(null)

  async function send(payload: ContactPayload) {
    if (state.value === 'sending') return
    state.value = 'sending'
    error.value = null
    retryAfter.value = null
    try {
      const res = await $fetch.raw<{ status: string, error?: ContactError, retry_after?: number }>('/contact', {
        baseURL: apiBase,
        method: 'POST',
        body: { ...payload, phone: payload.phone ?? '' },
        ignoreResponseError: true,
        timeout: 20000,
      })
      const body = res._data
      if (res.status === 429) {
        error.value = 'rate_limited'
        retryAfter.value = body?.retry_after ?? Number(res.headers.get('retry-after')) ?? null
        state.value = 'error'
        return
      }
      if (res.ok && body?.status === 'ok') {
        state.value = 'sent'
        return
      }
      error.value = body?.error ?? 'unknown'
      state.value = 'error'
    }
    catch {
      error.value = 'network_error'
      state.value = 'error'
    }
  }

  function reset() {
    state.value = 'idle'
    error.value = null
    retryAfter.value = null
  }

  return { state, error, retryAfter, send, reset }
}
