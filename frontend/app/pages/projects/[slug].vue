<template>
    <div class="bg-background">
        <div
            v-if="status === 'pending' && !project"
            class="grid min-h-[75svh] place-items-center px-4 pt-24 text-xs text-muted"
            aria-live="polite"
        >
            <span class="flex items-center gap-2">
                <LoaderCircle :size="16" class="animate-spin" />
                Cargando caso de estudio
            </span>
        </div>

        <template v-else-if="project">
            <div
                class="pointer-events-none fixed inset-x-0 top-14 z-40 h-px origin-left bg-signal"
                :style="{ transform: `scaleX(${readingProgress})` }"
                aria-hidden="true"
            />

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

            <section class="px-4 pt-28 sm:px-6 sm:pt-36">
                <div class="mx-auto max-w-[92rem]">
                    <nav
                        class="flex items-center gap-2 text-xs text-muted"
                        aria-label="Ruta de navegación"
                    >
                        <NuxtLink
                            to="/projects"
                            class="inline-flex items-center gap-2 transition-colors hover:text-ink"
                        >
                            <ArrowLeft :size="15" />
                            Proyectos
                        </NuxtLink>
                        <span aria-hidden="true">/</span>
                        <span class="truncate text-ink" aria-current="page">{{
                            project.name
                        }}</span>
                    </nav>

                    <header
                        class="mt-8 grid gap-8 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:gap-16"
                    >
                        <div>
                            <p
                                class="mb-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted"
                            >
                                <span class="text-signal">{{
                                    projectTypeLabel(project.project_type)
                                }}</span>
                                <span aria-hidden="true">·</span>
                                <span class="inline-flex items-center gap-2">
                                    <i
                                        class="size-1.5 rounded-full"
                                        :class="projectStatusTone(project.status)"
                                    />
                                    {{ projectStatusLabel(project.status) }}
                                </span>
                                <template v-if="project.is_featured">
                                    <span aria-hidden="true">·</span>
                                    <span>Destacado</span>
                                </template>
                            </p>
                            <h1
                                class="m-0 max-w-[14ch] font-display text-[clamp(5rem,11vw,11rem)] leading-[0.7] tracking-[-0.03em] text-balance"
                            >
                                {{ project.name }}
                            </h1>
                        </div>
                        <div class="lg:pb-2">
                            <p class="m-0 text-[1.05rem] leading-7 text-ink">
                                {{ project.tagline || project.description }}
                            </p>
                            <div class="mt-6 flex flex-wrap gap-2">
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
                                    class="inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                                >
                                    Ver repositorio
                                    <Code2 :size="16" />
                                </a>
                                <NuxtLink
                                    to="/#contact"
                                    class="inline-flex items-center gap-2 rounded-sm border border-line px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
                                >
                                    Quiero algo parecido
                                    <MessageSquare :size="15" />
                                </NuxtLink>
                            </div>
                        </div>
                    </header>

                    <dl
                        class="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line lg:grid-cols-5"
                    >
                        <div
                            v-for="fact in facts"
                            :key="fact.label"
                            class="min-w-0 bg-background-secondary px-4 py-3.5 last:col-span-2 lg:last:col-span-1"
                        >
                            <dt
                                class="mb-1.5 flex items-center gap-2 text-[11px] text-muted"
                            >
                                <component :is="fact.icon" :size="14" />
                                {{ fact.label }}
                            </dt>
                            <dd class="m-0 truncate text-sm font-medium">
                                <a
                                    v-if="fact.href"
                                    :href="fact.href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="link-underline"
                                    >{{ fact.value }}</a
                                >
                                <template v-else>{{ fact.value }}</template>
                            </dd>
                        </div>
                    </dl>

                    <figure
                        class="relative m-0 mt-3 aspect-[16/10] overflow-hidden rounded-sm border border-line bg-surface shadow-[0_30px_100px_rgba(0,0,0,.3)] sm:aspect-[16/9]"
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
                        <RepositoryFallbackCover
                            v-else
                            :name="project.name"
                            :display-name="project.repository?.display_name"
                            :language="project.repository?.primary_language"
                            :project-type="project.project_type"
                            :archived="
                                project.status === 'archived' ||
                                Boolean(project.repository?.is_archived)
                            "
                        />
                    </figure>
                </div>
            </section>

            <section class="px-4 py-16 sm:px-6 sm:py-24">
                <div
                    class="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[minmax(0,46rem)_17rem] lg:justify-between lg:gap-16 xl:pl-[8%]"
                >
