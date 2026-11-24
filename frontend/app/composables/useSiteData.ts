import type { ContributionSummary, LanguageShare, ProjectSummary, StatusPayload } from '#shared/types/api'

export interface Overview {
  counts: { projects: number, clients: number, repos: number, languages: number, contributions: number, activeDays: number }
  contributions: ContributionSummary | null
  languages: LanguageShare[]
  /** Present only when the status cache was warm at render time. */
  status: StatusPayload | null
}

/** Home + strip data, cached by Nitro; deduplicated across components by key. */
export function useOverview() {
  return useFetch<Overview>('/api/overview', { key: 'overview', dedupe: 'defer' })
}

export function useProjects() {
  return useFetch<ProjectSummary[]>('/api/projects', { key: 'projects', dedupe: 'defer', default: () => [] })
}

/**
 * Live system status. Client-only and lazy: the upstream probe can take a few
 * seconds and must never delay first paint or SSR.
 */
export function useSystemStatus() {
  const res = useFetch<StatusPayload>('/api/status', { key: 'status', server: false, lazy: true, dedupe: 'defer' })
  // Server-rendered value from the overview (when its cache was warm) until the live answer lands.
  const { data: overview } = useNuxtData<Overview>('overview')
  const current = computed(() => res.data.value ?? overview.value?.status ?? null)
  const latency = computed(() => current.value?.reachable ? current.value.services?.database?.latency_ms ?? null : null)
  const state = computed<'checking' | 'operational' | 'degraded' | 'down'>(() => {
    const d = current.value
    if (!d) return res.error.value ? 'down' : 'checking'
    if (!d.reachable) return 'down'
    return d.status === 'operational' ? 'operational' : 'degraded'
  })
  return { ...res, latency, state }
}
