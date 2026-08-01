<template>
    <div class="bg-background px-4 pt-28 pb-24 sm:px-6 sm:pt-36 sm:pb-32">
        <header
            class="mx-auto grid max-w-[92rem] gap-10 border-b border-line pb-12 lg:grid-cols-[1fr_24rem] lg:items-end lg:pb-16"
            data-reveal
        >
            <div>
                <p class="mb-5 flex items-center gap-2 text-xs text-muted">
                    <GitFork :size="16" />
                    Código público /
                    {{ repositories.length.toString().padStart(2, "0") }}
                </p>
                <h1
                    class="m-0 max-w-[12ch] font-display text-[clamp(4.8rem,10vw,10rem)] leading-[0.72] tracking-[-0.03em]"
                >
                    El trabajo también vive en el código.
                </h1>
            </div>
            <div>
                <p class="m-0 max-w-md text-sm leading-6 text-muted">
                    Repositorios sincronizados con GitHub. Arquitectura, experimentos 
                    y producto con sus colaboradores y lenguajes reales.
                </p>
                <NuxtLink
                    to="/system#source-code"
                    class="mt-5 inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-white/70"
                >
                    Cómo funciona la sincronización
                    <Network :size="16" />
                </NuxtLink>
            </div>
        </header>

        <main class="mx-auto max-w-[92rem] pt-8 sm:pt-12">
            <div
                class="mb-10 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-center lg:justify-between"
                data-reveal
            >
                <div class="flex items-baseline gap-3">
                    <h2
                        id="repositories-title"
                        class="m-0 text-2xl font-medium tracking-[-0.04em]"
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

                <div class="flex gap-2">
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
                            <span class="ml-1 opacity-55">{{
                                repositories.length
                            }}</span>
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
                            <span class="ml-1 opacity-55">{{
                                countByLanguage(language)
                            }}</span>
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
                    @click="refresh()"
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
                class="grid gap-2 md:grid-cols-2"
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
        </main>
    </div>
</template>

<script setup lang="ts">
import { CircleOff, GitCommit, GitFork, Network, RefreshCw, Star } from "@lucide/vue";
import type { Repository } from "~/types/portfolio";

const { repositories, status, error, refresh } = useRepositories();
const activeLanguage = ref("Todos");
const sorting = ref("push");

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
