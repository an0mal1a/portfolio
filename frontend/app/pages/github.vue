<template>
    <div class="github-page min-h-screen bg-background-secondary pt-24 text-[#c9d1d9] sm:pt-28">
        <!-- <div class="border-y border-line bg-backgroun-secondary/90 px-4 backdrop-blur sm:px-6">
            <div class="mx-auto flex max-w-[80rem] items-center gap-3 py-3 text-sm">
                <span class="grid size-7 place-items-center rounded-full bg-[#f0f6fc] text-[#0d1117]"><GitFork :size="15" /></span>
                <span class="font-medium text-[#f0f6fc]">Código</span>
                <span class="hidden text-[#8b949e] sm:inline">/ perfil público y repositorios</span>
                <span class="ml-auto rounded-full border border-[#30363d] px-2.5 py-1 text-xs text-[#8b949e]">Actualizado desde GitHub</span>
            </div>
        </div> -->

        <!-- 
            - mirar de meter los logos de las tecnologias principales (y como)
            - no usar el provider como nomreb, usarlo como icono
         -->

        <main class="mx-auto grid max-w-[80rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
            <aside v-if="profileStatus !== 'pending' || profile.username" class="lg:sticky lg:top-28 lg:self-start" data-reveal>
                <div class="flex items-start gap-4 lg:block">
                    <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.name || profile.username || 'Perfil de GitHub'" class="size-20 rounded-full border-2 border-[#30363d] bg-[#161b22] object-cover sm:size-24 lg:size-full" />
                    <div v-else class="flex size-20 items-center justify-center rounded-full border-2 border-line bg-surface text-xl font-medium text-white sm:size-24 lg:size-full lg:aspect-square lg:text-4xl">{{ initials(profile.name || profile.username || 'GH') }}</div>
                    <div class="min-w-0 pt-1 lg:pt-4">
                        <h1 class="m-0 truncate text-2xl font-semibold tracking-[-0.03em] text-[#f0f6fc]">{{ profile.name || 'Name' }}</h1>
                        <p class="m-0 text-xl font-light text-muted">{{ profile.username || 'Username' }}</p>
                    </div>
                </div>

                <div class="mt-5 grid gap-2 border-y border-line py-3 text-sm text-[#f0f6fc]">
                    <!-- Follows -->
                    <div class="flex items-center gap-2">
                        <Users :size="16" class="shrink-0" />

                        <span>
                            <strong>{{ (profile.followers ?? 0).toLocaleString() }}</strong>
                            <span class="text-[#8b949e]"> seguidores</span>
                        </span>

                        <span class="text-[#8b949e]">·</span>

                        <span>
                            <strong>{{ (profile.following ?? 0).toLocaleString() }}</strong>
                            <span class="text-[#8b949e]"> siguiendo</span>
                        </span>
                    </div>

                    <!-- Contribs -->
                    <div class="flex items-center gap-2">
                        <BookMarked :size="16" class="shrink-0" />

                        <span>
                            <strong>{{ totalContributions.toLocaleString() }}</strong>
                            <span class="text-[#8b949e]"> contribuciones</span>
                        </span>

                        <span class="text-[#8b949e]">·</span>

                        <span>
                            <strong>{{ repositories.length }}</strong>
                            <span class="text-[#8b949e]"> repositorios</span>
                        </span>
                    </div>

                    <!-- Langs -->
                    <div class="flex items-start gap-2">
                        <Languages :size="16" class="mt-0.5 shrink-0" />

                        <div class="min-w-0">
                            <div>
                                <strong>{{ languages.length }}</strong>
                                <span class="text-[#8b949e]"> lenguajes principales</span>
                            </div>

                            <ul class="mt-1.5 border-t border-line pt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                <li
                                    v-for="lang in languages"
                                    :key="lang"
                                    class="flex items-center gap-1.5 text-xs text-[#c9d1d9]"
                                >
                                    <i
                                        v-if="getLanguageIcon(lang)"
                                        :class="[getLanguageIcon(lang), 'text-sm', 'colored']"
                                    />

                                    <Code2
                                        v-else
                                        :size="14"
                                        class="text-[#8b949e]"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mt-2 py-4">
                    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b949e]">Enlaces</p>

                    <div v-if="profileLinks.length" class="space-y-1">
                        <a
                            v-for="link in profileLinks"
                            :key="`${link.provider}-${link.url}`"
                            :href="link.url"
                            target="_blank"
                            rel="noreferrer"
                            class="group flex min-w-0 items-start gap-2 px-2 py-0.5 text-sm text-[#c9d1d9] hover:text-[#58a6ff]"
                        >
                            <Globe
                                v-if="link.provider === 'Website' || link.provider === 'Web' || link.provider === 'Blog'"
                                :size="13"
                                class="mt-[4px] shrink-0"
                            />

                            <Link
                                v-else
                                :size="13"
                                class="mt-[4px] shrink-0"
                            />

                            <span class="min-w-0 text-xs break-all leading-5">
                                {{ link.url }}
                            </span>
                        </a>
                    </div>

                    <p v-else class="m-0 text-sm text-[#8b949e]">
                        Sin enlaces públicos.
                    </p>
                </div>
                <NuxtLink to="/system#source-code" class="mt-4 inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#58a6ff]">Cómo se sincroniza <Network :size="15" /></NuxtLink>
            </aside>

            <div class="min-w-0">
                <nav class="mb-8 flex gap-6 overflow-x-auto border-b border-[#30363d]" aria-label="Secciones de perfil">
                    <span class="flex shrink-0 items-center gap-2 border-b-2 border-[#f78166] px-1 pb-3 text-sm font-semibold text-[#f0f6fc]"><GitCommit :size="16" />Resumen</span>
                    <a href="#repositories-title" class="flex shrink-0 items-center gap-2 px-1 pb-3 text-sm text-[#8b949e] hover:text-[#f0f6fc]"><GitFork :size="16" />Repositorios <span class="rounded-full bg-[#30363d] px-1.5 py-px text-[11px] text-[#c9d1d9]">{{ repositories.length }}</span></a>
                </nav>

                <section class="mb-8 grid gap-3 sm:grid-cols-3" data-reveal>
                    <div class="rounded-md border border-[#30363d] bg-[#161b22] p-4"><p class="m-0 text-xs uppercase tracking-[0.12em] text-[#8b949e]">Contribuciones</p><p class="mt-2 mb-0 text-2xl font-semibold text-[#f0f6fc]">{{ totalContributions.toLocaleString() }}</p><p class="mt-1 mb-0 text-xs text-[#8b949e]">en el último año</p></div>
                    <div class="rounded-md border border-[#30363d] bg-[#161b22] p-4"><p class="m-0 text-xs uppercase tracking-[0.12em] text-[#8b949e]">Repositorios</p><p class="mt-2 mb-0 text-2xl font-semibold text-[#f0f6fc]">{{ repositories.length.toString().padStart(2, '0') }}</p><p class="mt-1 mb-0 text-xs text-[#8b949e]">proyectos públicos</p></div>
                    <div class="rounded-md border border-[#30363d] bg-[#161b22] p-4"><p class="m-0 text-xs uppercase tracking-[0.12em] text-[#8b949e]">Tecnologías</p><p class="mt-2 mb-0 text-2xl font-semibold text-[#f0f6fc]">{{ languages.length.toString().padStart(2, '0') }}</p><p class="mt-1 mb-0 text-xs text-[#8b949e]">lenguajes principales</p></div>
                </section>

                <div class="markdown-body p-6 rounded-md shadow-md my-5" v-html="renderedBio" /> 

                <section
                    v-if="profile.contributions?.length"
                    class="mb-8 rounded-md border border-[#30363d] bg-[#161b22] p-4 sm:p-5"
                    data-reveal
                >
                    <div class="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h2 class="m-0 text-base font-semibold">{{ totalContributions.toLocaleString() }} contribuciones en el último año</h2>
                        </div>
                        <span class="text-xs text-base">{{ profile.contributions.length }} registros</span>
                    </div>

                    <div class="overflow-x-auto pb-2">
                        <div class="min-w-[760px]">
                            <div class="mb-3 flex gap-1 pl-8 text-[10px] text-[#8b949e]">
                                <span
                                    v-for="month in contributionMonths"
                                    :key="`${month.label}-${month.offset}`"
                                    :style="{ marginLeft: `${month.offset * 12}px` }"
                                    class="inline-block shrink-0"
                                >
                                    {{ month.label }}
                                </span>
                            </div>

                            <div class="flex gap-1">
                                <div
                                    v-for="(week, weekIndex) in contributionWeeks"
                                    :key="`week-${weekIndex}`"
                                    class="flex flex-col gap-1"
                                >
                                    <span
                                        v-for="day in week"
                                        :key="`${day.date}-${weekIndex}`"
                                        class="h-3 w-3 rounded-[2px] border border-[#161b22]"
                                        :style="{ backgroundColor: contributionColor(day.level) }"
                                        :title="`${day.date}: ${contributionLevelLabel(day.level)} ${day.commits || 0} commits`"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div
                    class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                    data-reveal
                >
                    <div class="flex items-baseline gap-3">
                        <h2
                            id="repositories-title"
                            class="m-0 text-xl font-semibold text-[#f0f6fc]"
                        >
                            Repositorios
                        </h2>
                        <span class="text-xs text-muted">
                            {{
                                filteredRepositories.length
                                    .toString()
                                    .padStart(2, "0")
                            }}
                            visibles
                        </span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <div
                            class="flex max-w-full gap-1 overflow-visible rounded-sm border border-line bg-surface p-1"
                            aria-label="Ordenar repositorios"
                        >
                            <CustomSelect
                                v-model="sorting"
                                class="w-24"
                                :options="{
                                        push: {
                                            label: 'Push',
                                            icon: GitCommit
                                        },
                                        star: {
                                            label: 'Stars',
                                            icon: Star
                                        },
                                        fork: {
                                            label: 'Forks',
                                            icon: GitFork
                                        },
                                    }"
                            />
                        </div>

                        <div
                            v-if="languages.length > 1"
                            class="flex max-w-full gap-1 overflow-x-auto rounded-sm border border-line bg-surface p-1"
                            aria-label="Filtrar repositorios por lenguaje"
                        >
                            <button
                                type="button"
                                class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                                :class="
                                    activeLanguage === 'Todos'
                                        ? 'bg-ink text-background'
                                        : 'text-muted hover:bg-surface-raised hover:text-ink'
                                "
                                @click="activeLanguage = 'Todos'"
                            >
                                Todos
                                <span class="ml-1 opacity-55">{{ repositories.length }}</span>
                            </button>
                            <button
                                v-for="language in languages"
                                :key="language"
                                type="button"
                                class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                                :class="
                                    activeLanguage === language
                                        ? 'bg-ink text-background'
                                        : 'text-muted hover:bg-surface-raised hover:text-ink'
                                "
                                @click="activeLanguage = language"
                            >
                                {{ language }}
                                <span class="ml-1 opacity-55">{{ countByLanguage(language) }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    v-if="error"
                    class="mb-3 flex flex-col gap-3 rounded-sm border border-signal/30 bg-surface px-3 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
                    role="status"
                >
                    <span class="flex items-center gap-2">
                        <CircleOff :size="16" class="shrink-0 text-signal" />
                        GitHub no está respondiendo. Puedes volver a intentarlo sin
                        recargar la página.
                    </span>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-3 py-2 font-medium text-background"
                        @click="handleRefresh()"
                    >
                        Reintentar
                        <RefreshCw :size="16" />
                    </button>
                </div>

                <div
                    v-if="status === 'pending' && !repositories.length"
                    class="grid gap-2 md:grid-cols-2"
                    aria-live="polite"
                >
                    <div
                        v-for="index in 4"
                        :key="index"
                        class="min-h-64 animate-pulse rounded-sm border border-line bg-surface"
                    >
                        <span class="sr-only">Cargando repositorio</span>
                    </div>
                </div>

                <section
                    v-else-if="filteredRepositories.length"
                    class="grid gap-4 md:grid-cols-2"
                    aria-labelledby="repositories-title"
                >
                    <RepositoryCard
                        v-for="repository in filteredRepositories"
                        :key="repository.id"
                        :repository="repository"
                    />
                </section>

                <div
                    v-else-if="!error"
                    class="grid min-h-72 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
                >
                    <div>
                        <CircleOff :size="20" class="mx-auto text-signal" />
                        <p
                            class="mx-auto mt-4 mb-0 max-w-md text-sm leading-6 text-muted"
                        >
                            No hay repositorios públicos para este filtro.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.markdown-body {
    color: var(--color-base);
    border: solid var(--color-line) 1px; 
    font-size: 0.95rem;
    line-height: 1.7;
}

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(blockquote),
.markdown-body :deep(pre),
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    margin: 0 0 0.8rem;
    list-style-type: disc;

}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    color: #f0f6fc;
    font-weight: 600;
    border-bottom: solid var(--color-line) 1px;
}

