<template>
    <div class="absolute inset-0 overflow-hidden bg-background-secondary">
        <img
            v-if="hasImage"
            :data-project-cover="transitionSource ? '' : undefined"
            :src="project.image || undefined"
            :alt="alt ?? `Vista previa del proyecto ${project.name}`"
            class="absolute inset-0 size-full object-cover"
            :class="imageClass"
            :loading="eager ? 'eager' : 'lazy'"
            :fetchpriority="eager ? 'high' : undefined"
            decoding="async"
            @error="failed = true"
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
            :compact="compact"
        />
    </div>
</template>

<script setup lang="ts">
import type { PortfolioProject } from "~/types/portfolio";

const props = withDefaults(
    defineProps<{
        project: PortfolioProject;
        eager?: boolean;
        compact?: boolean;
        alt?: string;
        imageClass?: string;
        // Solo una portada por enlace debe actuar como origen de la
        // transición compartida hacia el detalle.
        transitionSource?: boolean;
    }>(),
    {
        eager: false,
        compact: false,
        alt: undefined,
        imageClass: "",
        transitionSource: true,
    },
);

const failed = ref(false);
const hasImage = computed(
    () => Boolean(props.project.image?.trim()) && !failed.value,
);

watch(
    () => props.project.image,
    () => {
        failed.value = false;
    },
);
</script>
