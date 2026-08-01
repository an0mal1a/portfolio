<template>
    <section
        v-if="clients.length"
        class="overflow-hidden border-b border-line px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
        aria-labelledby="clients-title"
    >
        <div class="mx-auto max-w-[92rem]">
            <header
                class="mb-10 grid gap-6 sm:mb-12 lg:grid-cols-[1fr_24rem] lg:items-end"
                data-reveal
            >
                <div>
                    <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                        <Handshake :size="16" />
                        Clientes y colaboraciones
                    </p>
                    <h2
                        id="clients-title"
                        class="m-0 max-w-[16ch] font-display text-[clamp(4rem,7.5vw,7.5rem)] leading-[0.74] tracking-[-0.03em]"
                    >
                        Confianza construida proyecto a proyecto.
                    </h2>
                </div>

                <div class="border-l border-line pl-5">
                    <strong
                        class="block text-3xl font-medium tracking-[-0.04em]"
                    >
                        {{ clients.length.toString().padStart(2, "0") }}
                    </strong>
                    <p class="mt-2 mb-0 text-sm leading-6 text-muted">
                        Equipos con los que he convertido necesidades complejas
                        en productos que funcionan.
                    </p>
                </div>
            </header>

            <div
                class="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:grid-cols-6"
                role="list"
                aria-label="Listado de clientes"
                data-reveal
            >
                <component
                    :is="client.website ? 'a' : 'article'"
                    v-for="(client, index) in clients"
                    :key="client.id"
                    :href="client.website || undefined"
                    :target="client.website ? '_blank' : undefined"
                    :rel="client.website ? 'noopener noreferrer' : undefined"
                    class="group relative col-span-1 flex min-h-40 flex-col justify-between overflow-hidden rounded-sm border border-line bg-surface p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-raised sm:col-span-2 lg:col-span-2"
                    :class="positionClasses(index)"
                    role="listitem"
                    :aria-label="
                        client.website ? `Visitar ${client.name}` : client.name
                    "
                >
                    <div
                        class="flex items-center justify-between text-xs text-muted"
                    >
                        <span>{{
                            (index + 1).toString().padStart(2, "0")
                        }}</span>
                        <ArrowUpRight
                            v-if="client.website"
                            :size="16"
                            class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                        />
                        <Building2 v-else :size="16" />
                    </div>

                    <div class="flex min-h-16 items-center justify-center px-4">
                        <img
                            v-if="
                                client.logo_url && !failedLogos.has(client.id)
                            "
                            :src="client.logo_url"
                            :alt="`Logo de ${client.name}`"
                            loading="lazy"
                            class="max-h-10 w-auto max-w-[11rem] object-contain opacity-65 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                            @error="markLogoFailed(client.id)"
                        />
                        <span
                            v-else
                            class="text-center text-xl font-medium tracking-[-0.04em] text-white/70 transition-colors group-hover:text-ink"
                        >
                            {{ client.name }}
                        </span>
                    </div>

                    <div
                        class="flex items-center justify-between border-t border-line pt-2 text-xs text-muted"
                    >
                        <span class="truncate">{{ client.name }}</span>
                        <span class="ml-3 flex shrink-0 items-center gap-2">
                            <i class="size-1.5 rounded-full bg-signal" />
                            Proyecto entregado
                        </span>
                    </div>
                </component>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Building2, Handshake } from "@lucide/vue";
import type { Client } from "~/types/portfolio";

const props = defineProps<{
    clients: Client[];
}>();

const failedLogos = reactive(new Set<number>());

const markLogoFailed = (clientId: number) => {
    failedLogos.add(clientId);
};

const positionClasses = (index: number) => {
    const total = props.clients.length;
    const tabletRemainder = total % 2;
    const desktopRemainder = total % 3;
    const classes: string[] = [];

    if (tabletRemainder === 1 && index === total - 1) {
        classes.push("sm:col-start-2");
    }

    if (desktopRemainder === 1 && index === total - 1) {
        classes.push("lg:col-start-3");
    }

    if (desktopRemainder === 2 && index === total - 2) {
        classes.push("lg:col-start-2");
    }

    return classes;
};
</script>