<<<<<<< Updated upstream
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
                                        :owner="project.repository.owner"
                                        :limit="6"
                                    />
                                </dd>
                            </div>
                        </dl>
                    </aside>

                    <article data-reveal>
=======
                    <article ref="articleElement" class="min-w-0">
>>>>>>> Stashed changes
                        <p
                            class="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] tracking-[0.08em] text-muted uppercase"
                        >
                            <span class="text-signal">Notas de proyecto</span>
                            <span aria-hidden="true">/</span>
                            <span>{{ article.minutes }} min de lectura</span>
                        </p>

                        <p
                            v-for="(paragraph, index) in descriptionParagraphs"
                            :key="index"
                            :class="
                                index === 0
                                    ? 'm-0 text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.45] font-medium tracking-[-0.025em] text-ink'
                                    : 'mt-5 mb-0 text-[1.0625rem] leading-[1.8] text-[#a3a3ab]'
                            "
                        >
                            {{ paragraph }}
                        </p>

                        <div
                            v-if="article.content"
                            class="project-prose mt-12 border-t border-line pt-4"
                            v-html="article.content"
                        />
                    </article>

                    <aside
                        class="space-y-3 lg:sticky lg:top-24 lg:self-start"
                        aria-label="Detalles del proyecto"
                    >
                        <nav
                            v-if="article.headings.length > 1"
                            class="hidden rounded-sm border border-line bg-surface p-4 lg:block"
                            aria-label="En esta página"
                        >
                            <p class="mt-0 mb-3 text-xs text-muted">
                                En esta página
                            </p>
                            <ol class="m-0 list-none space-y-0.5 p-0">
                                <li
                                    v-for="heading in article.headings"
                                    :key="heading.id"
                                >
                                    <a
                                        :href="`#${heading.id}`"
                                        class="block border-l py-1 pl-3 text-xs leading-5 transition-colors"
                                        :class="
                                            activeHeading === heading.id
                                                ? 'border-signal text-ink'
                                                : 'border-line text-muted hover:text-ink'
                                        "
                                        >{{ heading.text }}</a
                                    >
                                </li>
                            </ol>
                        </nav>

                        <div
                            v-if="project.repository"
                            class="overflow-hidden rounded-sm border border-line bg-surface"
                        >
                            <div
                                class="flex items-center gap-2 border-b border-line px-4 py-3 text-xs text-muted"
                            >
                                <Code2 :size="15" />
                                Repositorio
                            </div>
                            <div class="px-4 py-3 text-xs">
                                <a
                                    v-if="sourceUrl"
                                    :href="sourceUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-white/70"
                                >
                                    {{ repositoryName }}
                                    <ArrowUpRight :size="14" />
                                </a>
                                <span v-else class="font-medium">{{
                                    repositoryName
                                }}</span>
                                <p
                                    v-if="project.repository.github_pushed_at"
                                    class="mt-1 mb-0 text-muted"
                                >
                                    Última actividad
                                    {{
                                        fullDateLabel(
                                            project.repository.github_pushed_at,
                                        )
                                    }}
                                </p>
                            </div>
                            <dl
                                v-if="project.repository.visibility === 'public'"
                                class="m-0 grid grid-cols-3 border-t border-line"
                            >
                                <div
                                    v-for="stat in repositoryStats"
                                    :key="stat.label"
                                    class="border-r border-line px-3 py-2.5 last:border-r-0"
                                >
                                    <dt class="text-[11px] text-muted">
                                        {{ stat.label }}
                                    </dt>
                                    <dd class="m-0 mt-1 text-xs font-medium">
                                        {{ formatCount(stat.value) }}
                                    </dd>
                                </div>
                            </dl>
                            <div
                                v-if="project.repository.contributors?.length"
                                class="border-t border-line px-4 py-3"
                            >
                                <p
                                    class="mt-0 mb-2 flex items-center gap-2 text-xs text-muted"
                                >
                                    <Users :size="14" />Colaboradores
                                </p>
                                <ContributorStack
                                    :contributors="project.repository.contributors"
                                    :owner="project.repository.owner"
                                    :limit="6"
                                />
                            </div>
                        </div>

                        <div
                            class="rounded-sm border border-line bg-background-secondary p-4"
                        >
                            <p
                                class="m-0 flex items-center gap-2 text-xs text-muted"
                            >
                                <i
                                    class="signal-pulse size-1.5 rounded-full bg-signal"
                                />
                                Disponible para proyectos
                            </p>
                            <p class="mt-3 mb-0 text-sm leading-6 text-ink">
                                ¿Necesitas algo parecido para tu empresa?
                            </p>
                            <NuxtLink
                                to="/#contact"
                                class="mt-4 inline-flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                            >
                                Hablemos
                                <ArrowUpRight :size="15" />
                            </NuxtLink>
                        </div>
                    </aside>
                </div>
            </section>

            <nav
                v-if="siblings"
                class="border-t border-line px-4 sm:px-6"
                aria-label="Otros proyectos"
            >
                <div
                    class="mx-auto grid max-w-[92rem] sm:grid-cols-2 sm:divide-x sm:divide-line"
                >
                    <NuxtLink
                        v-for="sibling in siblings"
                        :key="sibling.direction"
                        :to="`/projects/${sibling.project.slug}`"
                        class="group flex items-center gap-5 border-b border-line py-8 sm:border-b-0 sm:py-12"
                        :class="
                            sibling.direction === 'next'
                                ? 'sm:flex-row-reverse sm:pl-8 sm:text-right'
                                : 'sm:pr-8'
                        "
                    >
                        <div
                            class="relative hidden aspect-[16/10] w-36 shrink-0 overflow-hidden rounded-sm border border-line sm:block lg:w-48"
                        >
                            <ProjectCover
                                :project="sibling.project"
                                :transition-source="false"
                                compact
                                image-class="transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                        </div>
                        <div class="min-w-0">
                            <span
                                class="flex items-center gap-2 text-xs text-muted"
                                :class="
                                    sibling.direction === 'next'
                                        ? 'sm:justify-end'
                                        : ''
                                "
                            >
                                <ArrowLeft
                                    v-if="sibling.direction === 'previous'"
                                    :size="14"
                                />
                                {{
                                    sibling.direction === "next"
                                        ? "Siguiente"
                                        : "Anterior"
                                }}
                                <ArrowRight
                                    v-if="sibling.direction === 'next'"
                                    :size="14"
                                />
                            </span>
                            <strong
                                class="mt-3 block font-display text-[clamp(3rem,5vw,5rem)] leading-[0.8] font-normal tracking-[-0.02em] transition-colors group-hover:text-white/75"
                            >
                                {{ sibling.project.name }}
                            </strong>
                        </div>
                    </NuxtLink>
                </div>
            </nav>

            <CtaBand
                :title="`¿Algo como ${project.name}?`"
                text="Cuéntame el contexto de tu empresa y qué quieres resolver. Te respondo con preguntas concretas y un siguiente paso claro."
                :secondary="{ label: 'Todos los proyectos', to: '/projects' }"
            />
        </template>

        <section
            v-else
            class="grid min-h-[80svh] place-items-center px-4 pt-24 text-center"
        >
            <div>
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
                        <ArrowLeft :size="16" />
                        Volver a proyectos
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
    ArrowRight,
    ArrowUpRight,
    Building2,
    CalendarRange,
    CircleOff,
    Code2,
    Globe,
    Layers3,
    LoaderCircle,
    MessageSquare,
    Radio,
    Users,
} from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const route = useRoute();
const { projects, status, error, refresh } = useProjects();
const { completeProjectTransition } = useProjectImageTransition();
const heroImageElement = ref<HTMLImageElement | null>(null);
const articleElement = ref<HTMLElement | null>(null);
const heroImageFailed = ref(false);
const readingProgress = ref(0);
const activeHeading = ref("");

