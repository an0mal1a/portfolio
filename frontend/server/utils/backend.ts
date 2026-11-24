import type { H3Event } from 'h3'

/**
 * Server-side access to the public Rust API.
 *
 * Every SSR render goes through Nitro, which talks to the Rust API from a single
 * IP. The Rust API rate-limits per IP (120 req/min), so all reads are cached here
 * with stale-while-revalidate: visitors never wait on the backend and a traffic
 * spike never exhausts the quota.
 */
export async function backendGet<T>(event: H3Event | undefined, path: string, opts: { timeout?: number } = {}): Promise<T> {
  const config = useRuntimeConfig(event)
  // Plain ofetch typing: Nitro's typed internal-route inference does not apply to an external base URL.
  const data: unknown = await $fetch(path, {
    baseURL: config.apiInternalBase || config.public.apiBase,
    timeout: opts.timeout ?? 6000,
    retry: 1,
    retryDelay: 300,
    headers: { accept: 'application/json' },
  })
  return data as T
}

/** Normalises the `{ status: 'ok' | 'ko' }` envelope used by the Rust API. */
export function assertOk<T extends { status?: string }>(payload: T, what: string): T {
  if (payload?.status !== 'ok') {
    throw createError({ statusCode: 502, statusMessage: `Upstream error while reading ${what}` })
  }
  return payload
}
