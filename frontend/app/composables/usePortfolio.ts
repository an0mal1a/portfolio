import type { AsyncDataRequestStatus } from "#app";
import type {
    Client,
    ContactPayload,
    PortfolioProject,
    Project,
    Repository,
} from "~/types/portfolio";

interface ProjectsResponse {
    status: string;
    projects: Project[];
}

interface RepositoriesResponse {
    status: string;
    repos: Repository[];
}

interface ClientsResponse {
    status: string;
    clients: Client[];
}

interface ContactResponse {
    status: "ok" | "ko";
    error?: string;
}

const buildApiUrl = (path: string) => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
};

const fetchCollection = async <Response, Item>(
    path: string,
    select: (response: Response) => Item[],
) => {
    const response = await $fetch<Response>(buildApiUrl(path), {
        retry: 0,
        timeout: 8_000,
    });
    const collection = select(response);

    if (!Array.isArray(collection)) {
        throw new Error(
            `La respuesta de ${path} no contiene una colección válida.`,
        );
    }

    return collection;
};

const retryAfterHydration = (
    error: Readonly<Ref<Error | null | undefined>>,
    refresh: () => Promise<unknown>,
) => {
    onMounted(() => {
        if (error.value) void refresh();
    });
};

export const useRepositories = () => {
    const state = useAsyncData(
        "portfolio-repositories",
        () =>
            fetchCollection<RepositoriesResponse, Repository>(
                "/github/repositories",
                (response) => response.repos,
            ),
        {
            default: () => [],
            deep: false,
            dedupe: "defer",
        },
    );

    retryAfterHydration(state.error, state.refresh);

    const repositories = computed(() =>
        state.data.value
    );

    return {
        repositories,
        status: state.status,
        error: state.error,
        refresh: state.refresh,
    };
};

export const useClients = () => {
    const state = useAsyncData(
        "portfolio-clients",
        () =>
            fetchCollection<ClientsResponse, Client>(
                "/clients",
                (response) => response.clients,
            ),
        {
            default: () => [],
            deep: false,
            dedupe: "defer",
        },
    );

    retryAfterHydration(state.error, state.refresh);

    return {
        clients: state.data,
        status: state.status,
        error: state.error,
        refresh: state.refresh,
    };
};

export const useProjects = () => {
    const projectState = useAsyncData(
        "portfolio-projects",
        () =>
            fetchCollection<ProjectsResponse, Project>(
                "/projects",
                (response) => response.projects,
            ),
        {
            default: () => [],
            deep: false,
            dedupe: "defer",
        },
    );
    const repositoryState = useRepositories();
    const clientState = useClients();

    retryAfterHydration(projectState.error, projectState.refresh);

    const projects = computed<PortfolioProject[]>(() =>
        projectState.data.value
            .filter((project) => project.is_public)
            .map((project) => {
                const repository = repositoryState.repositories.value.find(
                    (item) =>
                        item.id === project.github_repository_id ||
                        (project.github_repository_github_id != null &&
                            item.github_id ===
                                project.github_repository_github_id),
                );
                const client = clientState.clients.value.find(
                    (item) => item.id === project.client_id,
                );

                return { ...project, repository, client };
            })
            .sort((a, b) => Number(b.is_featured) - Number(a.is_featured)),
    );

    const status = computed<AsyncDataRequestStatus>(() => {
        if (projectState.status.value === "pending") return "pending";
        if (projectState.status.value === "error") return "error";
        return projectState.status.value;
    });
    const error = computed(
        () =>
            projectState.error.value ||
            repositoryState.error.value ||
            clientState.error.value,
    );
    const refresh = () =>
        Promise.allSettled([
            projectState.refresh(),
            repositoryState.refresh(),
            clientState.refresh(),
        ]);

    return {
        projects,
        repositories: repositoryState.repositories,
        clients: clientState.clients,
        status,
        error,
        projectsError: projectState.error,
        repositoriesError: repositoryState.error,
        clientsError: clientState.error,
        refresh,
    };
};

export const usePortfolio = () => {
    const portfolio = useProjects();

    const sendContact = (payload: ContactPayload) =>
        $fetch<ContactResponse>(buildApiUrl("/contact"), {
            method: "POST",
            body: payload,
            retry: 0,
            timeout: 8_000,
        });

    return {
        ...portfolio,
        sendContact,
    };
};