const project = computed(() =>
    projects.value.find((item) => item.slug === route.params.slug),
);

const siblings = computed(() => {
    const list = projects.value;
    if (!project.value || list.length < 2) return null;

    const index = list.findIndex((item) => item.id === project.value?.id);
    const previous = list[(index - 1 + list.length) % list.length];
    const next = list[(index + 1) % list.length];
    if (!previous || !next) return null;

    // Con dos proyectos, anterior y siguiente serían el mismo.
    return previous.id === next.id
        ? [{ direction: "next" as const, project: next }]
        : [
              { direction: "previous" as const, project: previous },
              { direction: "next" as const, project: next },
          ];
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
    { label: "Stars", value: project.value?.repository?.stars_count ?? 0 },
    { label: "Forks", value: project.value?.repository?.forks_count ?? 0 },
    {
        label: "Issues",
        value: project.value?.repository?.open_issues_count ?? 0,
    },
]);

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

const formatCount = (value: number) =>
    new Intl.NumberFormat("es-ES", { notation: "compact" }).format(value);

const facts = computed(() => {
    const item = project.value;
    if (!item) return [];

    const host = projectHost(item);
    return [
        {
            icon: Layers3,
            label: "Tipo",
            value: projectTypeLabel(item.project_type),
        },
        {
            icon: Building2,
            label: "Para",
            value: projectOwner(item),
            href: item.client?.website || undefined,
        },
        { icon: CalendarRange, label: "Periodo", value: dateRange(item) },
        {
            icon: Radio,
            label: "Estado",
            value: projectStatusLabel(item.status),
        },
        host
            ? {
                  icon: Globe,
                  label: "Online",
                  value: host,
                  href: item.live_url || undefined,
              }
            : {
                  icon: Code2,
                  label: "Tecnología",
                  value:
                      item.repository?.primary_language || "Sistema a medida",
              },
    ];
});

