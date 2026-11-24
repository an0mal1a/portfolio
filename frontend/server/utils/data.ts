import type {
  Client,
  ContribLevel,
  ContributionDay,
  ContributionSummary,
  GHProfileRaw,
  GitHubProfile,
  LocalizedProject,
  Project,
  Repo,
  ReposPayload,
  StatusPayload,
  SystemStatus,
} from '#shared/types/api'
import { isUnpublishedClient } from '#shared/unpublished'
import { PROJECTS_EN } from '../content/projects-en'

// Cached upstream reads. `swr: true` serves the last good copy instantly and
// refreshes it in the background; maxAge is how long a copy counts as fresh.
// In dev the cache lives on disk (.nuxt/cache) and survives restarts, so the same
// settings would open the site on data from days ago: there it only deduplicates
// the requests of one page load.
const MIN = 60
const HOUR = 60 * MIN
function cached(maxAge: number, staleMaxAge: number) {
  return import.meta.dev ? { maxAge: 2, swr: false } : { maxAge, swr: true, staleMaxAge }
}

// A sync run from the Lab makes every GitHub copy taken before it invalid: the next
// read waits for fresh data instead of serving the stale copy. Throttled, because
// anyone can ask and the API limits our server to 120 requests a minute.
let githubStaleBefore = 0
export function expireGithubData() {
  if (Date.now() - githubStaleBefore > 3000) githubStaleBefore = Date.now()
}
const currentGithub = (entry: { mtime?: number }) => (entry.mtime ?? 0) > githubStaleBefore

export const getProjects = defineCachedFunction(async (): Promise<Project[]> => {
  const res = assertOk(await backendGet<{ status: string, projects: Project[] }>(undefined, '/projects'), 'projects')
  return res.projects
}, { name: 'projects', ...cached(10 * MIN, 24 * HOUR) })

export function localizeProject(project: Project, locale: unknown): LocalizedProject {
  const en = locale === 'en' ? PROJECTS_EN[project.slug] : undefined
  return en ? { ...project, ...en, lang: 'en' } : { ...project, lang: 'es' }
}

export const getClients = defineCachedFunction(async (): Promise<Client[]> => {
  const res = assertOk(await backendGet<{ status: string, clients: Client[] }>(undefined, '/clients'), 'clients')
  // Unpublished work is listed without a link (see shared/unpublished.ts).
  return res.clients.map(c => (isUnpublishedClient(c.name) ? { ...c, website: null } : c))
}, { name: 'clients', ...cached(30 * MIN, 7 * 24 * HOUR) })

export const getRepos = defineCachedFunction(async (): Promise<Repo[]> => {
  const res = assertOk(await backendGet<{ status: string, repos: Repo[] }>(undefined, '/github/repositories'), 'repositories')
  return res.repos
  // An empty list only means the first sync has not run yet: never keep it.
}, { name: 'repos', ...cached(10 * MIN, 24 * HOUR), validate: e => !!e.value?.length && currentGithub(e) })

export const getProfile = defineCachedFunction(async (): Promise<GHProfileRaw> => {
  const res = assertOk(await backendGet<{ status: string, profile: GHProfileRaw }>(undefined, '/github/me'), 'profile')
  return res.profile
}, { name: 'profile', ...cached(10 * MIN, 24 * HOUR), validate: e => !!e.value && currentGithub(e) })

export const getStatus = defineCachedFunction(async (): Promise<StatusPayload> => {
  try {
    // The upstream probes SMTP with its own 5 s limit; leave room for it so a slow
    // mail server reads as one degraded service, not as the whole API being down.
    const status = await backendGet<SystemStatus>(undefined, '/system/status', { timeout: 12000 })
    return { ...status, observed_at: new Date().toISOString(), reachable: true }
  }
  catch {
    return unreachableStatus()
  }
}, { name: 'status', ...cached(20, 10 * MIN) })

function unreachableStatus(): StatusPayload {
  const down = { status: 'unreachable', latency_ms: null, detail: null }
  const now = new Date().toISOString()
  return {
    status: 'degraded',
    generated_at: now,
    observed_at: now,
    reachable: false,
    api_version: '',
    requests_served: null,
    uptime_seconds: 0,
    services: {
      database: { status: 'unreachable', reader_pool: down, writer_pool: down, latency_ms: null },
      python_worker: down,
      smtp: down,
    },
    github: { status: 'unavailable', last_sync: null, repositories: 0, languages: 0, duration_ms: null },
  }
}

const LEVEL: Record<ContribLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

export function summariseContributions(raw: GHProfileRaw['contributions']): ContributionSummary {
  const days: ContributionDay[] = (raw ?? [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => [d.date, d.commits, LEVEL[d.contrib_level] ?? 0])

  let total = 0
  let activeDays = 0
  let longestStreak = 0
  let run = 0
  let busiest: ContributionSummary['busiest'] = null
  const byWeekday = [0, 0, 0, 0, 0, 0, 0]
  const months = new Map<string, number>()

  for (const [date, count] of days) {
    total += count
    const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7
    byWeekday[weekday]! += count
    const month = date.slice(0, 7)
    months.set(month, (months.get(month) ?? 0) + count)
    if (count > 0) {
      activeDays++
      run++
      longestStreak = Math.max(longestStreak, run)
      if (!busiest || count > busiest.count) busiest = { date, count }
    }
    else {
      run = 0
    }
  }

  // Current streak: count back from the last day, forgiving an empty "today".
  let currentStreak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    const count = days[i]![1]
    if (count > 0) currentStreak++
    else if (i === days.length - 1) continue
    else break
  }

  return {
    days,
    total,
    activeDays,
    longestStreak,
    currentStreak,
    busiest,
    byWeekday,
    byMonth: [...months.entries()].map(([month, count]) => ({ month, count })),
  }
}

export function toGitHubProfile(raw: GHProfileRaw): GitHubProfile {
  return {
    name: raw.name,
    username: raw.username,
    avatar: raw.avatar,
    blog: raw.blog,
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
    links: raw.links ?? [],
    contributions: summariseContributions(raw.contributions),
  }
}

export function toReposPayload(repos: Repo[]): ReposPayload {
  const counts = new Map<string, number>()
  let stars = 0
  let forks = 0
  let publicCount = 0
  for (const repo of repos) {
    if (repo.primary_language) counts.set(repo.primary_language, (counts.get(repo.primary_language) ?? 0) + 1)
    stars += repo.stars_count ?? 0
    forks += repo.forks_count ?? 0
    if (repo.visibility === 'public') publicCount++
  }
  return {
    repos,
    languages: [...counts.entries()]
      .map(([language, n]) => ({ language, repos: n }))
      .sort((a, b) => b.repos - a.repos || a.language.localeCompare(b.language)),
    totals: { repos: repos.length, public: publicCount, private: repos.length - publicCount, stars, forks },
  }
}
