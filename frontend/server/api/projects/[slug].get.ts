import type { ProjectDetail } from '#shared/types/api'

export default defineEventHandler(async (event): Promise<ProjectDetail> => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const [projects, clients, repos] = await Promise.all([
    getProjects(),
    getClients().catch(() => []),
    getRepos().catch(() => []),
  ])
  const project = projects.find(p => p.slug === slug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  return {
    project,
    client: clients.find(c => c.id === project.client_id) ?? null,
    repo: repos.find(r => r.id === project.github_repository_id) ?? null,
  }
})