// Algunas descripciones llegan con saltos de línea escapados ("\n" literal).
const descriptionParagraphs = computed(() =>
    (project.value?.description || "")
        .split(/(?:\\n|\r?\n)+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
);

const sanitizedContent = computed(() => {
    if (!project.value?.content_html?.trim()) return "";

    return DOMPurify.sanitize(project.value.content_html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "form", "iframe", "object", "embed"],
        FORBID_ATTR: ["style"],
    });
});

const decodeEntities = (value: string) =>
    value
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

const slugify = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

// Añade anclas a los h2 del contenido (ya saneado) para construir el índice
// y estima el tiempo de lectura. Se hace en el render para que funcione en SSR.
const article = computed(() => {
    const headings: { id: string; text: string }[] = [];
    const used = new Set<string>();

    const content = sanitizedContent.value.replace(
        /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
        (_match, attributes: string, inner: string) => {
            const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
            const base = slugify(text) || "seccion";
            let id = base;
            for (let suffix = 2; used.has(id); suffix += 1) {
                id = `${base}-${suffix}`;
            }
            used.add(id);
            headings.push({ id, text });

            const cleaned = attributes.replace(/\s+id=("[^"]*"|'[^']*')/i, "");
            return `<h2${cleaned} id="${id}">${inner}</h2>`;
        },
    );

    const words = [project.value?.description || "", content]
        .join(" ")
        .replace(/<[^>]+>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length;

    return {
        content,
        headings,
        minutes: Math.max(1, Math.round(words / 220)),
    };
});

let headingObserver: IntersectionObserver | undefined;
let progressFrame = 0;

const observeHeadings = () => {
    headingObserver?.disconnect();
    activeHeading.value = article.value.headings[0]?.id || "";
    if (!articleElement.value) return;

    headingObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        a.boundingClientRect.top - b.boundingClientRect.top,
                )[0];
            if (visible?.target.id) activeHeading.value = visible.target.id;
        },
        { rootMargin: "-15% 0px -70% 0px" },
    );

    articleElement.value
        .querySelectorAll("h2[id]")
        .forEach((heading) => headingObserver?.observe(heading));
};

