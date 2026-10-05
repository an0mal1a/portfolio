<template>
    <div class="bg-background pt-28 sm:pt-36">
        <header
            class="mx-auto grid max-w-[92rem] gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_24rem] lg:items-end lg:pb-16"
            data-reveal
        >
            <div>
                <p class="mb-6 flex items-center gap-2 text-xs text-muted">
                    <Archive :size="16" />
                    Archivo de proyectos
                    <span aria-hidden="true">·</span>
                    <span class="tabular-nums">{{
                        padNumber(projects.length)
                    }}</span>
                </p>
                <h1
                    class="m-0 font-display text-[clamp(4.6rem,9.5vw,9.5rem)] leading-[0.72] tracking-[-0.03em]"
                >
                    Trabajo real, sin teatro.
                </h1>
            </div>
            <div>
                <p class="m-0 max-w-md text-sm leading-6 text-muted">
                    Productos, webs y automatizaciones contados desde las
                    decisiones, los sistemas y las personas que hay detrás.
                </p>
                <dl
                    class="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line"
                >
                    <div
                        v-for="stat in stats"
                        :key="stat.label"
                        class="bg-background-secondary px-3 py-2.5"
                    >
                        <dt class="text-[11px] text-muted">{{ stat.label }}</dt>
                        <dd
                            class="m-0 mt-1 text-lg font-medium tracking-[-0.03em] tabular-nums"
                        >
                            {{ padNumber(stat.value) }}
                        </dd>
                    </div>
                </dl>
            </div>
        </header>

        <div
            class="sticky top-14 z-30 border-y border-line bg-background/90 backdrop-blur-xl"
        >
            <div
                class="mx-auto flex max-w-[92rem] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-0"
            >
                <nav
                    class="-mb-px flex gap-5 overflow-x-auto [scrollbar-width:none] lg:self-stretch [&::-webkit-scrollbar]:hidden"
                    aria-label="Filtrar por tipo de proyecto"
                >
                    <button
                        v-for="tab in typeTabs"
                        :key="tab.value"
                        type="button"
                        class="flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-0.5 pb-2.5 text-sm transition-colors lg:pt-4 lg:pb-3.5"
                        :class="
                            activeType === tab.value
                                ? 'border-signal font-medium text-ink'
                                : 'border-transparent text-muted hover:text-ink'
                        "
                        :aria-pressed="activeType === tab.value"
                        @click="activeType = tab.value"
                    >
                        {{ tab.label }}
                        <span
                            class="rounded-full px-1.5 py-px text-[11px] tabular-nums transition-colors"
                            :class="
                                activeType === tab.value
                                    ? 'bg-signal/15 text-signal'
                                    : 'bg-surface-raised text-ink'
                            "
                            >{{ tab.count }}</span
                        >
                    </button>
                </nav>

                <div class="flex items-center gap-2">
                    <label
                        class="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1.5 text-xs text-muted transition-colors focus-within:border-line-strong lg:w-64 lg:flex-none"
                    >
                        <Search :size="15" class="shrink-0" />
                        <span class="sr-only">Buscar proyectos</span>
                        <input
                            v-model.trim="query"
                            type="search"
                            placeholder="Buscar por nombre, cliente o tecnología"
                            class="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-ink outline-none placeholder:text-muted"
                            @keydown.esc="query = ''"
                        />
                    </label>
                    <div
                        class="shrink-0 rounded-sm border border-line bg-surface p-1"
                    >
                        <CustomSelect
                            v-model="sorting"
                            class="w-32"
                            label="Ordenar proyectos"
                            :options="sortOptions"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-auto max-w-[92rem] px-4 pt-4 pb-24 sm:px-6 sm:pb-32">
            <div
                v-if="error && projects.length"
                class="mt-4 flex flex-col gap-3 rounded-sm border border-signal/30 bg-surface px-3 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
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
                v-if="status === 'pending' && !projects.length"
                aria-live="polite"
            >
                <span class="sr-only">Cargando proyectos</span>
                <div
                    v-for="n in 4"
                    :key="n"
                    class="grid gap-6 border-b border-line py-6 md:grid-cols-[17rem_1fr] lg:grid-cols-[19rem_1fr]"
                >
                    <div
                        class="aspect-[16/10] animate-pulse rounded-sm bg-surface"
                    />
                    <div class="space-y-4 pt-2">
                        <div class="h-3 w-32 animate-pulse rounded-sm bg-surface" />
                        <div class="h-12 w-2/3 animate-pulse rounded-sm bg-surface" />
                        <div class="h-3 w-1/2 animate-pulse rounded-sm bg-surface" />
                    </div>
                </div>
            </div>

            <template v-else-if="projects.length">
                <p
                    class="mt-4 mb-0 text-xs text-muted"
                    aria-live="polite"
                >
                    {{ resultLabel }}
                </p>

                <ol
                    v-if="visibleProjects.length"
                    class="m-0 list-none p-0"
                >
                    <li
                        v-for="(project, index) in visibleProjects"
                        :key="project.id"
                        data-reveal
                        :style="{ '--reveal-delay': `${Math.min(index, 4) * 50}ms` }"
                    >
                        <NuxtLink
                            :to="`/projects/${project.slug}`"
                            class="archive-row group grid gap-5 border-b border-line py-6 sm:py-8 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-7 lg:grid-cols-[19rem_minmax(0,1fr)_14rem] lg:gap-10"
                            data-project-transition-scope
                            @click.capture="handleOpen($event, project)"
                        >
                            <div
                                class="relative aspect-[16/10] overflow-hidden rounded-sm border border-line bg-surface transition-colors duration-300 group-hover:border-line-strong"
                            >
                                <ProjectCover
                                    :project="project"
                                    compact
                                    :eager="index < 2"
                                    image-class="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                            </div>

                            <div class="flex min-w-0 flex-col">
                                <p
                                    class="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted"
                                >
                                    <span>{{
                                        projectTypeLabel(project.project_type)
                                    }}</span>
                                    <span aria-hidden="true">·</span>
                                    <span class="tabular-nums">{{
                                        projectYear(project)
                                    }}</span>
                                    <template v-if="project.is_featured">
                                        <span aria-hidden="true">·</span>
                                        <span
                                            class="inline-flex items-center gap-1.5 text-signal"
                                            ><Sparkles :size="13" />Destacado</span
                                        >
                                    </template>
                                </p>
                                <h2
                                    class="m-0 font-display text-[clamp(3rem,5vw,4.6rem)] leading-[0.8] font-normal tracking-[-0.02em] transition-colors duration-200 group-hover:text-white/75"
                                >
                                    {{ project.name }}
                                </h2>
                                <p
                                    class="mt-4 mb-0 line-clamp-3 max-w-2xl text-sm leading-6 text-muted"
                                >
                                    {{ project.tagline || project.description }}
                                </p>

                                <div
                                    class="mt-auto flex flex-wrap items-center gap-2 pt-5 text-xs lg:hidden"
                                >
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-sm border border-line px-2 py-1 text-muted"
                                    >
                                        <i
                                            class="size-1.5 rounded-full"
                                            :class="projectStatusTone(project.status)"
                                        />
                                        {{ projectStatusLabel(project.status) }}
                                    </span>
                                    <span
                                        class="rounded-sm border border-line px-2 py-1 text-muted"
                                        >{{ projectOwner(project) }}</span
                                    >
                                    <span
                                        v-if="project.repository?.primary_language"
                                        class="rounded-sm border border-line px-2 py-1 text-muted"
                                        >{{ project.repository.primary_language }}</span
                                    >
                                </div>
                            </div>

                            <div
                                class="hidden min-w-0 flex-col border-l border-line pl-6 text-xs lg:flex"
                            >
                                <dl class="m-0 grid gap-4">
                                    <div>
                                        <dt class="mb-1 text-muted">Estado</dt>
                                        <dd
                                            class="m-0 flex items-center gap-2 text-ink"
                                        >
                                            <i
                                                class="size-1.5 rounded-full"
                                                :class="
                                                    projectStatusTone(project.status)
                                                "
                                            />
                                            {{ projectStatusLabel(project.status) }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt class="mb-1 text-muted">Para</dt>
                                        <dd class="m-0 truncate text-ink">
                                            {{ projectOwner(project) }}
                                        </dd>
                                    </div>
                                    <div v-if="projectHost(project)">
                                        <dt class="mb-1 text-muted">Online</dt>
                                        <dd class="m-0 truncate text-ink">
                                            {{ projectHost(project) }}
                                        </dd>
                                    </div>
                                </dl>
                                <span
                                    class="mt-auto inline-flex items-center gap-2 pt-6 font-medium text-ink"
                                >
                                    Ver caso
                                    <span
                                        class="grid size-7 place-items-center rounded-sm border border-line transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-background"
                                    >
                                        <ArrowUpRight :size="15" />
                                    </span>
                                </span>
                            </div>
                        </NuxtLink>
                    </li>
                </ol>

                <div
                    v-else
                    class="mt-6 grid min-h-64 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
                >
                    <div>
                        <CircleOff :size="20" class="mx-auto text-signal" />
                        <p
                            class="mx-auto mt-4 mb-0 max-w-md text-sm leading-6 text-muted"
                        >
                            Ningún proyecto coincide con estos filtros.
                        </p>
                        <button
                            type="button"
                            class="mt-5 cursor-pointer rounded-sm border border-line px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                            @click="resetFilters"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </template>

            <section
                v-else
                class="mt-6 grid min-h-72 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
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

        <CtaBand
            title="¿Tienes algo parecido en mente?"
            text="Cuéntame qué quieres construir o qué está fallando. Te respondo con preguntas concretas y, si encajamos, una propuesta clara."
            :secondary="{ label: 'Ver servicios', to: '/#services' }"
        />
    </div>
</template>

<script setup lang="ts">
import {
    Archive,
    ArrowUpRight,
    CalendarClock,
    CircleOff,
    Search,
    Sparkles,
} from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const { projects, clients, status, error, refresh } = useProjects();
const { openProject } = useProjectImageTransition();

const ALL = "all";
const activeType = ref(ALL);
const query = ref("");
const sorting = ref("featured");

const sortOptions = {
    featured: { label: "Destacados", icon: Sparkles },
    recent: { label: "Más recientes", icon: CalendarClock },
};

const stats = computed(() => [
    {
        label: "En curso",
        value: projects.value.filter((p) => p.status === "in_progress").length,
    },
    {
        label: "Entregados",
        value: projects.value.filter((p) => p.status === "published").length,
    },
    { label: "Clientes", value: clients.value.length },
]);

const typeTabs = computed(() => {
    const types = [...new Set(projects.value.map((p) => p.project_type))].sort(
        (a, b) => projectTypeLabel(a).localeCompare(projectTypeLabel(b)),
    );

    return [
        { value: ALL, label: "Todos", count: projects.value.length },
        ...types.map((type) => ({
            value: type,
            label: projectTypeLabel(type),
            count: projects.value.filter((p) => p.project_type === type)
                .length,
        })),
    ];
});

const normalize = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();

const searchableText = (project: PortfolioProject) =>
    normalize(
        [
            project.name,
            project.tagline,
            project.description,
            project.client?.name,
            project.repository?.primary_language,
            projectTypeLabel(project.project_type),
        ]
            .filter(Boolean)
            .join(" "),
    );

const projectTime = (project: PortfolioProject) =>
    new Date(
        project.completed_at || project.started_at || project.created_at,
    ).getTime();

const visibleProjects = computed(() => {
    const needle = normalize(query.value);
    const filtered = projects.value.filter(
        (project) =>
            (activeType.value === ALL ||
                project.project_type === activeType.value) &&
            (!needle || searchableText(project).includes(needle)),
    );

    return sorting.value === "recent"
        ? [...filtered].sort((a, b) => projectTime(b) - projectTime(a))
        : filtered;
});

const resultLabel = computed(() => {
    const total = projects.value.length;
    const shown = visibleProjects.value.length;
    return shown === total
        ? `${total} proyectos`
        : `${shown} de ${total} proyectos`;
});

const resetFilters = () => {
    activeType.value = ALL;
    query.value = "";
};

const handleOpen = (event: MouseEvent, project: PortfolioProject) => {
    void openProject(event, project);
};

useReveal();

useSeoMeta({
    title: "Proyectos · Pablo Diez",
    description:
        "SaaS, webs, automatizaciones e infraestructura desarrollados por Pablo Diez, desarrollador freelance en Ibiza.",
    ogTitle: "Proyectos · Pablo Diez",
    ogDescription:
        "Un archivo de productos digitales, webs y automatizaciones contados desde sus decisiones técnicas.",
    ogType: "website",
});
</script>