.markdown-body :deep(h1) {
    font-size: 2em;
}

.markdown-body :deep(h2) {
    font-size: 1.5em;
}

.markdown-body :deep(h3) {
    font-size: .75em;
}

.markdown-body :deep(h4) {
    font-size: .5em;
}

.markdown-body :deep(h5) {
    font-size: .25em;
}

.markdown-body :deep(h6)  {
    font-size: .15em;
}

.markdown-body :deep(hr) {
    background-color: var(--color-line);
    color: transparent;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    height: .15rem; 
}

.markdown-body :deep(a) {
    color: #58a6ff;
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

.markdown-body :deep(code) {
    background: rgba(110, 118, 129, 0.2);
    color: var(--color-base); 
    border-radius: 0.25rem;
    padding: 0.1rem 0.35rem;
    font-size: 0.88em;
}

.markdown-body :deep(pre) {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 0.5rem;
    padding: 0.9rem 1rem;
    overflow-x: auto;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    padding-left: 1.25rem;
}

.markdown-body :deep(ul) {
    margin-left: .5rem;
}

.markdown-body :deep(strong) {
    color: #f0f6fc;
    font-weight: 600;
}

.markdown-body :deep(blockquote) {
    border-left: 2px solid #30363d;
    color: #8b949e;
    padding-left: 0.8rem;
}

.markdown-body :deep(table) {
    display: block;
    width: max-content;
    max-width: 100%;
    overflow-x: auto;

    border-spacing: 0;
    border-collapse: collapse;

    margin: 0 0 1rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
    padding: 0.4rem 0.8rem;
    border: 1px solid #30363d;
}

.markdown-body :deep(th) {
    color: #f0f6fc;
    font-weight: 600; 
}

.markdown-body :deep(td) {
    color: #c9d1d9;
}

.markdown-body :deep(tr) { 
    border-top: 1px solid #21262d;
}

.markdown-body :deep(tr:nth-child(2n)) {
    background-color: #161b22;
}
</style>

<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import {
    ArrowUpRight,
    BookMarked,
    CircleOff,
    Code2,
    GitCommit,
    GitFork,
    Globe,
    Languages,
    Link,
    Network,
    RefreshCw,
    Star,
    Users,
} from "@lucide/vue";
import type { GitHubProfile, Repository } from "~/types/portfolio";

const languageIcons = {
    C: 'devicon-c-plain',
    'C++': 'devicon-cplusplus-plain',
    'C#': 'devicon-csharp-plain',
    Python: 'devicon-python-plain',
    JavaScript: 'devicon-javascript-plain',
    TypeScript: 'devicon-typescript-plain',
    Java: 'devicon-java-plain',
    Go: 'devicon-go-original-wordmark',
    Rust: 'devicon-rust-original',
    PHP: 'devicon-php-plain',
    Ruby: 'devicon-ruby-plain',
    Swift: 'devicon-swift-plain',
    Kotlin: 'devicon-kotlin-plain',
}

const { repositories, status, error, refresh } = useRepositories();
const {
    profile: githubProfile,
    status: profileStatus,
    error: profileError,
    refresh: refreshProfile,
} = useGithubProfile();
const activeLanguage = ref("Todos");
const sorting = ref("push");

const profile = computed<GitHubProfile>(() => githubProfile.value ?? {});

const initials = (value: string) =>
    value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "GH";

const profileBio = computed(
    () =>
        profile.value.bio ||
        profile.value.description ||
        profile.value.desciption ||
        "Sin bio pública disponible en GitHub por el momento.",
);

const renderedBio = computed(() => {
    const markdown = profileBio.value.trim();
    if (!markdown) return "";

    const html = marked.parse(markdown, {
        gfm: true,
        breaks: true,
    });

    return DOMPurify.sanitize(String(html), {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["style"],
    });
});

const profileLinks = computed(() => {
    const links = [...(profile.value.links ?? [])]
        .filter((link) => link?.url)
        .map((link) => ({
            provider: link.provider || "Link",
            url: link.url,
        }));

    if (profile.value.blog?.trim()) {
        links.unshift({
            provider: "Blog",
            url: profile.value.blog,
        });
    }

    return links;
});

const totalContributions = computed(
    () =>
        profile.value.contributions?.reduce(
            (total, item) => total + (item.commits || 0),
            0,
        ) ?? 0,
);

const contributionColor = (level?: string | null) => {
    const map: Record<string, string> = {
        None: "#161b22",
        FirstQuartile: "#0e4429",
        SecondQuartile: "#006d32",
        ThirdQuartile: "#26a641",
        FourthQuartile: "#39d353",
    };

    return map[level || "None"] || map.None;
};

const contributionLevelLabel = (level?: string | null) => {
    if (!level) return "Sin actividad";

    const labels: Record<string, string> = {
        None: "Sin actividad",
        FirstQuartile: "Q1",
        SecondQuartile: "Q2",
        ThirdQuartile: "Q3",
        FourthQuartile: "Q4",
    };

    return labels[level] || level;
};

const contributionWeeks = computed(() => {
    const contributionMap = new Map<string, { level: string; commits: number }>();

    for (const item of profile.value.contributions ?? []) {
        if (!item.date) continue;

        const date = new Date(item.date);
        if (Number.isNaN(date.getTime())) continue;

        const iso = date.toISOString().slice(0, 10);
        contributionMap.set(iso, {
            level: item.contrib_level || "None",
            commits: Number(item.commits || 0),
        });
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    start.setHours(0, 0, 0, 0);

    const weeks: Array<Array<{ date: string; level: string; commits: number }>> = [];

    for (let week = 0; week < 53; week += 1) {
        const days: Array<{ date: string; level: string; commits: number }> = [];

        for (let day = 0; day < 7; day += 1) {
            const current = new Date(start);
            current.setDate(start.getDate() + (week * 7) + day);
            const iso = current.toISOString().slice(0, 10);
            const entry = contributionMap.get(iso) ?? { level: "None", commits: 0 };

            days.push({
                date: iso,
                level: entry.level,
                commits: entry.commits,
            });
        }

        weeks.push(days);
    }

    return weeks;
});

const getLanguageIcon = (lang) => {
    return languageIcons[lang] ?? null
}

const contributionMonths = computed(() => {
    const labels: Array<{ label: string; offset: number }> = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    start.setHours(0, 0, 0, 0);

    let previousMonth = -1;
    for (let week = 0; week < 53; week += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + (week * 7));

        const month = date.getMonth();
        if (month !== previousMonth) {
            labels.push({
                label: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date),
                offset: week,
            });
            previousMonth = month;
        }
    }

    return labels;
});

