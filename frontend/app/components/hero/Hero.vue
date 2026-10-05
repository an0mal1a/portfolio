<template>
    <section
        id="top"
        class="relative overflow-hidden border-b border-line px-4 pt-32 pb-16 sm:px-6 sm:pt-36 lg:pt-40 lg:pb-20"
    >
        <div
            class="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_76%_18%,rgba(229,72,77,.08),transparent_30%)]"
        />

        <div
            class="relative mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,.62fr)] lg:items-center lg:gap-20"
        >
            <div data-reveal>
                <div class="mb-7 flex flex-wrap items-center gap-2">
                    <span
                        class="flex items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1 text-xs text-muted"
                    >
                        <Terminal :size="16" />
                        Freelance · Backend y producto
                    </span>
                    <span
                        class="flex items-center gap-2 px-2 py-1 text-xs text-ink"
                    >
                        <i class="signal-pulse size-1.5 rounded-full bg-signal" />
                        Aceptando proyectos nuevos
                    </span>
                </div>

                <h1
                    class="m-0 font-display text-[clamp(4.8rem,10.5vw,11rem)] leading-[0.78]"
                >
                    Construyo sistemas que sostienen el producto.
                </h1>

                <div
                    class="mt-9 grid max-w-3xl gap-7 border-t border-line pt-6 sm:grid-cols-[1fr_auto] sm:items-end"
                >
                    <p class="m-0 max-w-xl text-base leading-7 text-muted">
                        Desarrollador freelance en Ibiza. Diseño y construyo
                        SaaS, webs y automatizaciones para empresas que
                        necesitan que la tecnología trabaje a su favor.
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <NuxtLink
                            to="/#contact"
                            class="flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                        >
                            Cuéntame tu proyecto
                            <ArrowUpRight :size="16" />
                        </NuxtLink>
                        <NuxtLink
                            to="/projects"
                            class="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                        >
                            Ver proyectos
                            <Layers3 :size="16" />
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div
                class="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:justify-self-end"
                data-reveal
            >
                <div
                    class="relative overflow-hidden rounded-sm border border-line bg-surface shadow-[0_32px_100px_rgba(0,0,0,.4)] transition-transform duration-300 ease-out"
                    :style="cardTransform"
                    @pointermove="tilt"
                    @pointerleave="resetTilt"
                >
                    <div
                        class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
                    >
                        <span class="flex items-center gap-2">
                            <ScanFace :size="16" />
                            perfil.dev
                        </span>
                        <span class="flex items-center gap-2">
                            <i class="size-1.5 rounded-full bg-signal" />
                            En línea
                        </span>
                    </div>
                    <figure class="m-0">
                        <div
                            class="aspect-[4/5] overflow-hidden bg-background-secondary"
                        >
                            <img
                                src="/images/portfolio-color.png"
                                alt="Pablo Diez"
                                width="1122"
                                height="1402"
                                fetchpriority="high"
                                class="h-full w-full object-cover object-center"
                            />
                        </div>
                        <figcaption
                            class="flex items-end justify-between gap-4 border-t border-line px-4 py-4"
                        >
                            <p
                                class="m-0 max-w-[14rem] text-lg leading-6 font-medium tracking-[-0.03em]"
                            >
                                Infraestructura silenciosa para ideas ambiciosas.
                            </p>
                            <div
                                class="flex shrink-0 items-start gap-1.5 text-xs leading-5 text-muted"
                            >
                                <MapPin :size="14" class="mt-0.5" />
                                <span>
                                    Ibiza
                                    <span class="block tabular-nums">{{ localTime }}</span>
                                </span>
                            </div>
                        </figcaption>
                    </figure>
                </div>

                <div
                    class="absolute right-3 -bottom-4 flex items-center gap-2 rounded-sm border border-line bg-surface-raised px-2 py-1.5 text-xs text-muted shadow-xl"
                >
                    <Activity :size="16" class="text-signal" />
                    Desarrollando<a href="https://www.vestta.app" class="hover-underline -ml-1">Vestta CRM</a>
                </div>
            </div>
        </div>

        <div
            class="relative mx-auto mt-20 grid max-w-[92rem] grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4"
            data-reveal
        >
            <div
                v-for="item in stats"
                :key="item.label"
                class="bg-background-secondary p-4"
            >
                <component :is="item.icon" :size="16" class="mb-7 text-muted" />
                <strong class="block text-2xl font-medium tracking-[-0.04em]">{{
                    item.value
                }}</strong>
                <span class="mt-1 block text-xs text-muted">{{
                    item.label
                }}</span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    Activity,
    ArrowUpRight,
    Boxes,
    Database,
    Layers3,
    MapPin,
    ScanFace,
    Server,
    Terminal,
} from "@lucide/vue";

const props = defineProps<{
    projectCount: number;
    clientCount: number;
}>();

const localTime = ref("CET");
const rotate = reactive({ x: 0, y: 0 });
let timer: ReturnType<typeof setInterval> | undefined;

const cardTransform = computed(() => ({
    transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
}));

const stats = computed(() => [
    {
        icon: Boxes,
        value: props.projectCount.toString().padStart(2, "0"),
        label: "proyectos públicos",
    },
    { icon: Server, value: "03", label: "servicios desplegados" },
    {
        icon: Database,
        value: props.clientCount.toString().padStart(2, "0"),
        label: "clientes y partners",
    },
    { icon: Activity, value: "24/7", label: "sistema monitorizado" },
]);

const updateTime = () => {
    localTime.value = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date());
};

const tilt = (event: PointerEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    rotate.y = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    rotate.x = -((event.clientY - rect.top) / rect.height - 0.5) * 5;
};

const resetTilt = () => {
    rotate.x = 0;
    rotate.y = 0;
};

onMounted(() => {
    updateTime();
    timer = setInterval(updateTime, 60_000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.hover-underline {
    position: relative;
    display: inline-block;
    text-decoration: none;
}

.hover-underline::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background-color: currentColor;

    transform: scaleX(0);
    transform-origin: center;
    transition: transform 200ms ease;
}

.hover-underline:hover::after {
    transform: scaleX(1);
}
</style>
