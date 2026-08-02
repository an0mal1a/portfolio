<template>
    <article
        class="group min-w-0"
        data-project-transition-scope
        data-reveal
    >
        <NuxtLink
            :to="`/projects/${project.slug}`"
            :aria-label="`Ver proyecto ${project.name}`"
            class="relative block cursor-pointer overflow-hidden rounded-sm border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.24)] transition-transform duration-300 hover:-translate-y-1"
            :class="compact ? 'aspect-[4/3]' : 'aspect-[1.28/1]'"
            @click="handleProjectOpen"
        >
            <div
                class="relative z-10 flex h-9 items-center justify-between border-b border-line bg-surface/90 px-3 text-xs text-muted backdrop-blur-sm"
            >
                <span class="flex items-center gap-2"
                    ><Box :size="16" />{{ index.toString().padStart(2, "0") }} /
                    {{ project.project_type }}</span
                >
                <span class="flex items-center gap-2"
                    ><i class="size-1.5 rounded-full bg-signal" />{{
                        statusLabel(project.status)
                    }}</span
                >
            </div>
            <img
                v-if="hasProjectImage"
                data-project-cover
                :src="project.image || undefined"
                :alt="`Vista previa del proyecto ${project.name}`"
                class="absolute inset-x-0 top-9 h-[calc(100%-2.25rem)] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                loading="lazy"
                decoding="async"
                @error="imageFailed = true"
            />
            <div
                v-if="hasProjectImage"
                class="absolute inset-x-0 top-9 bottom-0 bg-gradient-to-t from-background via-background/15 to-transparent"
                aria-hidden="true"
            />
            <template v-else>
                <RepositoryFallbackCover
                    :name="project.name"
                    :display-name="project.repository?.display_name"
                    :language="project.repository?.primary_language"
                    :project-type="project.project_type"
                    :archived="project.status === 'archived' || Boolean(project.repository?.is_archived)"
                />
            </template>
            <p
                v-if="hasProjectImage"
                class="absolute bottom-4 left-4 z-10 max-w-[82%] font-display leading-[0.72] font-semibold"
                :class="
                    compact
                        ? 'text-[clamp(2.8rem,4.2vw,4.8rem)]'
                        : 'text-[clamp(3rem,6vw,6.5rem)]'
                "
            >
                {{ project.name }}
            </p>
            <span
                class="absolute right-4 bottom-4 z-10 grid size-8 place-items-center rounded-sm border border-line bg-background/60 text-muted transition-colors group-hover:text-ink"
                ><ArrowUpRight :size="16"
            /></span>
        </NuxtLink>

        <div class="pt-4">
            <div class="flex items-center gap-2 text-xs text-muted">
                <span>{{ yearOf(project) }}</span>
                <span class="size-1 rounded-full bg-line-strong" />
                <span v-if="project.is_featured" class="text-signal"
                    >Destacado</span
                >
                <span v-if="project.repository?.primary_language">{{
                    project.repository.primary_language
                }}</span>
            </div>
            <NuxtLink
                :to="`/projects/${project.slug}`"
                class="cursor-pointer"
                @click="handleProjectOpen"
            >
                <h3
                    class="mt-2 mb-1.5 text-2xl font-medium tracking-[-0.04em] transition-colors group-hover:text-white/70"
                >
                    {{ project.name }}
                </h3>
            </NuxtLink>
            <p
                class="m-0 max-w-xl text-sm leading-6 text-muted"
                :class="compact ? 'line-clamp-3' : ''"
            >
                {{ project.tagline || project.description }}
            </p>
            <div
                class="mt-4 flex min-h-10 items-center justify-between border-t border-line pt-3"
            >
                <span class="text-xs text-muted">{{
                    project.client
                        ? `Para ${project.client.name}`
                        : "Proyecto independiente"
                }}</span>
                <ContributorStack
                    v-if="project.repository?.contributors?.length"
                    :contributors="project.repository.contributors"
                />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ArrowUpRight, Box } from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const props = withDefaults(
    defineProps<{
        project: PortfolioProject;
        index: number;
        compact?: boolean;
    }>(),
    {
        compact: false,
    },
);

const { openProject } = useProjectImageTransition();
const handleProjectOpen = (event: MouseEvent) => {
    void openProject(event, props.project);
};

const imageFailed = ref(false);
const hasProjectImage = computed(
    () => Boolean(props.project.image?.trim()) && !imageFailed.value,
);

watch(
    () => props.project.image,
    () => {
        imageFailed.value = false;
    },
);

const yearOf = (project: PortfolioProject) =>
    new Date(
        project.completed_at || project.started_at || project.created_at,
    ).getFullYear();

const statusLabel = (status: string) =>
    ({
        published: "Publicado",
        in_progress: "En curso",
        archived: "Archivado",
        draft: "Borrador",
    })[status] || status;
</script>
