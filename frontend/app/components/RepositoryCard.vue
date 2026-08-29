<template>
    <article
        class="group flex min-h-64 flex-col justify-between rounded-sm border p-3 transition-all duration-300 hover:-translate-y-0.5 border-line bg-surface hover:border-line-strong hover:bg-surface-raised" 
    >
        <div>
            <div class="flex items-center justify-between text-xs text-muted">
                <span class="flex items-center gap-2">
                    <GitFork v-if="repository.is_fork" :size="16" />
                    <GitBranch v-else :size="16" />
                    {{ repository.owner }} / {{ repositoryName }}
                    <Lock v-if="repository.visibility === 'private' || false" :size="12" />
                    
                    <span
                        v-if="isPortfolioRepository"
                        class="inline-flex items-center gap-1 rounded-sm border border-signal/50 bg-signal/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink"
                    >
                        <BadgeCheck :size="12" aria-hidden="true" />
                        Este portfolio
                    </span>
                </span>
                    
                <a
                    v-if="repository.repository_url"
                    :href="repository.repository_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="grid size-7 place-items-center rounded-sm border border-line transition-all duration-300 group-hover:border-line-strong group-hover:text-ink"
                    :aria-label="`Abrir ${repositoryName} en GitHub`"
                >
                    <ArrowUpRight :size="16" />
                </a>
            </div>

            <h3 class="mt-10 mb-0 text-2xl font-medium tracking-[-0.04em]">
                {{ repositoryName }}
            </h3>
            <p class="mt-3 mb-0 max-w-lg text-xs leading-5 text-muted">
                {{
                    repository.description ||
                    "Repositorio público sin descripción."
                }}
            </p>
        </div>

        <div>
            <div
                class="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted"
            >
                <span
                    v-if="repository.primary_language"
                    class="flex items-center gap-2 rounded-sm border border-line bg-background px-2 py-1"
                >
                    <i class="size-1.5 rounded-full bg-signal" />
                    {{ repository.primary_language }}
                </span>
                <span
                    v-if="repository.is_fork"
                    class="flex gap-1.5 items-center rounded-sm border border-line bg-background px-2 py-1"
                >
                    <GitFork :size="12" />
                    fork
                </span>
                <span
                    v-if="repository.stars_count"
                    class="flex items-center gap-2 px-1 py-1"
                >
                    <Star :size="16" />
                    {{ repository.stars_count }}
                </span>
                <span
                    v-if="repository.forks_count"
                    class="flex items-center gap-2 px-1 py-1"
                >
                    <GitFork :size="16" />
                    {{ repository.forks_count }}
                </span>
                <span
                    v-if="updatedLabel"
                    class="flex items-center gap-2 px-1 py-1"
                >
                    <Clock3 :size="16" />
                    {{ updatedLabel }}
                </span>
            </div>

            <div
                class="flex min-h-9 items-center justify-between border-t border-line pt-3"
            >
                <span class="flex items-center gap-2 text-xs text-muted">
                    <Users :size="16" />
                    {{ contributorLabel }}
                </span>
                <ContributorStack
                    v-if="repository.contributors?.length"
                    :contributors="repository.contributors"
                    :owner="repository.owner"
                    :limit="5"
                />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ArrowUpRight, BadgeCheck, Clock3, GitBranch, GitFork, Lock, Star, Users } from "@lucide/vue";
import type { Repository } from "~/types/portfolio";

const props = defineProps<{
    repository: Repository;
}>();

const repositoryName = computed(
    () =>
        props.repository.display_name ||
        props.repository.full_name?.split("/").pop() ||
        "repository",
);

const isPortfolioRepository = computed(
    () => repositoryName.value.trim().toLowerCase() === "portfolio",
);

const contributorLabel = computed(() => {
    const total = props.repository.contributors?.length || 0;
    return total === 1 ? "1 colaborador" : `${total} colaboradores`;
});

const updatedLabel = computed(() => {
    const value =
        props.repository.github_pushed_at ||
        props.repository.github_updated_at ||
        props.repository.synced_at;

    if (!value) return null;

    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
});
</script>
