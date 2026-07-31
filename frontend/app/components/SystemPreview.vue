<template>
  <section
    class="border-b border-line px-3 py-20 sm:px-6 sm:py-28"
    aria-labelledby="system-preview-title"
  >
    <div
      class="soft-noise relative mx-auto max-w-[92rem] overflow-hidden rounded-sm border border-line bg-background-secondary shadow-[0_30px_100px_rgba(0,0,0,.32)]"
      data-reveal
    >
      <div
        class="flex h-11 items-center justify-between border-b border-line px-3 text-xs text-muted"
      >
        <span class="flex items-center gap-2"
          ><PanelLeft :size="16" />impablo.dev / sistema</span
        >
        <span class="hidden items-center gap-2 sm:flex"
          ><i class="size-1.5 rounded-full bg-emerald-500" />Todos los servicios
          operativos</span
        >
        <span>v2.1</span>
      </div>

      <div class="grid min-h-[38rem] md:grid-cols-[13rem_1fr]">
        <aside class="hidden border-r border-line bg-background p-2 md:block">
          <p class="px-2 py-1 text-xs text-muted">Plataforma</p>
          <nav class="mt-1 space-y-0.5 text-xs">
            <a
              v-for="(item, index) in nav"
              :key="item.label"
              href="#system-map"
              class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
              :class="index === 0 ? '!bg-surface !text-ink' : ''"
            >
              <component :is="item.icon" :size="16" />
              {{ item.label }}
            </a>
          </nav>
        </aside>

        <div
          id="system-map"
          class="relative flex flex-col justify-between p-5 sm:p-8 lg:p-10"
        >
          <div
            class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div class="max-w-3xl">
              <p class="mb-4 flex items-center gap-2 text-xs text-signal">
                <Network :size="16" />Dentro del sistema
              </p>
              <h2
                id="system-preview-title"
                class="m-0 max-w-[11ch] font-display text-[clamp(4.5rem,8vw,8rem)] leading-[0.72] tracking-[-0.03em]"
              >
                El portfolio también es un producto.
              </h2>
            </div>
            <p class="m-0 max-w-sm text-sm leading-6 text-muted">
              Una vista pública de la aplicación, las APIs, los datos y la
              infraestructura que mantiene esta web en producción.
            </p>
          </div>

          <div class="my-10 grid gap-2 lg:grid-cols-3">
            <article
              v-for="node in nodes"
              :key="node.title"
              class="rounded-sm border border-line bg-surface p-3 transition-colors hover:bg-surface-raised"
            >
              <div class="mb-8 flex items-center justify-between">
                <span
                  class="grid size-8 place-items-center rounded-sm border border-line bg-background-secondary"
                  ><component :is="node.icon" :size="16"
                /></span>
                <span class="flex items-center gap-2 text-xs text-muted"
                  ><i
                    class="size-1.5 rounded-full bg-emerald-500"
                  />Activo</span
                >
              </div>
              <strong class="block text-sm font-medium">{{
                node.title
              }}</strong>
              <span class="mt-1 block text-xs text-muted">{{
                node.detail
              }}</span>
            </article>
          </div>

          <NuxtLink
            to="/system"
            class="inline-flex w-fit items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Abrir documentación
            <ArrowUpRight :size="16" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Braces,
  Container,
  Database,
  Network,
  PanelLeft,
  Server,
  ShieldCheck,
} from "@lucide/vue";

const nav = [
  { label: "Vista general", icon: Activity },
  { label: "Frontend", icon: Braces },
  { label: "API pública", icon: Server },
  { label: "Base de datos", icon: Database },
  { label: "Docker", icon: Container },
  { label: "Seguridad", icon: ShieldCheck },
];

const nodes = [
  { icon: Braces, title: "Interfaz Nuxt", detail: "Vue · Tailwind · SSR" },
  {
    icon: Boxes,
    title: "Servicios de aplicación",
    detail: "Axum API · Worker FastAPI",
  },
  {
    icon: Database,
    title: "Capa de datos",
    detail: "Portfolio · Contacto · Repositorios",
  },
];
</script>
