<template>
    <div class="bg-background">
        <div
            v-if="status === 'pending'"
            class="grid min-h-[75svh] place-items-center px-4 pt-24 text-xs text-muted"
            aria-live="polite"
        >
            <span class="flex items-center gap-2">
                <LoaderCircle :size="16" class="animate-spin" />
                Cargando caso de estudio
            </span>
        </div>

        <template v-else-if="project">
            <aside
                v-if="error"
                class="fixed right-3 bottom-3 z-40 flex max-w-sm flex-col gap-3 rounded-sm border border-signal/30 bg-surface/95 px-3 py-3 text-xs text-muted shadow-xl backdrop-blur sm:flex-row sm:items-center"
                role="status"
            >
                <span>Parte de los metadatos no está disponible.</span>
                <button
                    type="button"
                    class="shrink-0 cursor-pointer rounded-sm bg-ink px-2 py-1 font-medium text-background"
                    @click="refresh()"
                >
                    Reintentar
                </button>
            </aside>

            <section class="px-4 pt-28 pb-4 sm:px-6 sm:pt-36">
                <div class="mx-auto max-w-[92rem]">
                    <NuxtLink
                        class="inline-flex cursor-pointer items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
                        to="/projects"
                    >
                        <ArrowLeft :size="16" />
                        Archivo de proyectos
                    </NuxtLink>

                    <header
                        class="mt-9 grid gap-8 border-t border-line pt-5 lg:grid-cols-[1fr_28rem] lg:items-end"
                    >
                        <div>
                            <p
                                class="mb-7 flex items-center gap-2 text-xs text-signal"
                            >
                                <Layers3 :size="16" />
                                {{ project.project_type }} /
                                {{ statusLabel(project.status) }}
                            </p>
                            <h1
                                class="m-0 max-w-[14ch] font-display text-[clamp(5rem,11vw,11rem)] leading-[0.7] tracking-[-0.03em]"
                            >
                                {{ project.name }}
                            </h1>
                        </div>
                        <div class="lg:pb-2">
                            <p class="m-0 text-[15px] leading-7 text-muted">
                                {{ project.tagline || project.description }}
                            </p>
                            <div class="mt-6 flex flex-wrap gap-2">
                                <a
                                    v-if="project.live_url"
                                    :href="project.live_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                                >
                                    Ver online
                                    <ArrowUpRight :size="16" />
                                </a>
                                <a
                                    v-if="sourceUrl"
                                    :href="sourceUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                                >
                                    Ver repositorio
                                    <Code2 :size="16" />
                                </a>
                            </div>
                        </div>
                    </header>

                    <figure
                        class="mx-auto mt-10 max-w-6xl overflow-hidden rounded-sm border border-line bg-surface shadow-[0_30px_100px_rgba(0,0,0,.3)] sm:mt-14"
                    >
                        <div
                            class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
                        >
                            <span class="flex items-center gap-2">
                                <Box :size="16" />
                                Proyecto
                                {{ project.id.toString().padStart(3, "0") }}
                            </span>
                            <span class="hidden sm:block">
                                {{ dateRange(project) }}
                            </span>
                            <span class="flex items-center gap-2">
                                <i class="size-1.5 rounded-full bg-signal" />
                                {{ statusLabel(project.status) }}
                            </span>
                        </div>

                        <div
                            class="relative aspect-[16/9] overflow-hidden bg-background-secondary"
                        >
                            <img
                                v-if="hasHeroImage"
                                ref="heroImageElement"
                                :src="project.image || undefined"
                                :alt="`Vista general del proyecto ${project.name}`"
                                class="absolute inset-0 size-full rounded-[inherit] object-cover"
                                fetchpriority="high"
                                decoding="async"
                                @error="heroImageFailed = true"
                            />
                            <template v-else>
                                <div
                                    class="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:5rem_5rem]"
                                />
                                <div
                                    class="absolute top-1/2 left-1/2 aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                                    aria-hidden="true"
                                >
                                    <i
                                        class="absolute inset-[20%] rounded-full border border-white/10"
                                    />
                                    <i
                                        class="absolute inset-[43%] rounded-full bg-signal shadow-[0_0_80px_rgba(229,72,77,.2)]"
                                    />
                                </div>
                            </template>
                        </div>

                        <figcaption
                            class="flex flex-col gap-1 border-t border-line px-3 py-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span>{{ project.name }} / vista principal</span>
                            <span>{{ projectOwner(project) }}</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section class="px-4 py-20 sm:px-6 sm:py-28">
                <div
                    class="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[19rem_1fr] lg:gap-24"
                >
                    <aside
                        class="h-fit overflow-hidden rounded-sm border border-line bg-surface lg:sticky lg:top-24"
                        aria-label="Metadatos del proyecto"
                        data-reveal
                    >
                        <div
                            class="border-b border-line px-4 py-3 text-xs text-muted"
                        >
                            Metadatos del proyecto
                        </div>
                        <dl class="m-0">
                            <div class="border-b border-line px-4 py-3">
                                <dt
                                    class="mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Layers3 :size="16" />Estado
                                </dt>
                                <dd
                                    class="m-0 flex items-center gap-2 text-xs font-medium"
                                >
                                    <i
                                        class="size-1.5 rounded-full bg-signal"
                                    />
                                    {{ statusLabel(project.status) }} ·
                                    {{ project.project_type }}
                                </dd>
                            </div>

                            <div class="grid grid-cols-2 border-b border-line">
                                <div class="border-r border-line px-4 py-3">
                                    <dt
                                        class="mb-2 text-xs text-muted"
                                    >
                                        Inicio
                                    </dt>
                                    <dd class="m-0 text-xs font-medium">
                                        {{
                                            fullDateLabel(
                                                project.started_at ||
                                                    project.created_at,
                                            )
                                        }}
                                    </dd>
                                </div>
                                <div class="px-4 py-3">
                                    <dt
                                        class="mb-2 text-xs text-muted"
                                    >
                                        Finalización
                                    </dt>
                                    <dd class="m-0 text-xs font-medium">
                                        {{
                                            project.completed_at
                                                ? fullDateLabel(
                                                      project.completed_at,
                                                  )
                                                : "En curso"
                                        }}
                                    </dd>
                                </div>
                            </div>

                            <div
                                v-if="project.client"
                                class="border-b border-line px-4 py-3"
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
                                        class="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white/70"
                                    >
                                        {{ project.client.name }}
                                        <ArrowUpRight :size="16" />
                                    </a>
                                    <template v-else>
                                        {{ project.client.name }}
                                    </template>
                                </dd>
                            </div>

                            <template v-if="project.repository">
                                <div class="border-b border-line px-4 py-3">
                                    <dt
                                        class="mb-2 flex items-center gap-2 text-xs text-muted"
                                    >
                                        <Code2 :size="16" />Repositorio
                                    </dt>
                                    <dd class="m-0 text-xs font-medium">
                                        <a
                                            v-if="sourceUrl"
                                            :href="sourceUrl"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white/70"
                                        >
                                            {{ repositoryName }}
                                            <ArrowUpRight :size="16" />
                                        </a>
                                        <span v-else>{{ repositoryName }}</span>
                                    </dd>
                                </div>

                                <div
                                    v-if="project.repository.primary_language"
                                    class="border-b border-line px-4 py-3"
                                >
                                    <dt class="mb-2 text-xs text-muted">
                                        Lenguaje principal
                                    </dt>
                                    <dd class="m-0 text-xs font-medium">
                                        {{
                                            project.repository.primary_language
                                        }}
                                    </dd>
                                </div>

                                <div
                                    v-if="project.repository.github_created_at"
                                    class="grid grid-cols-2 border-b border-line"
                                >
                                    <div
                                        class="border-r border-line px-4 py-3"
                                    >
                                        <dt class="mb-2 text-xs text-muted">
                                            Repo creado
                                        </dt>
                                        <dd class="m-0 text-xs font-medium">
                                            {{
                                                fullDateLabel(
                                                    project.repository
                                                        .github_created_at,
                                                )
                                            }}
                                        </dd>
                                    </div>
                                    <div class="px-4 py-3">
                                        <dt class="mb-2 text-xs text-muted">
                                            Última actividad
                                        </dt>
                                        <dd class="m-0 text-xs font-medium">
                                            {{
                                                fullDateLabel(
                                                    project.repository
                                                        .github_pushed_at ||
                                                        project.repository
                                                            .github_updated_at,
                                                )
                                            }}
                                        </dd>
                                    </div>
                                </div>

                                <div
                                    v-if="
                                        project.repository.visibility ===
                                        'public'
                                    "
                                    class="grid grid-cols-3 border-b border-line"
                                >
                                    <div
                                        v-for="stat in repositoryStats"
                                        :key="stat.label"
                                        class="border-r border-line px-3 py-3 last:border-r-0"
                                    >
                                        <dt class="mb-2 text-[11px] text-muted">
                                            {{ stat.label }}
                                        </dt>
                                        <dd class="m-0 text-xs font-medium">
                                            {{ formatCount(stat.value) }}
                                        </dd>
                                    </div>
                                </div>
                            </template>

                            <div
                                v-if="project.repository?.contributors?.length"
                                class="px-4 py-3"
                            >
                                <dt
                                    class="mb-3 flex items-center gap-2 text-xs text-muted"
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

                    <article data-reveal>
                        <p
                            class="mb-5 flex items-center gap-2 text-xs text-signal"
                        >
                            <FileText :size="16" />Notas de proyecto
                        </p>
                        <h2
                            class="m-0 max-w-[26ch] font-sans text-[clamp(1.4rem,3vw,3.5rem)] leading-[0.80] tracking-[-0.015em]"
                        >
                            {{
                                project.tagline ||
                                "Diseñado para ser claro. Construido para evolucionar."
                            }}
                        </h2>
                        <!-- <p
                            class="mt-8 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-muted"
                        >
                            {{ project.description }}
                        </p> -->
                        <div class="project-notes-intro" aria-label="Formato de notas personales">
                            <span>cuaderno de trabajo</span>
                            <span>apuntes personales, sin guion cerrado</span>
                        </div>
                        <div
                            v-if="sanitizedContent"
                            class="project-rich-text mt-14 border-t border-line pt-10 sm:mt-18 sm:pt-14"
                            v-html="sanitizedContent"
                        />
                    </article>
                </div>
            </section>

            <section
                class="border-t border-line bg-background-secondary px-4 sm:px-6"
            >
                <NuxtLink
                    v-if="nextProject"
                    :to="`/projects/${nextProject.slug}`"
                    class="mx-auto grid max-w-[92rem] cursor-pointer gap-4 py-14 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:py-20"
                >
                    <span class="text-xs text-muted">Siguiente proyecto</span>
                    <strong
                        class="font-display text-[clamp(3.8rem,8vw,8rem)] leading-[0.72] font-normal tracking-[-0.03em]"
                    >
                        {{ nextProject.name }}
                    </strong>
                    <ArrowUpRight :size="20" class="text-signal" />
                </NuxtLink>
                <NuxtLink
                    v-else
                    to="/projects"
                    class="mx-auto grid max-w-[92rem] cursor-pointer gap-4 py-14 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:py-20"
                >
                    <span class="text-xs text-muted">Fin del archivo</span>
                    <strong
                        class="font-display text-[clamp(3.8rem,8vw,8rem)] leading-[0.72] font-normal tracking-[-0.03em]"
                    >
                        Ver todos
                    </strong>
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
                    class="mx-auto mt-5 mb-0 max-w-[10ch] font-display text-[clamp(4.5rem,10vw,9rem)] leading-[0.72] tracking-[-0.03em]"
                >
                    Este proyecto no está disponible.
                </h1>
                <p class="mx-auto mt-6 max-w-md text-sm leading-6 text-muted">
                    {{
                        error
                            ? "No se ha podido conectar con la fuente de proyectos."
                            : "Puede ser privado, no público o utilizar otra dirección."
                    }}
                </p>
                <div class="mt-6 flex justify-center gap-2">
                    <button
                        v-if="error"
                        type="button"
                        class="cursor-pointer rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background"
                        @click="refresh()"
                    >
                        Reintentar
                    </button>
                    <NuxtLink
                        to="/projects"
                        class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium"
                    >
                        Volver a proyectos
                        <ArrowLeft :size="16" />
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import {
    ArrowLeft,
    ArrowUpRight,
    Box,
    Building2,
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
const { completeProjectTransition } = useProjectImageTransition();
const heroImageElement = ref<HTMLImageElement | null>(null);
const heroImageFailed = ref(false);

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

const hasHeroImage = computed(
    () => Boolean(project.value?.image?.trim()) && !heroImageFailed.value,
);

const sourceUrl = computed(() =>
    project.value?.repository?.visibility === "public"
        ? project.value.repository.repository_url ||
          project.value.repository_url ||
          null
        : null,
);

const repositoryName = computed(
    () =>
        project.value?.repository?.full_name ||
        project.value?.repository?.display_name ||
        "Repositorio relacionado",
);

const repositoryStats = computed(() => [
    {
        label: "Stars",
        value: project.value?.repository?.stars_count ?? 0,
    },
    {
        label: "Forks",
        value: project.value?.repository?.forks_count ?? 0,
    },
    {
        label: "Issues",
        value: project.value?.repository?.open_issues_count ?? 0,
    },
]);

const sanitizedContent = computed(() => {
    if (!project.value?.content_html?.trim()) return "";

    return DOMPurify.sanitize(project.value.content_html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "form", "iframe", "object", "embed"],
        FORBID_ATTR: ["style"],
    });
});

