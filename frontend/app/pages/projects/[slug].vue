<template>
    <div class="bg-background">
        <div
            v-if="status === 'pending'"
            class="grid min-h-[75svh] place-items-center px-4 pt-24 text-xs text-muted"
            aria-live="polite"
        >
            <span class="flex items-center gap-2"
                ><LoaderCircle :size="16" class="animate-spin" />Cargando caso
                de estudio</span
            >
        </div>

        <template v-else-if="project">
            <aside
                v-if="error"
                class="fixed right-3 bottom-3 z-40 flex max-w-sm flex-col gap-3 rounded-sm border border-signal/30 bg-surface/95 px-3 py-3 text-xs text-muted shadow-xl backdrop-blur sm:flex-row sm:items-center"
                role="status"
            >
                <span
                    >Parte de los metadatos del proyecto no está
                    disponible.</span
                >
                <button
                    type="button"
                    class="shrink-0 rounded-sm bg-ink px-2 py-1 font-medium text-background"
                    @click="refresh()"
                >
                    Reintentar
                </button>
            </aside>

            <section class="px-3 pt-28 pb-3 sm:px-6 sm:pt-36" data-reveal>
                <div class="mx-auto max-w-[92rem]">
                    <NuxtLink
                        class="inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
                        to="/projects"
                    >
                        <ArrowLeft :size="16" />
                        Archivo de proyectos
                    </NuxtLink>

                    <div
                        class="mt-8 overflow-hidden rounded-sm border border-line bg-surface shadow-[0_30px_100px_rgba(0,0,0,.3)] sm:mt-10"
                    >
                        <div
                            class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
                        >
                            <span class="flex items-center gap-2"
                                ><Box :size="16" />Caso
                                {{
                                    project.id.toString().padStart(3, "0")
                                }}</span
                            >
                            <span class="hidden sm:block"
                                >{{ yearOf(project) }} /
                                {{ project.project_type }}</span
                            >
                            <span class="flex items-center gap-2"
                                ><i class="size-1.5 rounded-full bg-signal" />{{
                                    statusLabel(project.status)
                                }}</span
                            >
                        </div>

                        <div
                            class="relative grid min-h-[34rem] overflow-hidden p-5 sm:p-8 lg:min-h-[40rem] lg:grid-cols-[1.15fr_0.85fr] lg:p-10"
                        >
                            <div
                                class="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:5rem_5rem]"
                            />
                            <div
                                class="relative z-10 flex flex-col justify-between"
                            >
                                <p
                                    class="m-0 flex items-center gap-2 text-xs text-signal"
                                >
                                    <Layers3 :size="16" />Trabajo seleccionado /
                                    {{ project.project_type }}
                                </p>
                                <div class="my-14 lg:my-10">
                                    <h1
                                        class="m-0 max-w-[9ch] font-display text-[clamp(5rem,10vw,10rem)] leading-[0.7] tracking-[-0.03em]"
                                    >
                                        {{ project.name }}
                                    </h1>
                                    <p
                                        class="mt-7 max-w-xl text-sm leading-6 text-muted"
                                    >
                                        {{
                                            project.tagline ||
                                            project.description
                                        }}
                                    </p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <a
                                        v-if="project.live_url"
                                        :href="project.live_url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                                    >
                                        Ver online
                                        <ArrowUpRight :size="16" />
                                    </a>
                                    <a
                                        v-if="sourceUrl"
                                        :href="sourceUrl"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-2 rounded-sm border border-line bg-background-secondary px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                                    >
                                        Ver código
                                        <Code2 :size="16" />
                                    </a>
                                </div>
                            </div>

                            <div
                                class="pointer-events-none relative hidden items-center justify-center lg:flex"
                                aria-hidden="true"
                            >
                                <div
                                    class="relative aspect-square w-[72%] rounded-full border border-white/10"
                                >
                                    <i
                                        class="absolute inset-[16%] rounded-full border border-white/10"
                                    />
                                    <i
                                        class="absolute inset-[34%] rounded-full border border-white/10"
                                    />
                                    <i
                                        class="absolute inset-[45%] rounded-full bg-signal shadow-[0_0_80px_rgba(229,72,77,.2)]"
                                    />
                                    <span
                                        class="absolute -right-3 bottom-[20%] rounded-sm border border-line bg-surface-raised px-2 py-1 text-xs text-muted"
                                        >{{ shortTitle(project.name) }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="px-3 py-20 sm:px-6 sm:py-28">
                <div
                    class="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[17rem_1fr] lg:gap-24"
                >
                    <aside
                        class="h-fit rounded-sm border border-line bg-surface p-2 lg:sticky lg:top-24"
                        aria-label="Detalles del proyecto"
                        data-reveal
                    >
                        <div
                            class="border-b border-line px-2 py-2 text-xs text-muted"
                        >
                            Metadatos del proyecto
                        </div>
                        <dl class="m-0">
                            <div class="border-b border-line px-2 py-3">
                                <dt
                                    class="mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <CalendarDays :size="16" />Periodo
                                </dt>
                                <dd class="m-0 text-xs font-medium">
                                    {{ dateRange(project) }}
                                </dd>
                            </div>
                            <div
                                v-if="project.client"
                                class="border-b border-line px-2 py-3"
                            >
                                <dt
                                    class="mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Building2 :size="16" />Cliente
                                </dt>
                                <dd class="m-0 text-xs font-medium">
                                    <a
                                        v-if="project.client.website"
                                        :href="project.client.website"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-1.5 hover:text-white/70"
                                        >{{ project.client.name
                                        }}<ArrowUpRight :size="16"
                                    /></a>
                                    <template v-else>{{
                                        project.client.name
                                    }}</template>
                                </dd>
                            </div>
                            <div
                                v-if="project.repository?.primary_language"
                                class="border-b border-line px-2 py-3"
                            >
                                <dt
                                    class="mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Code2 :size="16" />Lenguaje principal
                                </dt>
                                <dd class="m-0 text-xs font-medium">
                                    {{ project.repository.primary_language }}
                                </dd>
                            </div>
                            <div
                                v-if="project.repository?.contributors?.length"
                                class="px-2 py-3"
                            >
                                <dt
                                    class="mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Users :size="16" />Colaboradores
                                </dt>
                                <dd class="m-0">
                                    <ContributorStack
                                        :contributors="
                                            project.repository.contributors
                                        "
                                        :limit="6"
                                    />
                                </dd>
                            </div>
                        </dl>
                    </aside>

                    <div data-reveal>
                        <p
                            class="mb-5 flex items-center gap-2 text-xs text-signal"
                        >
                            <FileText :size="16" />El proyecto
                        </p>
                        <h2
                            class="m-0 max-w-[15ch] font-display text-[clamp(4rem,8vw,8rem)] leading-[0.73] tracking-[-0.03em]"
                        >
                            {{
                                project.tagline ||
                                "Diseñado para ser claro. Construido para evolucionar."
                            }}
                        </h2>
                        <p
                            class="mt-8 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-muted"
                        >
                            {{ project.description }}
                        </p>

                        <div
                            class="mt-16 grid border-t border-l border-line sm:mt-20 sm:grid-cols-3"
                        >
                            <article
                                v-for="(principle, index) in principles"
                                :key="principle.title"
                                class="min-h-60 border-r border-b border-line p-4 sm:min-h-64"
                            >
                                <span
                                    class="grid size-7 place-items-center rounded-sm border border-line bg-surface text-xs text-muted"
                                    >{{ index + 1 }}</span
                                >
                                <div class="mt-16 sm:mt-20">
                                    <h3
                                        class="m-0 text-lg font-medium tracking-[-0.03em]"
                                    >
                                        {{ principle.title }}
                                    </h3>
                                    <p
                                        class="mt-3 mb-0 text-xs leading-5 text-muted"
                                    >
                                        {{ principle.copy }}
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="border-t border-line bg-background-secondary px-3 sm:px-6"
            >
                <NuxtLink
                    v-if="nextProject"
                    :to="`/projects/${nextProject.slug}`"
                    class="mx-auto grid max-w-[92rem] gap-4 py-14 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:py-20"
                >
                    <span class="text-xs text-muted">Siguiente proyecto</span>
                    <strong
                        class="font-display text-[clamp(3.8rem,8vw,8rem)] leading-[0.72] tracking-[-0.03em]"
                        >{{ nextProject.name }}</strong
                    >
                    <ArrowUpRight :size="20" class="text-signal" />
                </NuxtLink>
                <NuxtLink
                    v-else
                    to="/projects"
                    class="mx-auto grid max-w-[92rem] gap-4 py-14 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:py-20"
                >
                    <span class="text-xs text-muted">Fin del archivo</span>
                    <strong
                        class="font-display text-[clamp(3.8rem,8vw,8rem)] leading-[0.72] tracking-[-0.03em]"
                        >Ver todos</strong
                    >
                    <ArrowUpRight :size="20" class="text-signal" />
                </NuxtLink>
            </section>
        </template>

        <section
            v-else
            class="grid min-h-[80svh] place-items-center px-4 pt-24 text-center"
        >
            <div data-reveal>
                <CircleOff :size="20" class="mx-auto text-signal" />
                <p class="mt-4 text-xs text-muted">
                    404 / Proyecto no disponible
                </p>
                <h1
                    class="mx-auto mt-5 mb-0 max-w-[9ch] font-display text-[clamp(4.5rem,10vw,9rem)] leading-[0.72] tracking-[-0.03em]"
                >
                    Este caso de estudio no está aquí.
                </h1>
                <p class="mx-auto mt-6 max-w-md text-sm leading-6 text-muted">
                    {{
                        error
                            ? "No se ha podido conectar con la fuente de proyectos."
                            : "Puede ser privado, estar archivado o utilizar otra dirección."
                    }}
                </p>
                <div class="mt-6 flex justify-center gap-2">
                    <button
                        v-if="error"
                        type="button"
                        class="rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background"
                        @click="refresh()"
                    >
                        Reintentar
                    </button>
                    <NuxtLink
                        to="/projects"
                        class="inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium"
                        >Volver a proyectos<ArrowLeft :size="16"
                    /></NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowLeft,
    ArrowUpRight,
    Box,
    Building2,
    CalendarDays,
    CircleOff,
    Code2,
    FileText,
    Layers3,
    LoaderCircle,
    Users,
} from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const route = useRoute();
const { projects, status, error, refresh } = useProjects();

