export interface Contributor {
    github_login: string;
    avatar_url?: string | null;
    profile_url?: string | null;
    contributions: number;
}

export interface Repository {
    id: number;
    github_id?: number | null;
    owner: string;
    full_name?: string | null;
    display_name: string;
    description?: string | null;
    visibility: "public" | "private" | string;
    primary_language?: string | null;
    repository_url?: string | null;
    stars_count?: number | null;
    forks_count?: number | null;
    open_issues_count?: number | null;
    is_fork: boolean;  
    is_archived: boolean;
    github_created_at?: string | null;
    github_updated_at?: string | null;
    github_pushed_at?: string | null;
    synced_at?: string | null;
    contributors?: Contributor[];
}

export interface Client {
    id: number;
    name: string;
    website?: string | null;
    logo_url?: string | null;
    created_at?: string | null;
}

export interface Project {
    id: number;
    github_repository_id?: number | null;
    github_repository_github_id?: number | null;
    client_id?: number | null;
    name: string;
    slug: string;
    tagline?: string | null;
    description: string;
    content_html?: string | null;
    project_type: string;
    status: "draft" | "in_progress" | "published" | "archived" | string;
    repository_url?: string | null;
    live_url?: string | null;
    image?: string | null;
    is_featured: boolean;
    is_public: boolean;
    started_at?: string | null;
    completed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PortfolioProject extends Project {
    client?: Client;
    repository?: Repository;
}

export interface GitHubProfileLink {
    provider: string;
    url: string;
}

export interface GitHubContribution {
    date: string;
    commits: number;
    contrib_level?: string | null;
}

export interface GitHubProfile {
    id?: number | null;
    name?: string | null; 
    username?: string | null;
    blog?: string | null;
    bio?: string | null;
    avatar?: string | null;
    followers?: number | null;
    following?: number | null;
    links?: GitHubProfileLink[] | null;
    description?: string | null; 
    contributions?: GitHubContribution[] | null;
}

export interface GitHubProfileResponse {
    status: string;
    profile: GitHubProfile;
}

export interface ContactPayload {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
