<template>
    <section
        id="work"
        class="project-story border-y border-line bg-background"
        aria-labelledby="work-title"
    >
        <div
            v-if="status === 'pending'"
            class="mx-auto max-w-[92rem] px-4 py-24 sm:px-6 sm:py-32"
            aria-live="polite"
        >
            <div class="mb-10 h-3 w-40 animate-pulse rounded-sm bg-surface" />
            <div class="grid gap-5 lg:grid-cols-[0.8fr_1.4fr]">
                <div class="min-h-72 animate-pulse rounded-sm bg-surface" />
                <div class="aspect-[16/10] animate-pulse rounded-sm bg-surface" />
            </div>
        </div>

        <div
            v-else-if="featuredProjects.length"
            ref="storyScroller"
            class="project-story__scroller"
            :class="{ 'is-enhanced': isEnhanced }"
            :style="storyStyle"
        >
            <div ref="storyStage" class="project-story__stage">
                <header class="project-story__header">
                    <div class="flex min-w-0 items-center gap-2 text-xs text-muted">
                        <Layers3 :size="16" />
                        <span>Trabajo seleccionado</span>
                        <span aria-hidden="true">·</span>
                        <span>{{ projectCounter }}</span>
                    </div>

                    <p
                        v-if="isEnhanced"
                        class="hidden items-center gap-2 text-xs text-muted lg:flex"
                    >
                        <Mouse :size="15" />
                        Sigue desplazándote para explorar
                    </p>

                    <NuxtLink
                        to="/projects"
                        class="inline-flex shrink-0 items-center gap-2 text-xs font-medium transition-colors hover:text-white/70"
                    >
                        Ver archivo
                        <ArrowUpRight :size="15" />
                    </NuxtLink>
                </header>

                <div class="project-story__viewport">
                    <article
                        v-for="(project, index) in featuredProjects"
                        :key="project.id"
                        class="project-story__panel"
                        :class="{ 'is-active': index === activeProjectIndex }"
                        :data-project-index="index"
                        :aria-hidden="isEnhanced && index !== activeProjectIndex"
                        data-project-transition-scope
                    >
                        <div class="project-story__copy">
                            <div>
                                <p class="project-story__eyebrow">
                                    <span class="text-signal">{{
                                        String(index + 1).padStart(2, "0")
                                    }}</span>
                                    <span aria-hidden="true">/</span>
                                    <span>{{ projectTypeLabel(project.project_type) }}</span>
                                </p>

                                <h2
                                    :id="index === 0 ? 'work-title' : undefined"
                                    class="project-story__title"
                                >
                                    {{ project.name }}
                                </h2>

                                <p class="project-story__summary">
                                    {{ project.tagline || project.description }}
                                </p>
                            </div>

                            <div>
                                <dl class="project-story__metadata">
                                    <div>
                                        <dt>Entrega</dt>
                                        <dd>{{ yearOf(project) }}</dd>
                                    </div>
                                    <div>
                                        <dt>Para</dt>
                                        <dd>{{ project.client?.name || "Producto propio" }}</dd>
                                    </div>
                                    <div>
                                        <dt>Tecnología</dt>
                                        <dd>{{
                                            project.repository?.primary_language ||
                                            "Sistema digital"
                                        }}</dd>
                                    </div>
                                </dl>

                                <div class="mt-6 flex flex-wrap items-center gap-3">
                                    <NuxtLink
                                        :to="projectHref(project)"
                                        class="project-story__cta"
                                        :tabindex="
                                            isEnhanced && index !== activeProjectIndex
                                                ? -1
                                                : undefined
                                        "
                                        @click="handleProjectOpen($event, project)"
                                    >
                                        Ver caso de estudio
                                        <ArrowUpRight :size="16" />
                                    </NuxtLink>

                                    <span class="inline-flex items-center gap-2 text-xs text-muted">
                                        <i class="size-1.5 rounded-full bg-signal" />
                                        {{ statusLabel(project.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <NuxtLink
                            :to="projectHref(project)"
                            class="project-story__visual-link"
                            :tabindex="
                                isEnhanced && index !== activeProjectIndex
                                    ? -1
                                    : undefined
                            "
                            :aria-label="'Abrir el proyecto ' + project.name"
                            @click="handleProjectOpen($event, project)"
                        >
                            <figure class="project-story__visual soft-noise">
                                <div class="project-story__windowbar">
                                    <span class="flex items-center gap-2">
                                        <Box :size="15" />
                                        Proyecto {{ String(index + 1).padStart(2, "0") }}
                                    </span>
                                    <span class="hidden sm:block">{{ projectOwner(project) }}</span>
                                    <span class="flex items-center gap-2">
                                        <i class="size-1.5 rounded-full bg-signal" />
                                        {{ project.repository?.primary_language || "Online" }}
                                    </span>
                                </div>

                                <div class="project-story__media-frame" data-project-media>
                                    <img
                                        v-if="hasProjectImage(project)"
                                        data-project-cover
                                        :src="project.image || undefined"
                                        :alt="'Vista previa del proyecto ' + project.name"
                                        class="absolute inset-0 size-full object-cover"
                                        :loading="index === 0 ? 'eager' : 'lazy'"
                                        decoding="async"
                                        @error="markImageAsFailed(project.id)"
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

                                    <div class="project-story__image-shade" aria-hidden="true" />
                                    <p class="project-story__image-title" aria-hidden="true">
                                        {{ project.name }}
                                    </p>
                                    <span class="project-story__open-icon" aria-hidden="true">
                                        <ArrowUpRight :size="18" />
                                    </span>
                                </div>
                            </figure>
                        </NuxtLink>
                    </article>
                </div>

                <nav
                    v-if="featuredProjects.length > 1"
                    class="project-story__progress"
                    aria-label="Proyectos destacados"
                >
                    <button
                        v-for="(project, index) in featuredProjects"
                        :key="project.id"
                        type="button"
                        class="project-story__progress-item"
                        :class="{ 'is-active': index === activeProjectIndex }"
                        :aria-current="index === activeProjectIndex ? 'step' : undefined"
                        :aria-label="'Ir al proyecto ' + project.name"
                        @click="scrollToProject(index)"
                    >
                        <span>{{ String(index + 1).padStart(2, "0") }}</span>
                        <i aria-hidden="true" />
                    </button>
                </nav>
            </div>
        </div>

        <div
            v-else
            class="mx-auto max-w-[92rem] px-4 py-24 sm:px-6 sm:py-32"
        >
            <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                <Layers3 :size="16" />Trabajo seleccionado · 00
            </p>
            <div class="rounded-sm border border-line bg-surface p-6 text-sm text-muted">
                El archivo público de proyectos se está preparando.
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Box, Layers3, Mouse } from "@lucide/vue";
import type { AsyncDataRequestStatus } from "#app";
import type { PortfolioProject } from "~/types/portfolio";

const props = defineProps<{
    projects: PortfolioProject[];
    status: AsyncDataRequestStatus;
}>();

const featuredProjects = computed(() => props.projects.slice(0, 4));
const projectCounter = computed(() =>
    featuredProjects.value.length.toString().padStart(2, "0"),
);

const storyScroller = ref<HTMLElement>();
const storyStage = ref<HTMLElement>();
const isEnhanced = ref(false);
const activeProjectIndex = ref(0);
const failedImages = reactive(new Set<number>());
const { openProject } = useProjectImageTransition();

let mediaQuery: MediaQueryList | undefined;
let animationFrame = 0;
let targetProgress = 0;
let renderedProgress = 0;

// Cada proyecto permanece quieto durante casi un viewport completo antes de
// consumir el tramo de scroll que hace la transición al siguiente.
const HOLD_SCROLL_UNITS = 0.82;
const TRANSITION_SCROLL_UNITS = 0.55;

const scrollUnitsFor = (projectCount: number) =>
    projectCount * HOLD_SCROLL_UNITS +
    Math.max(projectCount - 1, 0) * TRANSITION_SCROLL_UNITS;

const storyStyle = computed(() =>
    isEnhanced.value
        ? {
              height:
                  String(
                      (1 + scrollUnitsFor(featuredProjects.value.length)) * 100,
                  ) + "svh",
          }
        : undefined,
);

const clamp = (value: number, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max);

const panelElements = () =>
    Array.from(
        storyScroller.value?.querySelectorAll<HTMLElement>(
            ".project-story__panel",
        ) || [],
    );

const positionForProgress = (progress: number, projectCount: number) => {
    if (projectCount <= 1) return 0;

    let remainingUnits =
        clamp(progress) * scrollUnitsFor(projectCount);

    for (let index = 0; index < projectCount; index += 1) {
        if (remainingUnits <= HOLD_SCROLL_UNITS) return index;

        remainingUnits -= HOLD_SCROLL_UNITS;
        if (index === projectCount - 1) return index;

        if (remainingUnits <= TRANSITION_SCROLL_UNITS) {
            return index + remainingUnits / TRANSITION_SCROLL_UNITS;
        }

        remainingUnits -= TRANSITION_SCROLL_UNITS;
    }

    return projectCount - 1;
};

const progressForProject = (index: number, projectCount: number) => {
    const totalUnits = scrollUnitsFor(projectCount);
    const unitsBeforeProject =
        index * (HOLD_SCROLL_UNITS + TRANSITION_SCROLL_UNITS);

    return totalUnits > 0
        ? (unitsBeforeProject + HOLD_SCROLL_UNITS / 2) / totalUnits
        : 0;
};

const paintPanels = (progress: number) => {
    const panels = panelElements();
    const position = positionForProgress(progress, panels.length);
    const nextActiveIndex = Math.round(position);

    if (activeProjectIndex.value !== nextActiveIndex) {
        activeProjectIndex.value = nextActiveIndex;
    }

    storyScroller.value?.style.setProperty(
        "--story-progress",
        progress.toFixed(4),
    );

    panels.forEach((panel, index) => {
        const offset = index - position;
        const distance = Math.min(Math.abs(offset), 1);
        const translate = offset >= 0 ? offset * 12 : offset * 7;
        const scale = 1 - distance * 0.035;
        const incomingClip = offset > 0 ? clamp(offset) * 100 : 0;
        const copyOpacity = clamp(1 - Math.abs(offset) * 2.25);
        const visualOpacity = Math.cos(distance * (Math.PI / 2));

        panel.style.opacity = "1";
        panel.style.transform =
            "translate3d(0, " + String(translate) + "%, 0) scale(" + String(scale) + ")";
        panel.style.visibility = Math.abs(offset) > 1.05 ? "hidden" : "visible";
        panel.style.pointerEvents = Math.abs(offset) < 0.5 ? "auto" : "none";
        panel.style.zIndex = String(panels.length - Math.round(Math.abs(offset)));

        const copy = panel.querySelector<HTMLElement>(".project-story__copy");
        if (copy) {
            copy.style.opacity = copyOpacity.toFixed(3);
            copy.style.transform =
                "translate3d(0, " + String(offset * 4) + "%, 0)";
            copy.style.filter =
                "blur(" + String((1 - copyOpacity) * 2.5) + "px)";
        }

        const visual = panel.querySelector<HTMLElement>(
            ".project-story__visual-link",
        );
        if (visual) {
            visual.style.opacity = visualOpacity.toFixed(3);
            visual.style.clipPath =
                "inset(" +
                String(incomingClip) +
                "% 0 0 0 round 0.25rem)";
        }

        panel
            .querySelectorAll<HTMLElement>(
                ".project-story__image-title, .project-story__open-icon, .repository-fallback-cover > div:last-child",
            )
            .forEach((detail) => {
                detail.style.opacity = copyOpacity.toFixed(3);
            });

        const media = panel.querySelector<HTMLElement>("[data-project-media]");
        if (media) {
            media.style.transform =
                "scale(" +
                String(1 + distance * 0.055) +
                ") translate3d(0, " +
                String(offset * 1.8) +
                "%, 0)";
        }
    });
};

const animateToTarget = () => {
    const difference = targetProgress - renderedProgress;
    renderedProgress += difference * 0.14;

    if (Math.abs(difference) < 0.0005) {
        renderedProgress = targetProgress;
    }

    paintPanels(renderedProgress);

    if (renderedProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(animateToTarget);
    } else {
        animationFrame = 0;
    }
};

const updateScrollProgress = () => {
    if (!isEnhanced.value || !storyScroller.value || !storyStage.value) return;

    const rect = storyScroller.value.getBoundingClientRect();
    const scrollDistance =
        storyScroller.value.offsetHeight - storyStage.value.offsetHeight;
    targetProgress = scrollDistance > 0 ? clamp(-rect.top / scrollDistance) : 0;

    if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateToTarget);
    }
};