const measureProgress = () => {
    progressFrame = 0;
    const element = articleElement.value;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const travelled = window.innerHeight * 0.35 - rect.top;
    readingProgress.value = Math.min(
        Math.max(travelled / Math.max(rect.height, 1), 0),
        1,
    );
};

const scheduleProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(measureProgress);
};

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

watch(
    [() => article.value.content, articleElement],
    () => {
        if (!import.meta.client) return;
        observeHeadings();
        measureProgress();
    },
    { flush: "post" },
);

onMounted(() => {
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    observeHeadings();
    measureProgress();
});

onBeforeUnmount(() => {
    headingObserver?.disconnect();
    cancelAnimationFrame(progressFrame);
    window.removeEventListener("scroll", scheduleProgress);
    window.removeEventListener("resize", scheduleProgress);
});

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
.project-prose {
    color: #a3a3ab;
    font-size: 1.0625rem;
    line-height: 1.8;
    overflow-wrap: anywhere;
}

/* Las notas suelen abrir con una línea en cursiva tipo "nota personal". */
.project-prose :deep(p:first-child > em:only-child) {
    display: inline-block;
    color: var(--color-muted);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-style: normal;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.project-prose :deep(h2),
.project-prose :deep(h3),
.project-prose :deep(h4) {
    scroll-margin-top: 6rem;
    color: var(--color-ink);
    letter-spacing: -0.025em;
}

.project-prose :deep(h2) {
    margin: 4rem 0 1.25rem;
    font-family: var(--font-display);
    font-size: clamp(2.9rem, 5vw, 4.4rem);
    font-weight: 400;
    line-height: 0.82;
    letter-spacing: -0.02em;
    text-wrap: balance;
}

.project-prose :deep(h3) {
    margin: 2.5rem 0 0.75rem;
    font-size: 1.35rem;
    font-weight: 500;
}

.project-prose :deep(p),
.project-prose :deep(ul),
.project-prose :deep(ol),
.project-prose :deep(blockquote),
.project-prose :deep(pre),
.project-prose :deep(table) {
    margin: 1.25rem 0;
}

.project-prose :deep(ul),
.project-prose :deep(ol) {
    padding-left: 1.4rem;
}

.project-prose :deep(ul) {
    list-style-type: disc;
}

.project-prose :deep(ol) {
    list-style-type: decimal;
}

.project-prose :deep(li + li) {
    margin-top: 0.45rem;
}

.project-prose :deep(li::marker) {
    color: var(--color-signal);
}

.project-prose :deep(strong) {
    color: var(--color-ink);
    font-weight: 500;
}

.project-prose :deep(a) {
    color: var(--color-ink);
    text-decoration: underline;
    text-decoration-color: var(--color-signal);
    text-underline-offset: 0.25em;
}

.project-prose :deep(blockquote) {
    margin: 2.5rem 0;
    border-left: 2px solid var(--color-signal);
    padding: 0.25rem 0 0.25rem 1.5rem;
    color: var(--color-ink);
    font-size: clamp(1.25rem, 2vw, 1.5rem);
    font-weight: 500;
    line-height: 1.45;
    letter-spacing: -0.02em;
}

.project-prose :deep(blockquote p) {
    margin: 0;
}

.project-prose :deep(code) {
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
    background: var(--color-surface);
    padding: 0.12rem 0.35rem;
    color: var(--color-ink);
    font-family: var(--font-mono);
    font-size: 0.85em;
}

.project-prose :deep(pre) {
    overflow-x: auto;
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
    background: var(--color-surface);
    padding: 1rem;
}

.project-prose :deep(pre code) {
    border: 0;
    background: transparent;
    padding: 0;
}

.project-prose :deep(img) {
    width: 100%;
    margin: 2rem 0;
    border: 1px solid var(--color-line);
    border-radius: 0.2rem;
}

.project-prose :deep(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
}

.project-prose :deep(th),
.project-prose :deep(td) {
    border: 1px solid var(--color-line);
    padding: 0.65rem 0.8rem;
    text-align: left;
}
</style>
