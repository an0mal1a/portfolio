// Everything the home page needs in one cached round trip. System status rides
// along only when it is already cached: its upstream probe can take seconds, so
// a cold cache never holds the response (the lookup keeps warming it meanwhile)
// and the browser re-asks /api/status after first paint either way.
const STATUS_WAIT_MS = 120

export default defineEventHandler(async () => {
  const [projects, clients, repos, profile, status] = await Promise.all([
    getProjects().catch(() => []),
    getClients().catch(() => []),
    getRepos().catch(() => []),
    getProfile().catch(() => null),
    Promise.race([
      getStatus().catch(() => null),
      new Promise<null>(resolve => setTimeout(resolve, STATUS_WAIT_MS, null)),
    ]),
  ])
  const gh = profile ? toGitHubProfile(profile) : null
  const reposPayload = toReposPayload(repos)
  return {
    counts: {
      projects: projects.length,
      clients: clients.length,
      repos: reposPayload.totals.repos,
      languages: reposPayload.languages.length,
      contributions: gh?.contributions.total ?? 0,
      activeDays: gh?.contributions.activeDays ?? 0,
    },
    contributions: gh?.contributions ?? null,
    languages: reposPayload.languages,
    status,
  }
})