const resetPanels = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    targetProgress = 0;
    renderedProgress = 0;
    activeProjectIndex.value = 0;

    panelElements().forEach((panel) => {
        panel.removeAttribute("style");
        panel
            .querySelector<HTMLElement>(".project-story__copy")
            ?.removeAttribute("style");
        panel
            .querySelector<HTMLElement>(".project-story__visual-link")
            ?.removeAttribute("style");
        panel
            .querySelectorAll<HTMLElement>(
                ".project-story__image-title, .project-story__open-icon, .repository-fallback-cover > div:last-child",
            )
            .forEach((detail) => detail.removeAttribute("style"));
        panel
            .querySelector<HTMLElement>("[data-project-media]")
            ?.removeAttribute("style");
    });
    storyScroller.value?.style.removeProperty("--story-progress");
};

const applyExperienceMode = async () => {
    const shouldEnhance = Boolean(
        mediaQuery?.matches && featuredProjects.value.length > 1,
    );

    if (isEnhanced.value === shouldEnhance) {
        if (shouldEnhance) updateScrollProgress();
        return;
    }

    resetPanels();
    isEnhanced.value = shouldEnhance;
    await nextTick();

    if (shouldEnhance) {
        updateScrollProgress();
    }
};

const scrollToProject = (index: number) => {
    if (!isEnhanced.value || !storyScroller.value || !storyStage.value) return;

    const projectCount = featuredProjects.value.length;
    const scrollerTop =
        storyScroller.value.getBoundingClientRect().top + window.scrollY;
    const scrollDistance =
        storyScroller.value.offsetHeight - storyStage.value.offsetHeight;
    const top =
        scrollerTop +
        progressForProject(index, projectCount) * scrollDistance;

    window.scrollTo({ top, behavior: "smooth" });
};

