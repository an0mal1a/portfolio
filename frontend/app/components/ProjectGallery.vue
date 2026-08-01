<template>
    <section
        id="work"
        class="border-b border-line px-4 py-20 sm:px-6 sm:py-28"
        aria-labelledby="work-title"
    >
        <div class="mx-auto max-w-[92rem]">
            <header
                class="mb-12 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end"
                data-reveal
            >
                <div>
                    <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                        <Layers3 :size="16" />
                        Trabajo seleccionado ·
                        {{ projects.length.toString().padStart(2, "0") }}
                    </p>
                    <h2
                        id="work-title"
                        class="m-0 font-display text-[clamp(4.5rem,9vw,9rem)] leading-[0.80] tracking-[-0.03em]"
                    >
                        Productos llevados a producción.
                    </h2>
                </div>
                <div class="border-l border-line pl-5">
                    <p class="m-0 text-sm leading-6 text-muted">
                        Cada proyecto conecta interfaz, APIs, datos, despliegue
                        y las personas que lo hicieron posible.
                    </p>
                    <NuxtLink
                        to="/projects"
                        class="mt-5 inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-raised"
                    >
                        Abrir archivo
                        <ArrowUpRight :size="16" />
                    </NuxtLink>
                </div>
            </header>

            <div
                v-if="status === 'pending'"
                class="grid gap-5 md:grid-cols-2"
                aria-live="polite"
            >
                <div
                    v-for="index in 4"
                    :key="index"
                    class="aspect-[1.28/1] animate-pulse rounded-sm bg-surface"
                />
            </div>
            <div
                v-else-if="projects.length"
                class="grid gap-x-5 gap-y-14 md:grid-cols-2"
            >
                <ProjectCard
                    v-for="(project, index) in projects.slice(0, 4)"
                    :key="project.id"
                    :project="project"
                    :index="index + 1"
                    :class="index % 2 ? 'md:mt-12' : ''"
                />
            </div>
            <div
                v-else
                class="rounded-sm border border-line bg-surface p-6 text-sm text-muted"
                data-reveal
            >
                El archivo público de proyectos se está preparando.
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Layers3 } from "@lucide/vue";
import type { AsyncDataRequestStatus } from "#app";
import type { PortfolioProject } from "~/types/portfolio";

defineProps<{
    projects: PortfolioProject[];
    status: AsyncDataRequestStatus;
}>();
</script>