watch(
    () => project.value?.image,
    () => {
        heroImageFailed.value = false;
    },
);

watch(
    [() => project.value?.slug, heroImageElement],
    ([slug, element]) => {
        if (!slug || !element) return;
        void completeProjectTransition(element, slug);
    },
    { flush: "post" },
);

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

const fullDateLabel = (value?: string | null) =>
    value
        ? new Intl.DateTimeFormat("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(new Date(value))
        : "Sin datos";

const dateRange = (item: PortfolioProject) => {
    const start = dateLabel(item.started_at || item.created_at);
    const end = item.completed_at ? dateLabel(item.completed_at) : "Ahora";
    return [start, end].filter(Boolean).join(" — ");
};

const projectOwner = (item: PortfolioProject) =>
    item.client?.name || "Proyecto independiente";

const formatCount = (value: number) =>
    new Intl.NumberFormat("es-ES", { notation: "compact" }).format(value);

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
    ogImage: () => project.value?.image || undefined,
});
</script>

<style scoped>
.project-rich-text {
    max-width: 54rem;
    color: var(--color-muted);
    font-size: 0.95rem;
    line-height: 1.85;
    overflow-wrap: anywhere;
}

.project-notes-intro {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-top: 2rem;
    color: var(--color-muted);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    line-height: 1.4;
    text-transform: uppercase;
}

