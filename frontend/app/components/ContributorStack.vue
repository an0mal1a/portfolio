<template>
    <div
        v-if="contributors.length"
        class="flex min-h-9 items-center pl-1"
        :aria-label="`${contributors.length} colaboradores`"
    >
        <span
            v-for="(person, index) in visibleContributors"
            :key="person.github_login"
            class="group relative inline-block transition-transform duration-200 hover:z-30 hover:-translate-y-1 focus-within:z-30 focus-within:-translate-y-1"
            :style="wrapperStyle(index)"
        >
            <a
                :href="person.profile_url || undefined"
                :title="tooltipFor(person)"
                :aria-label="`Perfil de ${person.github_login}`"
                target="_blank"
                rel="noopener noreferrer"
                class="relative grid size-8 place-items-center overflow-hidden rounded-full bg-surface-raised text-[10px] font-medium text-white transition-shadow duration-200 group-hover:shadow-lg group-focus-within:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                :style="maskStyle(index)"
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
            <!-- <span
                v-if="isOwner(person)"
                class="pointer-events-none absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-amber-400 text-amber-950 ring-2 ring-surface"
                :title="`${person.github_login} · propietario`"
                aria-hidden="true"
            >
                <Crown :size="10" :stroke-width="2.5" />
            </span> -->
        </span>
        <b
            v-if="contributors.length > limit"
            class="relative grid size-8 place-items-center rounded-full bg-surface-raised text-[10px] font-medium text-white"
            :style="badgeStyle(visibleContributors.length)"
            >+{{ contributors.length - limit }}</b
        >
    </div>
</template>

<script setup lang="ts">
import { Crown } from "@lucide/vue";
import type { Contributor } from "~/types/portfolio";

const props = withDefaults(
    defineProps<{ contributors: Contributor[]; limit?: number; owner?: string | null }>(),
    {
        limit: 4,
        owner: null,
    },
);

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

const totalContributions = computed(() =>
    props.contributors.reduce((sum, person) => sum + (person.contributions || 0), 0),
);

// z-index y solape lo lleva el wrapper; el "mordisco" (mask) va en el avatar
// para que no recorte la coronita, que vive fuera del <a> como hermano.
function wrapperStyle(index: number) {
    const style: Record<string, string> = {
        zIndex: String(totalStacked.value - index),
    };

    if (index > 0) style.marginLeft = `-${OVERLAP}px`;

    return style;
}

function maskStyle(index: number) {
    if (index === 0) return {};

    const holeCenterX = OVERLAP - SIZE / 2;
    const holeRadius = SIZE / 2 + GAP;
    const mask = `radial-gradient(circle at ${holeCenterX}px 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px 100%)`;

    return { maskImage: mask, WebkitMaskImage: mask };
}

// el badge "+N" no tiene coronita, así que puede llevar ambos estilos a la vez
function badgeStyle(index: number) {
    return { ...wrapperStyle(index), ...maskStyle(index) };
}

function isOwner(person: Contributor) {
    return !!props.owner && person.github_login.toLowerCase() === props.owner.toLowerCase();
}

function tooltipFor(person: Contributor) {
    const total = totalContributions.value;
    const pct = total > 0 ? Math.round((person.contributions / total) * 100) : 0;
    return `${person.github_login} · ${pct}% · ${person.contributions}/${total} commits`;
}

const initials = (value: string) => value.slice(0, 2).toUpperCase();
</script>