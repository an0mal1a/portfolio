<template>
    <div
        class="repository-fallback-cover absolute inset-x-0 top-9 bottom-0 isolate overflow-hidden bg-background-secondary"
        :style="{ '--repository-accent': accentColor }"
    >
        <div class="repository-grid absolute inset-0" aria-hidden="true" />

        <span class="repository-monogram" aria-hidden="true">{{ monogram }}</span>

        <svg
            class="repository-diagram absolute inset-0 size-full"
            viewBox="0 0 520 300"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
        >
            <g v-if="diagramVariant === 0">
                <path class="repository-wire" d="M74 156H210M210 156L302 92M210 156L302 222M302 92H436M302 222H436" />
                <rect class="repository-module" x="46" y="134" width="58" height="44" rx="6" />
                <rect class="repository-module" x="420" y="72" width="64" height="40" rx="6" />
                <rect class="repository-module" x="420" y="202" width="64" height="40" rx="6" />
                <circle class="repository-accent-fill" cx="210" cy="156" r="8" />
                <circle class="repository-node" cx="302" cy="92" r="5" />
                <circle class="repository-node" cx="302" cy="222" r="5" />
            </g>

            <g v-else-if="diagramVariant === 1">
                <path class="repository-wire" d="M54 104H144V152H258V206H452M258 152H392" />
                <rect class="repository-module" x="42" y="84" width="58" height="40" rx="6" />
                <rect class="repository-module" x="138" y="132" width="56" height="40" rx="6" />
                <rect class="repository-module" x="380" y="132" width="72" height="40" rx="6" />
                <circle class="repository-accent-fill" cx="258" cy="152" r="8" />
                <circle class="repository-node" cx="258" cy="206" r="5" />
                <circle class="repository-node" cx="452" cy="206" r="5" />
            </g>

            <g v-else-if="diagramVariant === 2">
                <path class="repository-wire" d="M90 74V220H230M230 220V92H398M230 220H448" />
                <rect class="repository-module" x="68" y="52" width="44" height="44" rx="6" />
                <rect class="repository-module" x="376" y="72" width="64" height="40" rx="6" />
                <rect class="repository-module" x="424" y="200" width="50" height="40" rx="6" />
                <circle class="repository-accent-fill" cx="230" cy="220" r="8" />
                <circle class="repository-node" cx="230" cy="92" r="5" />
                <circle class="repository-node" cx="90" cy="220" r="5" />
            </g>

            <g v-else-if="diagramVariant === 3">
                <path class="repository-wire" d="M88 150H174L244 86L326 150L400 90M244 86V226M244 226H448" />
                <rect class="repository-module" x="58" y="128" width="56" height="44" rx="6" />
                <rect class="repository-module" x="378" y="70" width="54" height="40" rx="6" />
                <rect class="repository-module" x="424" y="206" width="52" height="40" rx="6" />
                <circle class="repository-accent-fill" cx="244" cy="86" r="8" />
                <circle class="repository-node" cx="326" cy="150" r="5" />
                <circle class="repository-node" cx="244" cy="226" r="5" />
            </g>

            <g v-else>
                <path class="repository-wire" d="M70 212L146 136L238 188L316 104L446 152M146 136V70M238 188V240M316 104H398" />
                <rect class="repository-module" x="118" y="50" width="56" height="40" rx="6" />
                <rect class="repository-module" x="370" y="84" width="58" height="40" rx="6" />
                <circle class="repository-accent-fill" cx="316" cy="104" r="8" />
                <circle class="repository-node" cx="70" cy="212" r="5" />
                <circle class="repository-node" cx="238" cy="240" r="5" />
                <circle class="repository-node" cx="446" cy="152" r="5" />
            </g>
        </svg>

        <div class="absolute right-14 bottom-2 left-4 z-10 min-w-0">
            <p class="m-0 font-display text-[clamp(1.8rem,4.2vw,4.6rem)] leading-[0.72] font-semibold text-ink">
                <span class="block">{{ displayLabel }}</span>
            </p>
            <p class="mt-3 mb-0 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-medium tracking-[0.08em] text-muted uppercase">
                <span v-if="archived" class="text-signal">Archivado</span>
                <span v-if="archived" aria-hidden="true">·</span>
                <span>{{ categoryLabel }}</span>
                <span aria-hidden="true">·</span>
                <span :style="{ color: accentColor }">{{ languageLabel }}</span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project, Repository } from "~/types/portfolio";

const props = defineProps<{
    name: Project["name"];
    displayName?: Repository["display_name"] | null;
    language?: Repository["primary_language"] | null;
    projectType: Project["project_type"];
    archived: boolean;
}>();

const stableHash = (value: string) => {
    let hash = 0;

    for (const character of value) {
        hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    }

    return hash;
};

const displayLabel = computed(
    () => props.displayName?.trim() || props.name.trim() || "repository",
);

const splitName = (value: string) =>
    value
        .split(/[\s_-]+/)
        .map((part) => part.trim())
        .filter(Boolean);
 
const monogramParts = computed(() => splitName(props.name));

const monogram = computed(() => {
    const parts = monogramParts.value;

    if (parts.length > 1) {
        return parts
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    }

    return (parts[0] || "RE").slice(0, 2).toUpperCase();
});

const diagramVariant = computed(
    () => stableHash(`${props.name}:${props.projectType}`) % 5,
);

const languageLabel = computed(() => props.language?.trim() || "SYSTEM");

const categoryLabel = computed(() => {
    const labels: Record<string, string> = {
        automation: "AUTOMATION",
        saas: "PRODUCT SYSTEM",
        tool: "SYSTEM TOOLING",
        web: "WEB PLATFORM",
    };

    return (
        labels[props.projectType.toLowerCase()] ||
        props.projectType.replace(/[-_]+/g, " ").toUpperCase()
    );
});

const accentColor = computed(() => {
    const colors: Record<string, string> = {
        c: "#8290a5",
        "c++": "#8290a5",
        go: "#5daab8",
        javascript: "#c49a53",
        php: "#8b7eb8",
        python: "#c0a34d",
        rust: "#c8734d",
        typescript: "#5a8cc4",
        vue: "#5f9c7d",
    };

    return colors[props.language?.trim().toLowerCase() || ""] || "#b55b61";
});
</script>

<style scoped>
.repository-grid {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
    background-size: 4rem 4rem;
    mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.45));
}

.repository-monogram {
    position: absolute;
    top: 7%;
    right: 5%;
    color: transparent;
    font-family: var(--font-display);
    font-size: clamp(7rem, 22vw, 16rem);
    font-weight: 600;
    line-height: 0.72;
    opacity: 0.22;
    pointer-events: none;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.25);
    text-stroke: 1px rgba(255, 255, 255, 0.25);
}

.repository-diagram {
    opacity: 0.78;
    pointer-events: none;
}

.repository-wire {
    stroke: rgba(255, 255, 255, 0.15);
    stroke-width: 1.25;
}

.repository-module {
    fill: rgba(255, 255, 255, 0.025);
    stroke: rgba(255, 255, 255, 0.18);
    stroke-width: 1.25;
}

.repository-node {
    fill: var(--color-background-secondary);
    stroke: rgba(255, 255, 255, 0.28);
    stroke-width: 1.25;
}

.repository-accent-fill {
    fill: var(--repository-accent);
    stroke: var(--repository-accent);
    stroke-width: 1.25;
}

@media (prefers-reduced-motion: reduce) {
    .repository-fallback-cover,
    .repository-fallback-cover * {
        transition-duration: 0ms !important;
    }
}
</style>