const handleProjectOpen = (event: MouseEvent, project: PortfolioProject) => {
    void openProject(event, project);
};

const projectHref = (project: PortfolioProject) =>
    "/projects/" + project.slug;

const hasProjectImage = (project: PortfolioProject) =>
    Boolean(project.image?.trim()) && !failedImages.has(project.id);

const markImageAsFailed = (id: number) => {
    failedImages.add(id);
};

const yearOf = (project: PortfolioProject) =>
    new Date(
        project.completed_at || project.started_at || project.created_at,
    ).getFullYear();

const projectTypeLabel = (type: string) =>
    type.replace(/[-_]+/g, " ").replace(/^./, (letter) => letter.toUpperCase());

const projectOwner = (project: PortfolioProject) =>
    project.client?.name || project.repository?.owner || "Proyecto independiente";

const statusLabel = (status: string) =>
    ({
        published: "Publicado",
        in_progress: "En curso",
        archived: "Archivado",
        draft: "Borrador",
    })[status] || status;

watch(
    () => featuredProjects.value.length,
    () => {
        void nextTick(applyExperienceMode);
    },
);

onMounted(() => {
    mediaQuery = window.matchMedia(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    mediaQuery.addEventListener("change", applyExperienceMode);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    void applyExperienceMode();
});

onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", applyExperienceMode);
    window.removeEventListener("scroll", updateScrollProgress);
    window.removeEventListener("resize", updateScrollProgress);
    window.cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.project-story__stage {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
}

.project-story__header {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(92rem, 100%);
    margin-inline: auto;
    padding: 5rem 1rem 1rem;
    border-bottom: 1px solid var(--color-line);
}

.project-story__viewport {
    position: relative;
    width: min(92rem, 100%);
    min-height: calc(100svh - 9.25rem);
    margin-inline: auto;
    padding: clamp(1.25rem, 2.3vw, 2.5rem) 1rem 5.25rem;
}

.project-story__panel {
    display: grid;
    grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.45fr);
    gap: clamp(2rem, 5vw, 6rem);
    align-items: center;
    width: 100%;
    min-height: calc(100svh - 13rem);
    transform-origin: 50% 60%;
    will-change: transform, opacity, clip-path, filter;
}

