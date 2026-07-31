<template>
    <article
        class="group flex min-h-64 flex-col justify-between rounded-sm border border-line bg-surface p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-raised"
    >
        <div>
            <div class="flex items-center justify-between text-xs text-muted">
                <span class="flex items-center gap-2">
                    <GitBranch :size="16" />
                    {{ repository.owner }} / {{ repositoryName }}
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
                    class="rounded-sm border border-line bg-background px-2 py-1"
                >
                    {{ repository.visibility }}
                </span>
                <span
                    v-if="updatedLabel"
                    class="flex items-center gap-2 px-2 py-1"
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
                    :limit="5"
                />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ArrowUpRight, Clock3, GitBranch, Users } from "@lucide/vue";
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
