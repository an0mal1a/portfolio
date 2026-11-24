import type { ProjectSummary } from '#shared/types/api'

export default defineEventHandler(async (event): Promise<ProjectSummary[]> => {
  const { locale } = getQuery(event)
  const [projects, clients, repos] = await Promise.all([
    getProjects(),
    getClients().catch(() => []),
    getRepos().catch(() => []),
  ])
  return projects.map((source) => {
    const { content_html: _omit, ...project } = localizeProject(source, locale)
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
