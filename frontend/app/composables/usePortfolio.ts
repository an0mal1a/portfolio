import type {
  Client,
  ContactPayload,
  PortfolioProject,
  Project,
  Repository,
} from '~/types/portfolio'

interface ProjectsResponse { status: string; projects: Project[] }
interface RepositoriesResponse { status: string; repos: Repository[] }
interface ClientsResponse { status: string; clients: Client[] }
interface ContactResponse { status: 'ok' | 'ko'; error?: string }

export const usePortfolio = () => {
  const config = useRuntimeConfig();

  const buildApiUrl = (path: string) => {
    const baseUrl = config.public.apiBase.replace(/\/$/, '')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    console.log(`API URL: ${baseUrl}${normalizedPath}`)
    return `${baseUrl}${normalizedPath}`
  }

  const { data, status, error, refresh } = useAsyncData('portfolio-data', async () => {
    const [projectsResponse, repositoriesResponse, clientsResponse] = await Promise.all([
      $fetch<ProjectsResponse>(buildApiUrl('/projects')),
      $fetch<RepositoriesResponse>(buildApiUrl('/repositories')),
      $fetch<ClientsResponse>(buildApiUrl('/clients')),
    ])

    return {
      projects: projectsResponse.projects ?? [],
      repositories: repositoriesResponse.repos ?? [],
      clients: clientsResponse.clients ?? [],
    }
  }, {
    default: () => ({ projects: [], repositories: [], clients: [] }),
  })

  const repositories = computed(() => data.value.repositories)
  const clients = computed(() => data.value.clients)

  const projects = computed<PortfolioProject[]>(() => data.value.projects
    .filter(project => project.is_public)
    .map((project) => {
      const repository = repositories.value.find(repo => (
        repo.id === project.github_repository_id
        || (project.github_repository_github_id != null
          && repo.github_id === project.github_repository_github_id)
      ))
      const client = clients.value.find(item => item.id === project.client_id)

      return { ...project, repository, client }
    })
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured)))

  const publicRepositories = computed(() => repositories.value
    .filter(repository => repository.visibility === 'public' && !repository.is_archived))

  const sendContact = (payload: ContactPayload) => $fetch<ContactResponse>(buildApiUrl('/contact'), {
    method: 'POST',
    body: payload,
  })

  return {
    projects,
    repositories: publicRepositories,
    clients,
    status,
    error,
    refresh,
    sendContact,
  }
}