const formatContributionDate = (value?: string | null) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("es-ES", {
        month: "short",
        day: "numeric",
    }).format(date);
};

const repositoryName = (repository: Repository) =>
    repository.display_name ||
    repository.full_name?.split("/").pop() ||
    "repository";

const languages = computed(() =>
    [
        ...new Set(
            repositories.value
                .map((repository) => repository.primary_language)
                .filter((language): language is string => Boolean(language)),
        ),
    ].sort(),
);

const orderedRepositories = computed(() =>
    [...repositories.value].sort((a, b) => {
        const aIsPortfolio = repositoryName(a).toLowerCase() === "portfolio";
        const bIsPortfolio = repositoryName(b).toLowerCase() === "portfolio";

        if (aIsPortfolio !== bIsPortfolio) return aIsPortfolio ? -1 : 1;

        if (sorting.value === "star") {
            return (b.stars_count || 0) - (a.stars_count || 0);
        }

        if (sorting.value === "fork") {
            return (b.forks_count || 0) - (a.forks_count || 0);
        }

        const aDate = new Date(
            a.github_pushed_at || a.github_updated_at || a.synced_at || 0,
        ).getTime();
        const bDate = new Date(
            b.github_pushed_at || b.github_updated_at || b.synced_at || 0,
        ).getTime();
        return bDate - aDate;
    }),
);

const filteredRepositories = computed(() =>
    activeLanguage.value === "Todos"
        ? orderedRepositories.value
        : orderedRepositories.value.filter(
              (repository) =>
                  repository.primary_language === activeLanguage.value,
          ),
);

const countByLanguage = (language: string) =>
    repositories.value.filter(
        (repository) => repository.primary_language === language,
    ).length;

const handleRefresh = () => {
    void refresh();
    void refreshProfile();
};

useReveal();

useSeoMeta({
    title: "GitHub · Pablo Diez",
    description:
        "Repositorios públicos, tecnologías y colaboradores de los proyectos de Pablo Diez.",
    ogTitle: "GitHub · Pablo Diez",
    ogDescription:
        "Código público, arquitectura y experimentos sincronizados directamente desde GitHub.",
    ogType: "website",
});
</script>