.project-story__copy {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    min-height: min(34rem, 58svh);
    padding-block: clamp(0.25rem, 1.5vw, 1.5rem);
    will-change: transform, opacity, filter;
}

.project-story__eyebrow {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin: 0 0 1.5rem;
    color: var(--color-muted);
    font-size: 0.75rem;
}

.project-story__title {
    max-width: 8ch;
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(5.25rem, 8vw, 9rem);
    font-weight: 400;
    line-height: 0.7;
    letter-spacing: -0.03em;
    text-wrap: balance;
}

.project-story__summary {
    display: -webkit-box;
    max-width: 36rem;
    margin: clamp(1.5rem, 3.5vh, 2.75rem) 0 0;
    overflow: hidden;
    color: var(--color-muted);
    font-size: clamp(0.9rem, 1.1vw, 1.05rem);
    line-height: 1.75;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.project-story__metadata {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0;
    border-top: 1px solid var(--color-line);
}

.project-story__metadata > div {
    min-width: 0;
    padding: 0.85rem 0.75rem 0 0;
}

.project-story__metadata dt {
    margin-bottom: 0.35rem;
    color: var(--color-muted);
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.project-story__metadata dd {
    margin: 0;
    overflow: hidden;
    font-size: 0.75rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.project-story__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 0.8rem;
    border-radius: 0.2rem;
    color: var(--color-background);
    background: var(--color-ink);
    font-size: 0.75rem;
    font-weight: 500;
    transition:
        transform 180ms ease,
        background-color 180ms ease;
}

.project-story__cta:hover {
    transform: translateY(-2px);
    background: white;
}

.project-story__visual-link {
    display: block;
    min-width: 0;
    border-radius: 0.25rem;
    will-change: opacity, clip-path;
}

.project-story__visual {
    position: relative;
    width: 100%;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--color-line);
    border-radius: 0.25rem;
    background: var(--color-surface);
    box-shadow: 0 2.5rem 7rem rgba(0, 0, 0, 0.38);
    transition:
        border-color 200ms ease,
        transform 250ms ease;
}

.project-story__visual-link:hover .project-story__visual {
    border-color: var(--color-line-strong);
    transform: translateY(-0.2rem);
}

.project-story__windowbar {
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.4rem;
    padding-inline: 0.75rem;
    border-bottom: 1px solid var(--color-line);
    color: var(--color-muted);
    background: rgba(20, 20, 22, 0.9);
    font-size: 0.7rem;
    backdrop-filter: blur(14px);
}

.project-story__media-frame {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--color-background-secondary);
    transform-origin: 50% 50%;
    will-change: transform;
}

