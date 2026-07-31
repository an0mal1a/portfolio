<template>
  <article class="group min-w-0" data-reveal>
    <NuxtLink
      :to="`/projects/${project.slug}`"
      :aria-label="`Ver proyecto ${project.name}`"
      class="relative block aspect-[1.28/1] overflow-hidden rounded-sm border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.24)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        class="flex h-9 items-center justify-between border-b border-line px-3 text-xs text-muted"
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
      <div
        class="absolute inset-x-0 top-9 bottom-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:4rem_4rem]"
      />
      <div
        class="absolute top-[26%] right-[11%] size-[38%] rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110"
      >
        <i class="absolute inset-[20%] rounded-full border border-white/10" />
        <i
          class="absolute inset-[42%] rounded-full bg-signal shadow-[0_0_45px_rgba(229,72,77,.22)]"
        />
      </div>
      <strong
        class="absolute bottom-4 left-4 max-w-[75%] font-display text-[clamp(3rem,6vw,6.5rem)] leading-[0.72] tracking-[-0.025em]"
        >{{ project.name }}</strong
      >
      <span
        class="absolute right-4 bottom-4 grid size-8 place-items-center rounded-sm border border-line bg-background/60 text-muted transition-colors group-hover:text-ink"
        ><ArrowUpRight :size="16"
      /></span>
    </NuxtLink>

    <div class="pt-4">
      <div class="flex items-center gap-2 text-xs text-muted">
        <span>{{ yearOf(project) }}</span>
        <span class="size-1 rounded-full bg-line-strong" />
        <span v-if="project.is_featured" class="text-signal">Destacado</span>
        <span v-if="project.repository?.primary_language">{{
          project.repository.primary_language
        }}</span>
      </div>
      <NuxtLink :to="`/projects/${project.slug}`">
        <h3
          class="mt-2 mb-1.5 text-2xl font-medium tracking-[-0.04em] transition-colors group-hover:text-white/70"
        >
          {{ project.name }}
        </h3>
      </NuxtLink>
      <p class="m-0 max-w-xl text-sm leading-6 text-muted">
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

defineProps<{
  project: PortfolioProject;
  index: number;
}>();

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
