<template>
    <div
        v-if="contributors.length"
        class="flex min-h-9 items-center pl-1"
        :aria-label="`${contributors.length} colaboradores`"
    >
        <a
            v-for="(person, index) in visibleContributors"
            :key="person.github_login"
            :href="person.profile_url || undefined"
            :title="person.github_login"
            :aria-label="`Perfil de ${person.github_login}`"
            target="_blank"
            rel="noopener noreferrer"
            class="relative grid size-8 place-items-center overflow-hidden rounded-full bg-surface-raised text-[10px] font-medium text-white transition-transform duration-200 hover:z-30 hover:-translate-y-1 hover:shadow-lg focus-visible:z-30 focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            :style="stackStyle(index)"
            @click.stop
        >
            <img
                v-if="person.avatar_url"
                :src="person.avatar_url"
                :alt="person.github_login"
                loading="lazy"
                class="size-full object-cover"
            />
            <span v-else>{{ initials(person.github_login) }}</span>
        </a>
        <b
            v-if="contributors.length > limit"
            class="relative grid size-8 place-items-center rounded-full bg-surface-raised text-[10px] font-medium text-white"
            :style="stackStyle(visibleContributors.length)"
            >+{{ contributors.length - limit }}</b
        >
    </div>
</template>

<script setup lang="ts">
import type { Contributor } from "~/types/portfolio";

const props = withDefaults(defineProps<{ contributors: Contributor[]; limit?: number }>(), {
    limit: 4,
});

// tamaño del avatar, cuánto se superponen y el hueco extra del "mordisco"
const SIZE = 32;
const OVERLAP = 12;
const GAP = 3;

const visibleContributors = computed(() =>
    props.contributors.slice(0, props.limit),
);

const totalStacked = computed(() =>
    visibleContributors.value.length + (props.contributors.length > props.limit ? 1 : 0),
);

function stackStyle(index: number) {
    const style: Record<string, string> = {
        zIndex: String(totalStacked.value - index),
    };

    if (index === 0) return style;

    const holeCenterX = OVERLAP - SIZE / 2;
    const holeRadius = SIZE / 2 + GAP;
    const mask = `radial-gradient(circle at ${holeCenterX}px 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px 100%)`;

    style.marginLeft = `-${OVERLAP}px`;
    style.maskImage = mask;
    style.WebkitMaskImage = mask;

    return style;
}

const initials = (value: string) => value.slice(0, 2).toUpperCase();
</script>