.project-story__media-frame :deep(.repository-fallback-cover) {
    top: 0;
}

.project-story__image-shade {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
        180deg,
        transparent 35%,
        rgba(8, 8, 9, 0.15) 58%,
        rgba(8, 8, 9, 0.88) 100%
    );
}

.project-story__image-title {
    position: absolute;
    bottom: clamp(1rem, 3vw, 2.25rem);
    left: clamp(1rem, 3vw, 2.25rem);
    z-index: 3;
    max-width: 78%;
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 7vw, 8rem);
    font-weight: 600;
    line-height: 0.7; 
}

.project-story__open-icon {
    position: absolute;
    right: clamp(1rem, 2vw, 1.5rem);
    bottom: clamp(1rem, 2vw, 1.5rem);
    z-index: 4;
    display: grid;
    width: 2.4rem;
    height: 2.4rem;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 0.2rem;
    background: rgba(8, 8, 9, 0.62);
    backdrop-filter: blur(12px);
}

.project-story__progress {
    position: absolute;
    right: max(1rem, calc((100vw - 92rem) / 2 + 1rem));
    bottom: 1.25rem;
    left: max(1rem, calc((100vw - 92rem) / 2 + 1rem));
    z-index: 25;
    display: flex;
    gap: 0.55rem;
}