.project-notes-intro span:first-child {
    color: var(--color-signal);
}

.project-rich-text :deep(h2),
.project-rich-text :deep(h3),
.project-rich-text :deep(h4) {
    margin: 2.5rem 0 1rem;
    color: var(--color-ink);
    letter-spacing: -0.025em;
}

.project-rich-text :deep(h2) {
    font-family: var(--font-display);
    font-size: clamp(3rem, 6vw, 5.5rem);
    font-weight: 400;
    line-height: 0.8;
}

.project-rich-text :deep(h3) {
    font-size: 1.45rem;
    font-weight: 500;
}

.project-rich-text :deep(p),
.project-rich-text :deep(ul),
.project-rich-text :deep(ol),
.project-rich-text :deep(blockquote),
.project-rich-text :deep(pre),
.project-rich-text :deep(table) {
    margin: 1.25rem 0;
}

.project-rich-text :deep(ul),
.project-rich-text :deep(ol) {
    list-style-type: disc;
    padding-left: 1.4rem;
}

.project-rich-text :deep(li + li) {
    margin-top: 0.45rem;
}

.project-rich-text :deep(strong) {
    color: var(--color-ink);
    font-weight: 500;
}

.project-rich-text :deep(a) {
    color: var(--color-ink);
    text-decoration: underline;
    text-decoration-color: var(--color-signal);
    text-underline-offset: 0.25em;
}

.project-rich-text :deep(blockquote) {
    border-left: 2px solid var(--color-signal);
    padding: 0.25rem 0 0.25rem 1.25rem;
    color: var(--color-ink);
    font-size: 1.1rem;
}

.project-rich-text :deep(code) {
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
    background: var(--color-surface);
    padding: 0.12rem 0.35rem;
    color: var(--color-ink);
    font-family: var(--font-mono);
    font-size: 0.85em;
}

.project-rich-text :deep(pre) {
    overflow-x: auto;
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
    background: var(--color-surface);
    padding: 1rem;
}

.project-rich-text :deep(pre code) {
    border: 0;
    background: transparent;
    padding: 0;
}

.project-rich-text :deep(img) {
    width: 100%;
    margin: 2rem 0;
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
}

.project-rich-text :deep(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
}

.project-rich-text :deep(th),
.project-rich-text :deep(td) {
    border: 1px solid var(--color-line);
    padding: 0.65rem 0.8rem;
    text-align: left;
}

@media (prefers-reduced-motion: reduce) {
    .project-rich-text :deep(*) {
        scroll-behavior: auto;
    }
}
</style>
