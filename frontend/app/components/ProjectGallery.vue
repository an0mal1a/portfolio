<template>
    <section
        id="work"
        class="border-b border-line px-4 py-20 sm:px-6 sm:py-28"
        aria-labelledby="work-title"
    >
        <div class="mx-auto max-w-[92rem]">
            <header
                class="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[1fr_24rem] lg:items-end"
                data-reveal
            >
                <div>
                    <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                        <Layers3 :size="16" />
                        Trabajo seleccionado
                        <span aria-hidden="true">·</span>
                        <span class="tabular-nums">{{
                            padNumber(visibleProjects.length)
                        }}</span>
                    </p>
                    <h2
                        id="work-title"
                        class="m-0 max-w-[14ch] font-display text-[clamp(4rem,7.5vw,7.5rem)] leading-[0.74] tracking-[-0.03em]"
                    >
                        Del problema al producto.
                    </h2>
                </div>

                <div class="border-l border-line pl-5">
                    <p class="m-0 text-sm leading-6 text-muted">
                        SaaS, webs y automatizaciones construidos para clientes
                        y para mí. Cada caso cuenta las decisiones que hay
                        detrás, no solo el resultado.
                    </p>
                    <NuxtLink
                        to="/projects"
                        class="mt-4 inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-white/70"
                    >
                        Ver archivo completo
                        <span class="text-muted tabular-nums">{{
                            padNumber(projects.length)
                        }}</span>
                        <ArrowUpRight :size="15" />
                    </NuxtLink>
                </div>
            </header>

            <div
                v-if="status === 'pending' && !projects.length"
                class="border-t border-line"
                aria-live="polite"
            >
                <span class="sr-only">Cargando proyectos</span>
                <div
                    v-for="index in 4"
                    :key="index"
                    class="flex items-center gap-6 border-b border-line py-7"
                >
                    <div class="h-3 w-6 animate-pulse rounded-sm bg-surface" />
                    <div
                        class="h-14 w-2/5 animate-pulse rounded-sm bg-surface"
                    />
                </div>
            </div>

            <ol
                v-else-if="visibleProjects.length"
                class="work-list m-0 list-none border-t border-line p-0"
                :class="{ 'is-hovering': previewVisible }"
                @pointermove="trackPointer"
                @pointerleave="hidePreview"
            >
                <li
                    v-for="(project, index) in visibleProjects"
                    :key="project.id"
                    data-reveal
                    :style="{ '--reveal-delay': `${index * 60}ms` }"
                >
                    <NuxtLink
                        :to="`/projects/${project.slug}`"
                        class="work-row group grid gap-5 border-b border-line py-6 sm:py-7 lg:grid-cols-[3rem_minmax(0,1fr)_13rem_6rem_2.5rem] lg:items-center lg:gap-6 lg:py-8"
                        :class="{ 'is-active': activeIndex === index }"
                        data-project-transition-scope
                        @pointerenter="activate(index)"
                        @focus="activate(index)"
                        @click.capture="handleOpen($event, project, index)"
                    >
                        <div
                            class="relative aspect-[16/10] overflow-hidden rounded-sm border border-line lg:hidden"
                        >
                            <ProjectCover
                                :project="project"
                                compact
                                image-class="transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                        </div>

                        <span
                            class="hidden text-xs text-muted tabular-nums lg:block"
                            >{{ padNumber(index + 1) }}</span
                        >

                        <div class="min-w-0">
                            <p
                                class="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted lg:hidden"
                            >
                                <span class="text-signal tabular-nums">{{
                                    padNumber(index + 1)
                                }}</span>
                                <span>{{
                                    projectTypeLabel(project.project_type)
                                }}</span>
                                <span aria-hidden="true">·</span>
                                <span>{{ projectOwner(project) }}</span>
                                <span aria-hidden="true">·</span>
                                <span>{{ projectYear(project) }}</span>
                            </p>
                            <h3
                                class="work-row__title m-0 font-display text-[clamp(3.2rem,6vw,5.75rem)] leading-[0.8] font-normal tracking-[-0.02em]"
                            >
                                {{ project.name }}
                            </h3>
                            <p
                                class="mt-3 mb-0 line-clamp-2 max-w-2xl text-sm leading-6 text-muted lg:line-clamp-1"
                            >
                                {{ project.tagline || project.description }}
                            </p>
                        </div>

                        <div class="hidden min-w-0 text-xs lg:block">
                            <span class="block truncate text-ink">{{
                                projectTypeLabel(project.project_type)
                            }}</span>
                            <span class="mt-1 block truncate text-muted">{{
                                projectOwner(project)
                            }}</span>
                        </div>

                        <span
                            class="hidden items-center gap-2 text-xs text-muted lg:flex"
                        >
                            <i
                                class="size-1.5 rounded-full"
                                :class="projectStatusTone(project.status)"
                            />
                            <span class="tabular-nums">{{
                                projectYear(project)
                            }}</span>
                        </span>

                        <span
                            class="hidden size-10 place-items-center rounded-sm border border-line text-muted transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-background lg:grid"
                            aria-hidden="true"
                        >
                            <ArrowUpRight :size="17" />
                        </span>
                    </NuxtLink>
                </li>
            </ol>

            <div
                v-else
                class="rounded-sm border border-line bg-surface p-6 text-sm text-muted"
            >
                El archivo público de proyectos se está preparando.
            </div>
        </div>

        <div
            v-if="canPreview && visibleProjects.length"
            ref="previewElement"
            class="work-preview"
            :class="{ 'is-visible': previewVisible }"
            aria-hidden="true"
        >
            <div class="work-preview__frame">
                <div
                    v-for="(project, index) in visibleProjects"
                    :key="project.id"
                    class="absolute inset-0 transition-opacity duration-300"
                    :class="activeIndex === index ? 'opacity-100' : 'opacity-0'"
                    :data-preview-index="index"
                >
                    <ProjectCover
                        :project="project"
                        :transition-source="false"
                        alt=""
                        compact
                    />
                </div>
                <span class="work-preview__label">
                    <i
                        class="size-1.5 rounded-full"
                        :class="
                            activeProject
                                ? projectStatusTone(activeProject.status)
                                : 'bg-signal'
                        "
                    />
                    {{
                        activeProject
                            ? projectStatusLabel(activeProject.status)
                            : ""
                    }}
                </span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Layers3 } from "@lucide/vue";