.project-story__progress-item {
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    border: 0;
    color: var(--color-muted);
    background: transparent;
    font-size: 0.65rem;
    flex: 1;
    transition: color 180ms ease;
}

.project-story__progress-item i {
    position: relative;
    flex: 1;
    height: 1px;
    overflow: hidden;
    background: var(--color-line-strong);
}

.project-story__progress-item i::after {
    position: absolute;
    inset: 0;
    background: var(--color-ink);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
    content: "";
}

.project-story__progress-item.is-active {
    color: var(--color-ink);
}

.project-story__progress-item.is-active i::after {
    transform: scaleX(1);
}

.project-story__scroller.is-enhanced .project-story__stage {
    position: sticky;
    top: 0;
    height: 100svh;
}

.project-story__scroller.is-enhanced .project-story__panel {
    position: absolute;
    inset: clamp(1.25rem, 2.3vw, 2.5rem) 1rem 5.25rem;
    width: auto;
    min-height: auto;
}

.project-story__scroller.is-enhanced .project-story__panel:not(:first-child) {
    opacity: 0;
    visibility: hidden;
}

@media (min-width: 640px) {
    .project-story__header {
        padding-inline: 1.5rem;
    }

    .project-story__viewport {
        padding-inline: 1.5rem;
    }

    .project-story__scroller.is-enhanced .project-story__panel {
        right: 1.5rem;
        left: 1.5rem;
    }
}

@media (max-width: 1023px) {
    .project-story__stage {
        overflow: visible;
    }

    .project-story__header {
        padding-top: 6.5rem;
    }

    .project-story__viewport {
        display: grid;
        gap: 6rem;
        padding-top: 2.5rem;
        padding-bottom: 7rem;
    }

    .project-story__panel {
        grid-template-columns: 1fr;
        gap: 2.25rem;
        min-height: auto;
    }

    .project-story__copy {
        min-height: auto;
    }

    .project-story__title {
        max-width: 10ch;
        font-size: clamp(4.5rem, 16vw, 8rem);
    }

    .project-story__summary {
        margin-top: 1.5rem;
    }

    .project-story__metadata {
        margin-top: 2rem;
    }

    .project-story__progress {
        display: none;
    }
}

@media (max-width: 639px) {
    .project-story__header {
        flex-wrap: wrap;
        gap: 0.8rem;
    }

    .project-story__viewport {
        gap: 5rem;
    }

    .project-story__metadata {
        grid-template-columns: 1fr 1fr;
        gap: 0.8rem 0;
    }

    .project-story__metadata > div:last-child {
        grid-column: 1 / -1;
    }

    .project-story__media-frame {
        aspect-ratio: 4 / 3;
    }
}

@media (prefers-reduced-motion: reduce) {
    .project-story__panel,
    .project-story__media-frame,
    .project-story__visual,
    .project-story__cta {
        transform: none !important;
        transition: none !important;
    }
}
</style>
