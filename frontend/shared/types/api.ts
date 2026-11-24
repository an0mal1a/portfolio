// Contracts of the public Rust API (backends/rust-api/src/repositories/modules.rs)
// and the shapes the Nitro layer derives from them.

export type ProjectType = 'saas' | 'web' | 'automation' | 'tool'
export type ProjectStatus = 'draft' | 'in_progress' | 'published' | 'archived'

export interface Project {
  id: number
  github_repository_id: number | null
  github_repository_github_id: number | null
  client_id: number | null
  name: string
  slug: string
  tagline: string | null
  description: string
  content_html: string | null
  project_type: ProjectType
  status: ProjectStatus
  image: string | null
  repository_url: string | null
  live_url: string | null
  is_featured: boolean
  is_public: boolean
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type ProjectSummary = Omit<Project, 'content_html'> & {
  client: Client | null
  repo: Pick<Repo, 'display_name' | 'primary_language' | 'stars_count' | 'visibility' | 'github_pushed_at'> | null
}

export interface ProjectDetail {
  project: Project
  client: Client | null
  repo: Repo | null
}

export interface Client {
  id: number
  name: string
  website: string | null
  logo_url: string | null
  created_at: string | null
}

export interface Contributor {
  github_login: string
  avatar_url: string | null
  profile_url: string | null
  contributions: number
}

export interface Repo {
  id: number
  github_id: number | null
  owner: string
  full_name: string | null
  display_name: string
  description: string | null
  visibility: 'public' | 'private'
  primary_language: string | null
  forks_count: number | null
  open_issues_count: number | null
  stars_count: number | null
  is_fork: boolean
  is_archived: boolean
  repository_url: string | null
  github_created_at: string | null
  github_updated_at: string | null
  github_pushed_at: string | null
  synced_at: string | null
  contributors: Contributor[]
}

export type ContribLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'

export interface GHProfileRaw {
  id: number
  github_id: number | null
  name: string
  avatar: string | null
  username: string
  blog: string | null
  bio: string | null
  description: string | null
  followers: number | null
  following: number | null
  links: { provider: string, url: string }[] | null
  contributions: { date: string, commits: number, contrib_level: ContribLevel }[] | null
}

/** One day of the contribution calendar: date, count, level 0-4. */
export type ContributionDay = [date: string, count: number, level: 0 | 1 | 2 | 3 | 4]

export interface ContributionSummary {
  days: ContributionDay[]
  total: number
  activeDays: number
  longestStreak: number
  currentStreak: number
  busiest: { date: string, count: number } | null
  /** Contributions per weekday, Monday first. */
  byWeekday: number[]
  /** Contributions per calendar month in the window, oldest first. */
  byMonth: { month: string, count: number }[]
}

export interface GitHubProfile {
  name: string
  username: string
  avatar: string | null
  blog: string | null
  followers: number
  following: number
  links: { provider: string, url: string }[]
  contributions: ContributionSummary
}

export interface LanguageShare {
  language: string
  repos: number
}

export interface ReposPayload {
  repos: Repo[]
  languages: LanguageShare[]
  totals: { repos: number, public: number, private: number, stars: number, forks: number }
}

export type ServiceState = 'healthy' | 'unhealthy' | 'timeout' | 'unreachable' | 'disabled' | 'degraded' | string

export interface ServiceStatus {
  status: ServiceState
  latency_ms: number | null
  detail: string | null
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | string
  generated_at: string
  api_version: string
  requests_served: number | null
  uptime_seconds: number
  services: {
    database: { status: ServiceState, reader_pool: ServiceStatus, writer_pool: ServiceStatus, latency_ms: number | null }
    python_worker: ServiceStatus
    smtp: ServiceStatus
  }
  github: {
    status: 'healthy' | 'running' | 'degraded' | 'unavailable' | 'timeout' | 'unknown' | string
    last_sync: string | null
    repositories: number
    languages: number
    duration_ms: number | null
  }
}

/** Status as served to the browser, with the time Nitro observed it. */
export interface StatusPayload extends SystemStatus {
  observed_at: string
  reachable: boolean
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export type ContactError = 'invalid_mail' | 'email_error' | 'database_error' | 'rate_limited' | 'network_error' | 'unknown'

export type JobType = 'repo_sync' | 'profile'

export interface PublicJobRun {
  id: string
  job_type: JobType
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  message: string | null
  result: Record<string, unknown> | null
  error: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
}