import type { AsyncDataRequestStatus } from "#app";
import type { PortfolioProject } from "~/types/portfolio";

const props = defineProps<{
    projects: PortfolioProject[];
    status: AsyncDataRequestStatus;
}>();

const PREVIEW_WIDTH = 384;
const PREVIEW_HEIGHT = 240;
const PREVIEW_DRIFT = 0.12;

const visibleProjects = computed(() => props.projects.slice(0, 6));
const activeIndex = ref(-1);
const previewVisible = ref(false);
const canPreview = ref(false);
const previewElement = ref<HTMLElement>();
const activeProject = computed(
    () => visibleProjects.value[activeIndex.value] || null,
);

const { openProject } = useProjectImageTransition();

const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let frame = 0;
let reducedMotion = false;
let previewQuery: MediaQueryList | undefined;

const paintPreview = () => {
    const element = previewElement.value;
    if (!element) return;

    element.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
};

const tick = () => {
    const ease = reducedMotion ? 1 : 0.16;
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;
    paintPreview();

    const settled =
        Math.abs(target.x - current.x) < 0.3 &&
        Math.abs(target.y - current.y) < 0.3;
    frame = settled ? 0 : requestAnimationFrame(tick);
};

// La vista previa vive en el hueco entre el texto y los metadatos para no
// tapar el título: sigue al cursor en vertical y solo deriva un poco en X.
const trackPointer = (event: PointerEvent) => {
    if (!canPreview.value || event.pointerType !== "mouse") return;

    const list = (event.currentTarget as HTMLElement).getBoundingClientRect();
    // 26rem = columnas de tipo, año y flecha (+ huecos) de cada fila.
    const anchorX = list.right - 26 * 16 - 24 - PREVIEW_WIDTH;
    target.x = anchorX + (event.clientX - anchorX) * PREVIEW_DRIFT;
    target.y = Math.min(
        Math.max(event.clientY - PREVIEW_HEIGHT / 2, 72),
        window.innerHeight - PREVIEW_HEIGHT - 16,
    );

    if (!previewVisible.value) {
        // Primera aparición: sin arrastre desde la posición anterior.
        current.x = target.x;
        current.y = target.y;
        paintPreview();
        // Tras un scroll la vista previa se oculta; reaparece al mover.
        if (activeIndex.value >= 0) previewVisible.value = true;
    }

    if (!frame) frame = requestAnimationFrame(tick);
};

const activate = (index: number) => {
    activeIndex.value = index;
    if (canPreview.value) previewVisible.value = true;
};

const hidePreview = () => {
    previewVisible.value = false;
};

const handleOpen = (
    event: MouseEvent,
    project: PortfolioProject,
    index: number,
) => {
    const previewImage =
        canPreview.value && previewVisible.value
            ? previewElement.value?.querySelector<HTMLImageElement>(
                  `[data-preview-index="${index}"] img`,
              )
            : null;

    void openProject(event, project, previewImage);
};

const syncPreviewCapability = () => {
    canPreview.value = Boolean(previewQuery?.matches);
    if (!canPreview.value) previewVisible.value = false;
};

onMounted(() => {
    reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    previewQuery = window.matchMedia(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    previewQuery.addEventListener("change", syncPreviewCapability);
    syncPreviewCapability();
    window.addEventListener("scroll", hidePreview, { passive: true });
});

onBeforeUnmount(() => {
    previewQuery?.removeEventListener("change", syncPreviewCapability);
    window.removeEventListener("scroll", hidePreview);
    cancelAnimationFrame(frame);
});
</script>

<style scoped>
.work-row {
    position: relative;
    transition: opacity 260ms ease;
}

.work-row__title {
    transition:
        transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
        color 200ms ease;
}

@media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
    .work-row:hover .work-row__title,
    .work-row:focus-visible .work-row__title {
        transform: translateX(0.6rem);
    }

    .work-list.is-hovering .work-row:not(.is-active) {
        opacity: 0.38;
    }
}

.work-preview {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
    width: 24rem;
    height: 15rem;
    pointer-events: none;
    will-change: transform;
}

.work-preview__frame {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--color-line-strong);
    border-radius: 0.25rem;
    background: var(--color-surface);
    box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.55);
    opacity: 0;
    clip-path: inset(12% 12% 12% 12% round 0.25rem);
    scale: 0.94;
    transition:
        opacity 240ms ease,
        clip-path 420ms cubic-bezier(0.16, 1, 0.3, 1),
        scale 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.work-preview.is-visible .work-preview__frame {
    opacity: 1;
    clip-path: inset(0 0 0 0 round 0.25rem);
    scale: 1;
}

.work-preview__label {
    position: absolute;
    bottom: 0.6rem;
    left: 0.6rem;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.2rem;
    color: var(--color-ink);
    background: rgba(8, 8, 9, 0.72);
    font-size: 0.68rem;
    backdrop-filter: blur(10px);
}

@media (prefers-reduced-motion: reduce) {
    .work-row__title,
    .work-preview__frame {
        transition: opacity 120ms linear !important;
        transform: none !important;
        scale: 1 !important;
        clip-path: none !important;
    }
}
</style>
