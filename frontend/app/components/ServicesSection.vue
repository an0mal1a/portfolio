<template>
    <section
        id="services"
        class="scroll-mt-14 border-b border-line px-4 py-20 sm:px-6 sm:py-28"
        aria-labelledby="services-title"
    >
        <div class="mx-auto max-w-[92rem]">
            <header
                class="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[1fr_24rem] lg:items-end"
                data-reveal
            >
                <div>
                    <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                        <BriefcaseBusiness :size="16" />
                        Servicios
                    </p>
                    <h2
                        id="services-title"
                        class="m-0 max-w-[13ch] font-display text-[clamp(4rem,7.5vw,7.5rem)] leading-[0.74] tracking-[-0.03em]"
                    >
                        En qué te puedo ayudar.
                    </h2>
                </div>
                <div class="border-l border-line pl-5">
                    <p class="m-0 text-sm leading-6 text-muted">
                        Trabajo como desarrollador freelance con empresas que
                        necesitan algo más que una web bonita: herramientas que
                        su equipo use cada día y sistemas que no se caigan
                        cuando el negocio crece.
                    </p>
                </div>
            </header>

            <div class="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2">
                <article
                    v-for="(service, index) in services"
                    :key="service.title"
                    class="group flex flex-col bg-background-secondary p-5 transition-colors duration-300 hover:bg-surface sm:p-7"
                    data-reveal
                    :style="{ '--reveal-delay': `${(index % 2) * 80}ms` }"
                >
                    <div class="flex items-center justify-between">
                        <span
                            class="grid size-9 place-items-center rounded-sm border border-line bg-surface text-muted transition-colors group-hover:border-line-strong group-hover:text-signal"
                        >
                            <component :is="service.icon" :size="17" />
                        </span>
                        <span class="text-xs text-muted tabular-nums">{{
                            padNumber(index + 1)
                        }}</span>
                    </div>

                    <h3
                        class="mt-10 mb-0 text-[1.65rem] leading-tight font-medium tracking-[-0.04em] sm:mt-14"
                    >
                        {{ service.title }}
                    </h3>
                    <p class="mt-3 mb-0 max-w-lg text-sm leading-6 text-muted">
                        {{ service.text }}
                    </p>

                    <ul
                        class="mt-6 mb-0 grid list-none gap-2 p-0 text-xs text-ink sm:grid-cols-3"
                    >
                        <li
                            v-for="item in service.includes"
                            :key="item"
                            class="flex items-start gap-2 border-t border-line pt-2"
                        >
                            <Check
                                :size="14"
                                class="mt-px shrink-0 text-signal"
                            />
                            {{ item }}
                        </li>
                    </ul>

                    <div
                        v-if="examplesFor(service).length"
                        class="mt-auto flex flex-wrap items-center gap-2 pt-8 text-xs"
                    >
                        <span class="mr-1 text-muted">Ejemplos</span>
                        <NuxtLink
                            v-for="example in examplesFor(service)"
                            :key="example.to"
                            :to="example.to"
                            class="inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2 py-1 text-muted transition-colors hover:border-line-strong hover:text-ink"
                        >
                            {{ example.label }}
                            <ArrowUpRight :size="13" />
                        </NuxtLink>
                    </div>
                </article>
            </div>

            <div
                class="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16"
            >
                <div data-reveal>
                    <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                        <Route :size="16" />
                        Cómo trabajo
                    </p>
                    <h3
                        id="process-title"
                        class="m-0 font-display text-[clamp(3.2rem,5vw,4.75rem)] leading-[0.8] font-normal tracking-[-0.025em]"
                    >
                        Sin cajas negras.
                    </h3>
                    <p class="mt-5 mb-0 text-sm leading-6 text-muted">
                        Hablas directamente con quien diseña y escribe el
                        código. Sin intermediarios ni sorpresas en la factura.
                    </p>
                    <NuxtLink
                        to="/#contact"
                        class="mt-6 inline-flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                    >
                        Cuéntame tu proyecto
                        <ArrowUpRight :size="16" />
                    </NuxtLink>
                </div>

                <ol class="m-0 grid list-none gap-px p-0 sm:grid-cols-2 xl:grid-cols-4">
                    <li
                        v-for="(step, index) in process"
                        :key="step.title"
                        class="relative border-t border-line pt-5 sm:pr-6"
                        data-reveal
                        :style="{ '--reveal-delay': `${index * 90}ms` }"
                    >
                        <span
                            class="absolute -top-[3px] left-0 size-1.5 rounded-full"
                            :class="index === 0 ? 'bg-signal' : 'bg-line-strong'"
                            aria-hidden="true"
                        />
                        <span class="text-xs text-muted tabular-nums">{{
                            padNumber(index + 1)
                        }}</span>
                        <strong
                            class="mt-6 block text-base font-medium tracking-[-0.02em]"
                            >{{ step.title }}</strong
                        >
                        <p class="mt-2 mb-6 text-xs leading-5 text-muted">
                            {{ step.text }}
                        </p>
                    </li>
                </ol>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    AppWindow,
    ArrowUpRight,
    Boxes,
    BriefcaseBusiness,
    Check,
    Route,
    Server,
    Workflow,
} from "@lucide/vue";
import type { PortfolioProject } from "~/types/portfolio";

