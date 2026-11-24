import type { ProjectSummary } from '#shared/types/api'

export default defineEventHandler(async (): Promise<ProjectSummary[]> => {
  const [projects, clients, repos] = await Promise.all([
    getProjects(),
    getClients().catch(() => []),
    getRepos().catch(() => []),
  ])
  return projects.map(({ content_html: _omit, ...project }) => {
    const repo = repos.find(r => r.id === project.github_repository_id) ?? null
    return {
      ...project,
      client: clients.find(c => c.id === project.client_id) ?? null,
      repo: repo && {
        display_name: repo.display_name,
        primary_language: repo.primary_language,
        stars_count: repo.stars_count,
        visibility: repo.visibility,
        github_pushed_at: repo.github_pushed_at,
      },
    }
  })
})
