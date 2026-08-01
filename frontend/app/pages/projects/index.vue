<template>
    <div class="bg-background px-4 pt-28 pb-24 sm:px-6 sm:pt-36 sm:pb-32">
        <header
            class="mx-auto grid max-w-[92rem] gap-10 border-b border-line pb-12 lg:grid-cols-[1fr_24rem] lg:items-end lg:pb-16"
            data-reveal
        >
            <div>
                <p class="mb-5 flex items-center gap-2 text-xs text-muted">
                    <Archive :size="16" />
                    Archivo de proyectos /
                    {{ projects.length.toString().padStart(2, "0") }}
                </p>
                <h1
                    class="m-0 max-w-[10ch] font-display text-[clamp(4.8rem,10vw,10rem)] leading-[0.72] tracking-[-0.03em]"
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

        <section
            class="mx-auto max-w-[92rem] pt-8 sm:pt-12"
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
                        Todos los proyectos
                    </h2>
                    <span class="text-xs text-muted"
                        >{{
                            filteredProjects.length.toString().padStart(2, "0")
                        }}
                        visibles</span
                    >
                </div>
                <div
                    v-if="projectTypes.length > 1"
                    class="flex max-w-full gap-1 overflow-x-auto rounded-sm border border-line bg-surface p-1"
                    aria-label="Filtrar proyectos"
                >
                    <button
                        type="button"
                        class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                        :class="
                            activeFilter === 'Todos'
                                ? 'bg-ink text-background'
                                : 'text-muted hover:bg-surface-raised hover:text-ink'
                        "
                        @click="activeFilter = 'Todos'"
                    >
                        Todos
                        <span class="ml-1 opacity-55">{{
                            projects.length
                        }}</span>
                    </button>
                    <button
                        v-for="type in projectTypes"
                        :key="type"
                        type="button"
                        class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                        :class="
                            activeFilter === type
                                ? 'bg-ink text-background'
                                : 'text-muted hover:bg-surface-raised hover:text-ink'
                        "
                        @click="activeFilter = type"
                    >
                        {{ type }}
                        <span class="ml-1 opacity-55">{{
                            countByType(type)
                        }}</span>
                    </button>
                </div>
            </div>

            <div
                v-if="error && projects.length"
                class="mb-6 flex flex-col gap-3 rounded-sm border border-signal/30 bg-surface px-3 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
                role="status"
            >
                <span>
                    Parte de la información relacionada no está disponible ahora
                    mismo.
                </span>
                <button
                    type="button"
                    class="rounded-sm bg-ink px-3 py-2 font-medium text-background"
                    @click="refresh()"
                >
                    Reintentar
                </button>
            </div>

            <div
                v-if="status === 'pending'"
                class="grid gap-6 lg:grid-cols-2"
                aria-live="polite"
            >
                <div
                    v-for="n in 4"
                    :key="n"
                    class="aspect-[1.28/1] animate-pulse rounded-sm bg-surface"
                >
                    <span class="sr-only">Cargando proyecto</span>
                </div>
            </div>
            <div
                v-else-if="filteredProjects.length"
                class="grid gap-x-6 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-24"
            >
                <ProjectCard
                    v-for="(project, index) in filteredProjects"
                    :key="project.id"
                    :project="project"
                    :index="index + 1"
                    :class="index % 2 ? 'lg:translate-y-12' : ''"
                />
            </div>
            <div
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
                                : "No hay proyectos públicos para este filtro."
                        }}
                    </p>
                    <button
                        v-if="error"
                        type="button"
                        class="mt-5 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background"
                        @click="refresh()"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Archive, CircleOff, Network } from "@lucide/vue";

const { projects, status, error, refresh } = useProjects();
const activeFilter = ref("Todos");

const projectTypes = computed(() =>
    [...new Set(projects.value.map((project) => project.project_type))].sort(),
);

const filteredProjects = computed(() =>
    activeFilter.value === "Todos"
        ? projects.value
        : projects.value.filter(
              (project) => project.project_type === activeFilter.value,
          ),
);

const countByType = (type: string) =>
    projects.value.filter((project) => project.project_type === type).length;

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