const props = defineProps<{
    projects: PortfolioProject[];
}>();

interface Service {
    icon: typeof Boxes;
    title: string;
    text: string;
    includes: string[];
    // Slugs de proyectos públicos que sirven como prueba del servicio.
    examples: string[];
    extra?: { label: string; to: string };
}

const services: Service[] = [
    {
        icon: Boxes,
        title: "Producto SaaS a medida",
        text: "De la idea al producto en producción: modelo de datos, paneles, permisos, integraciones y despliegue. Pensado para que tu equipo lo use todos los días.",
        includes: [
            "Arquitectura y datos",
            "Roles y multiempresa",
            "Despliegue y monitorización",
        ],
        examples: ["vestta", "brisa-saas"],
    },
    {
        icon: AppWindow,
        title: "Webs que generan negocio",
        text: "Webs corporativas y escaparates rápidos, con carácter propio y conectados a tus herramientas para que cada visita pueda acabar en cliente.",
        includes: [
            "Diseño a medida",
            "SEO técnico y rendimiento",
            "Formularios y CRM conectados",
        ],
        examples: ["postproducciones-web", "tierradeibiza-web", "nextlevelapps-web"],
    },
    {
        icon: Workflow,
        title: "Automatización e IA aplicada",
        text: "Procesos que hoy se hacen a mano —WhatsApp, turnos, avisos, informes— convertidos en flujos fiables. IA donde aporta y límites claros donde hace falta.",
        includes: [
            "Bots de WhatsApp",
            "Integraciones entre herramientas",
            "Agentes con acciones verificadas",
        ],
        examples: ["alcobert"],
    },
    {
        icon: Server,
        title: "Backend, APIs e infraestructura",
        text: "APIs, bases de datos, Docker y servidores para que lo que ya tienes escale, sea seguro y no dependa de la suerte. También rescates y auditorías.",
        includes: [
            "APIs en Rust y Python",
            "PostgreSQL bien modelado",
            "Docker y despliegues",
        ],
        examples: ["self-debrid"],
        extra: { label: "Este portfolio", to: "/system" },
    },
];

const process = [
    {
        title: "Diagnóstico",
        text: "Una conversación para entender el negocio, el problema y qué significa que salga bien.",
    },
    {
        title: "Propuesta clara",
        text: "Alcance, plazos y presupuesto por escrito antes de escribir una línea de código.",
    },
    {
        title: "Construcción visible",
        text: "Entregas frecuentes que puedes probar. Ves el avance desde la primera semana.",
    },
    {
        title: "Lanzamiento y soporte",
        text: "Despliegue, monitorización y acompañamiento cuando el producto ya está en uso.",
    },
];

const examplesFor = (service: Service) => {
    const linked = service.examples
        .map((slug) => props.projects.find((project) => project.slug === slug))
        .filter((project): project is PortfolioProject => Boolean(project))
        .map((project) => ({
            label: project.name,
            to: `/projects/${project.slug}`,
        }));

    return service.extra ? [...linked, service.extra] : linked;
};
</script>