const project = computed(() =>
    projects.value.find((item) => item.slug === route.params.slug),
);

const nextProject = computed(() => {
    if (!project.value || projects.value.length < 2) return null;
    const index = projects.value.findIndex(
        (item) => item.id === project.value?.id,
    );
    return projects.value[(index + 1) % projects.value.length] || null;
});

const sourceUrl = computed(() =>
    project.value?.is_public &&
    project.value.repository?.visibility === "public"
        ? project.value.repository.repository_url ||
          project.value.repository_url ||
          null
        : null,
);

const yearOf = (item: PortfolioProject) =>
    new Date(
        item.completed_at || item.started_at || item.created_at,
    ).getFullYear();
const shortTitle = (name: string) => name.split(/\s+/).slice(0, 3).join(" ");

const statusLabel = (value: string) =>
    ({
        published: "Publicado",
        in_progress: "En curso",
        archived: "Archivado",
        draft: "Borrador",
    })[value] || value;

const dateLabel = (value?: string | null) =>
    value
        ? new Intl.DateTimeFormat("es-ES", {
              month: "short",
              year: "numeric",
          }).format(new Date(value))
        : null;

const dateRange = (item: PortfolioProject) =>
    [
        dateLabel(item.started_at || item.created_at),
        dateLabel(item.completed_at),
    ]
        .filter(Boolean)
        .join(" — ") || yearOf(item).toString();

const principles = [
    {
        title: "Fiable por diseño",
        copy: "Límites claros, fallos deliberados y una arquitectura comprensible mientras el proyecto crece.",
    },
    {
        title: "Humano en la superficie",
        copy: "Profundidad técnica convertida en una experiencia directa, con menos fricción y sin ruido decorativo.",
    },
    {
        title: "Preparado para cambiar",
        copy: "Decisiones orientadas al mantenimiento, la observabilidad y el siguiente requisito real.",
    },
];

useReveal();

useSeoMeta({
    title: () =>
        project.value
            ? `${project.value.name} · Pablo Diez`
            : "Proyecto · Pablo Diez",
    description: () =>
        project.value?.tagline ||
        project.value?.description ||
        "Caso de estudio de Pablo Diez.",
    ogTitle: () =>
        project.value
            ? `${project.value.name} · Pablo Diez`
            : "Proyecto · Pablo Diez",
    ogDescription: () =>
        project.value?.tagline ||
        project.value?.description ||
        "Caso de estudio de Pablo Diez.",
    ogType: "article",
});
</script>
