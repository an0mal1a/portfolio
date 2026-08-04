<template>
    <div class="bg-background px-4 pt-28 pb-24 sm:px-6 sm:pt-36 sm:pb-32">
        <header
            class="mx-auto grid max-w-[92rem] gap-10 border-b border-line pb-12 lg:grid-cols-[1fr_24rem] lg:items-end lg:pb-16"
            data-reveal
        >
            <div>
                <p class="mb-6 flex items-center gap-2 text-xs text-muted">
                    <Archive :size="16" />
                    Archivo de proyectos /
                    {{ projects.length.toString().padStart(2, "0") }}
                </p>
                <h1
                    class="m-0 font-display text-[clamp(4.8rem,10vw,10rem)] leading-[0.72] tracking-[-0.03em]"
                >
                    Trabajo real, sin teatro.
                </h1>
            </div>
            <div>
                <p class="m-0 max-w-md text-sm leading-6 text-muted">
                    Productos, infraestructura y experimentos contados desde las
                    decisiones, los sistemas y las personas que hay detrás.
                </p>
                <NuxtLink
                    to="/system"
                    class="mt-5 inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-white/70"
                >
                    Cómo funciona este portfolio
                    <Network :size="16" />
                </NuxtLink>
            </div>
        </header>

        <div class="mx-auto max-w-[92rem] pt-8 sm:pt-12">
            <div
                v-if="error && projects.length"
                class="mb-8 flex flex-col gap-3 rounded-sm border border-signal/30 bg-surface px-3 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
                role="status"
            >
                <span>
                    Parte de la información relacionada no está disponible ahora
                    mismo.
                </span>
                <button
                    type="button"
                    class="cursor-pointer rounded-sm bg-ink px-3 py-2 font-medium text-background"
                    @click="refresh()"
                >
                    Reintentar
                </button>
            </div>

            <div
                v-if="status === 'pending'"
                class="space-y-20"
                aria-live="polite"
            >
                <span class="sr-only">Cargando proyectos</span>
                <div class="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
                    <div
                        class="min-h-[26rem] animate-pulse rounded-sm bg-surface sm:min-h-[32rem]"
                    />
                    <div
                        class="min-h-[26rem] animate-pulse rounded-sm bg-surface sm:min-h-[32rem]"
                    />
                </div>
                <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <div
                        v-for="n in 3"
                        :key="n"
                        class="aspect-[4/3] animate-pulse rounded-sm bg-surface"
                    />
                </div>
            </div>

            <template v-else-if="featuredProject">
                <section aria-labelledby="featured-title" data-reveal>
                    <article
                        class="grid overflow-hidden rounded-sm border border-line bg-surface shadow-[0_28px_90px_rgba(0,0,0,.24)] lg:grid-cols-[1.16fr_0.84fr]"
                        data-project-transition-scope
                    >
                        <NuxtLink
                            :to="`/projects/${featuredProject.slug}`"
                            :aria-label="`Ver proyecto destacado ${featuredProject.name}`"
                            class="group/preview relative block min-h-[25rem] cursor-pointer overflow-hidden border-b border-line bg-background-secondary sm:min-h-[32rem] lg:min-h-[36rem] lg:border-r lg:border-b-0"
                            @click="handleFeaturedProjectOpen"
                        >
                            <img
                                v-if="hasFeaturedImage"
                                data-project-cover
                                :src="featuredProject.image || undefined"
                                :alt="`Vista previa del proyecto ${featuredProject.name}`"
                                class="absolute inset-0 size-full object-contain transition-transform duration-700 group-hover/preview:scale-[1.02]"
                                fetchpriority="high"
                                @error="featuredImageFailed = true"
                            />
                            <div
                                v-else
                                class="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:4.5rem_4.5rem]"
                            />
                            <div
                                v-if="hasFeaturedImage"
                                class="absolute inset-0 bg-background/20"
                                aria-hidden="true"
                            />
                            <div
                                class="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between border-b border-line bg-background/75 px-3 text-xs text-muted backdrop-blur-sm"
                            >
                                <span class="flex items-center gap-2">
                                    <i class="size-1.5 rounded-full bg-signal" />
                                    {{ liveHost(featuredProject) }}
                                </span>
                                <span>{{ featuredProject.project_type }}</span>
                            </div>

                            <div
                                class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/85 to-transparent px-5 pt-24 pb-5 sm:px-7 sm:pb-7"
                            >
                                <p
                                    class="mb-3 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Box :size="16" />
                                    {{
                                        featuredProject.id
                                            .toString()
                                            .padStart(3, "0")
                                    }}
                                    / {{ statusLabel(featuredProject.status) }}
                                </p>
                                <strong
                                    class="block max-w-[9ch] font-display text-[clamp(4.2rem,8vw,8rem)] leading-[0.72] font-normal tracking-[-0.03em]"
                                >
                                    {{ featuredProject.name }}
                                </strong>
                                <span
                                    class="absolute right-5 bottom-5 grid size-9 place-items-center rounded-sm border border-line bg-surface/80 text-muted transition-colors group-hover/preview:text-ink sm:right-7 sm:bottom-7"
                                >
                                    <ArrowUpRight :size="17" />
                                </span>
                            </div>
                        </NuxtLink>

                        <div class="flex flex-col p-5 sm:p-7 lg:p-8">
                            <div class="flex items-start justify-between gap-5">
                                <p
                                    class="m-0 flex items-center gap-2 text-xs text-signal"
                                >
                                    <Sparkles :size="16" />
                                    Destacado
                                </p>
                                <span
                                    class="rounded-sm border border-line px-2 py-1 text-xs text-muted"
                                >
                                    {{ yearOf(featuredProject) }}
                                </span>
                            </div>

                            <div class="my-10 lg:my-auto">
                                <p
                                    class="mb-4 text-xs font-medium tracking-[0.12em] text-muted uppercase"
                                >
                                    {{ projectOwner(featuredProject) }} ·
                                    {{ featuredProject.project_type }}
                                </p>
                                <h2
                                    id="featured-title"
                                    class="m-0 max-w-[10ch] font-display text-[clamp(4.1rem,7vw,7.5rem)] leading-[0.72] tracking-[-0.03em]"
                                >
                                    {{ featuredProject.name }}
                                </h2>
                                <p
                                    class="mt-6 mb-0 max-w-xl text-[15px] leading-7 text-ink"
                                >
                                    {{
                                        featuredProject.tagline ||
                                        featuredProject.description
                                    }}
                                </p>
                                <p
                                    v-if="
                                        featuredProject.tagline &&
                                        featuredProject.description !==
                                            featuredProject.tagline
                                    "
                                    class="mt-4 mb-0 max-w-xl text-sm leading-6 text-muted"
                                >
                                    {{ featuredProject.description }}
                                </p>
                            </div>

                            <div
                                class="flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div class="flex flex-wrap gap-2 text-xs">
                                    <span
                                        v-if="
                                            featuredProject.repository
                                                ?.primary_language
                                        "
                                        class="rounded-sm border border-line px-2 py-1 text-muted"
                                    >
                                        {{
                                            featuredProject.repository
                                                .primary_language
                                        }}
                                    </span>
                                    <span
                                        class="rounded-sm border border-line px-2 py-1 text-muted"
                                    >
                                        {{ statusLabel(featuredProject.status) }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-4 text-xs">
                                    <a
                                        v-if="featuredProject.live_url"
                                        :href="featuredProject.live_url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex cursor-pointer items-center gap-2 text-muted transition-colors hover:text-ink"
                                    >
                                        Ver online
                                        <ExternalLink :size="15" />
                                    </a>
                                    <NuxtLink
                                        :to="`/projects/${featuredProject.slug}`"
                                        class="inline-flex cursor-pointer items-center gap-2 font-medium transition-colors hover:text-white/70"
                                        @click="handleFeaturedProjectOpen"
                                    >
                                        Ver proyecto
                                        <ArrowUpRight :size="16" />
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <section
                    class="mt-20 border-t border-line pt-8 sm:mt-28 sm:pt-10"
                    aria-labelledby="archive-title"
                >
                    <div
                        class="mb-10 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-center lg:justify-between"
                        data-reveal
                    >
                        <div class="flex items-baseline gap-3">
                            <h2
                                id="archive-title"
                                class="m-0 text-2xl font-medium tracking-[-0.04em]"
                            >
                                Más proyectos
                            </h2>
                            <span class="text-xs text-muted">
                                {{
                                    filteredProjects.length
                                        .toString()
                                        .padStart(2, "0")
                                }}
                                visibles
                            </span>
                        </div>
                        <div
                            v-if="projectTypes.length > 1"
                            class="flex max-w-full gap-1 overflow-x-auto rounded-sm border border-line bg-surface p-1"
                            aria-label="Filtrar proyectos"
                        >
                            <button
                                type="button"
                                class="shrink-0 cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors"
                                :class="
                                    activeFilter === 'Todos'
                                        ? 'bg-ink text-background'
                                        : 'text-muted hover:bg-surface-raised hover:text-ink'
                                "
                                @click="activeFilter = 'Todos'"
                            >
                                Todos
                                <span class="ml-1 opacity-55">
                                    {{ archiveProjects.length }}
                                </span>
                            </button>
                            <button
                                v-for="type in projectTypes"
                                :key="type"
                                type="button"
                                class="shrink-0 cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors"
                                :class="
                                    activeFilter === type
                                        ? 'bg-ink text-background'
                                        : 'text-muted hover:bg-surface-raised hover:text-ink'
                                "
                                @click="activeFilter = type"
                            >
                                {{ type }}
                                <span class="ml-1 opacity-55">
                                    {{ countByType(type) }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="filteredProjects.length"
                        class="grid gap-x-5 gap-y-14 md:grid-cols-2 xl:grid-cols-3 xl:gap-y-20"
                    >
                        <ProjectCard
                            v-for="(project, index) in filteredProjects"
                            :key="project.id"
                            :project="project"
                            :index="index + 2"
                            compact
                        />
                    </div>
                    <div
                        v-else
                        class="grid min-h-64 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
                        data-reveal
                    >
                        <div>
                            <CircleOff :size="20" class="mx-auto text-signal" />
                            <p
                                class="mx-auto mt-4 mb-0 max-w-md text-sm leading-6 text-muted"
                            >
                                No hay más proyectos públicos para este filtro.
                            </p>
                            <button
                                v-if="activeFilter !== 'Todos'"
                                type="button"
                                class="mt-5 cursor-pointer rounded-sm border border-line px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                                @click="activeFilter = 'Todos'"
                            >
                                Ver todos
                            </button>
                        </div>
                    </div>
                </section>
            </template>

            <section
                v-else
                class="grid min-h-72 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
                data-reveal
            >
                <div>
                    <CircleOff :size="20" class="mx-auto text-signal" />
                    <p
                        class="mx-auto mt-4 mb-0 max-w-md text-sm leading-6 text-muted"
                    >
                        {{
                            error
                                ? "La fuente de proyectos no está disponible temporalmente."
                                : "El archivo público de proyectos se está preparando."
                        }}
                    </p>
                    <button
                        v-if="error"
                        type="button"
                        class="mt-5 cursor-pointer rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background"
                        @click="refresh()"
                    >
                        Reintentar
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Archive,
    ArrowUpRight,
    Box,
    CircleOff,
    ExternalLink,
    Network,
    Sparkles,
} from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const { projects, status, error, refresh } = useProjects();
const { openProject } = useProjectImageTransition();
const activeFilter = ref("Todos");
const featuredImageFailed = ref(false);

const featuredProject = computed(
    () =>
        projects.value.find((project) => project.is_featured) ||
        projects.value[0] ||
        null,
);

const hasFeaturedImage = computed(
    () =>
        Boolean(featuredProject.value?.image?.trim()) &&
        !featuredImageFailed.value,
);

watch(
    () => featuredProject.value?.image,
    () => {
        featuredImageFailed.value = false;
    },
);

const archiveProjects = computed(() =>
    projects.value.filter(
        (project) => project.id !== featuredProject.value?.id,
    ),
);

const projectTypes = computed(() =>
    [
        ...new Set(
            archiveProjects.value.map((project) => project.project_type),
        ),
    ].sort(),
);

const filteredProjects = computed(() =>
    activeFilter.value === "Todos"
        ? archiveProjects.value
        : archiveProjects.value.filter(
              (project) => project.project_type === activeFilter.value,
          ),
);

const countByType = (type: string) =>
    archiveProjects.value.filter((project) => project.project_type === type)
        .length;

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

const projectOwner = (project: PortfolioProject) =>
    project.client?.name || "Proyecto independiente";

const liveHost = (project: PortfolioProject) => {
    if (!project.live_url) return project.slug;

    try {
        return new URL(project.live_url).hostname.replace(/^www\./, "");
    } catch {
        return project.slug;
    }
};

const handleFeaturedProjectOpen = (event: MouseEvent) => {
    if (!featuredProject.value) return;
    void openProject(event, featuredProject.value);
};

useReveal();

useSeoMeta({
    title: "Proyectos · Pablo Diez",
    description:
        "Proyectos seleccionados de backend, APIs, infraestructura y producto digital de Pablo Diez.",
    ogTitle: "Proyectos · Pablo Diez",
    ogDescription:
        "Un archivo conectado de productos digitales, infraestructura y experimentos.",
    ogType: "website",
});
</script>
