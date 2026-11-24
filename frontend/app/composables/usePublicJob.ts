import type { JobType, PublicJobRun } from '#shared/types/api'

type JobError = 'job_already_running' | 'visitor_daily_limit' | 'public_daily_limit' | 'network_error' | 'unknown'

/**
 * Starts a public GitHub sync on the Python worker and follows its progress
 * over Server-Sent Events, falling back to polling when EventSource fails.
 */
export function usePublicJob() {
  const { public: { pythonApiBase } } = useRuntimeConfig()
  const run = ref<PublicJobRun | null>(null)
  const error = ref<JobError | null>(null)
  const remaining = ref<number | null>(null)
  const busy = computed(() => run.value?.status === 'pending' || run.value?.status === 'running')
  let source: EventSource | null = null
  let poll: ReturnType<typeof setInterval> | null = null

  function stop() {
    source?.close()
    source = null
    if (poll) clearInterval(poll)
    poll = null
  }

  function follow(runId: string) {
    stop()
    const url = `${pythonApiBase}/public/jobs/${runId}/events`
    if (typeof EventSource !== 'undefined') {
      source = new EventSource(url)
      source.addEventListener('progress', (e) => {
        run.value = JSON.parse((e as MessageEvent).data) as PublicJobRun
        if (run.value.status === 'completed' || run.value.status === 'failed') stop()
      })
      source.onerror = () => {
        source?.close()
        source = null
        if (busy.value || !run.value) startPolling(runId)
      }
    }
    else {
      startPolling(runId)
    }
  }

  function startPolling(runId: string) {
    if (poll) return
    poll = setInterval(async () => {
      try {
        run.value = await $fetch<PublicJobRun>(`/public/jobs/${runId}`, { baseURL: pythonApiBase })
        if (!busy.value) stop()
      }
      catch {
        stop()
        error.value = 'network_error'
      }
    }, 1200)
  }

  async function start(type: JobType) {
    error.value = null
    try {
      const res = await $fetch.raw<{ run_id: string, remaining_today: number, detail?: { code: JobError, run_id?: string } }>(
        `/public/jobs/${type}/run`,
        { baseURL: pythonApiBase, method: 'POST', ignoreResponseError: true },
      )
      const body = res._data as any
      if (res.status === 202 && body?.run_id) {
        remaining.value = body.remaining_today ?? null
        run.value = { id: body.run_id, job_type: type, status: 'pending', progress: 0, message: null, result: null, error: null, created_at: new Date().toISOString(), started_at: null, finished_at: null }
        follow(body.run_id)
        return
      }
      const code = body?.detail?.code as JobError | undefined
      error.value = code ?? 'unknown'
      // Someone else is already syncing: follow their run instead of failing.
      if (code === 'job_already_running' && body?.detail?.run_id) follow(body.detail.run_id)
    }
    catch {
      error.value = 'network_error'
    }
  }

  onScopeDispose(stop)
  return { run, error, remaining, busy, start, stop }
}
