<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/90 backdrop-blur-xl"
  >
    <div class="mx-auto flex h-14 max-w-[92rem] items-center px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="group flex items-center gap-2.5"
        aria-label="Pablo Diez, inicio"
        @click="open = false"
      >
        <span
          class="grid size-7 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors group-hover:border-line-strong"
        >
          <Braces :size="16" :stroke-width="1.7" />
        </span>
        <span class="text-sm font-medium tracking-[-0.02em]">Pablo Diez</span>
      </NuxtLink>

      <nav
        class="mx-auto hidden items-center gap-1 md:flex"
        aria-label="Navegación principal"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="rounded-sm px-2 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-ink"
          active-class="!bg-surface !text-ink"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <span
          class="hidden items-center gap-2 px-2 py-1 text-xs text-muted lg:flex"
        >
          <i class="size-1.5 rounded-full bg-signal" />
          Disponible para proyectos
        </span>
        <NuxtLink
          to="/#contact"
          class="hidden items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-line-strong hover:bg-surface-raised sm:flex"
        >
          Hablemos
          <ArrowUpRight :size="16" />
        </NuxtLink>
        <button
          type="button"
          class="grid size-8 place-items-center rounded-sm border border-line bg-surface md:hidden"
          :aria-expanded="open"
          aria-label="Abrir navegación"
          @click="open = !open"
        >
          <X v-if="open" :size="16" />
          <Menu v-else :size="16" />
        </button>
      </div>
    </div>

    <nav
      v-if="open"
      class="grid gap-1 border-t border-line bg-background p-3 md:hidden"
      aria-label="Navegación móvil"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between rounded-sm px-2 py-2 text-xs text-muted hover:bg-surface hover:text-ink"
        @click="open = false"
      >
        {{ item.label }}
        <ChevronRight :size="16" />
      </NuxtLink>
      <NuxtLink
        to="/#contact"
        class="mt-1 flex items-center justify-between rounded-sm bg-ink px-2 py-2 text-xs font-medium text-background"
        @click="open = false"
      >
        Empezar una conversación
        <ArrowUpRight :size="16" />
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ArrowUpRight, Braces, ChevronRight, Menu, X } from "@lucide/vue";

const open = ref(false);

const items = [
  { label: "Inicio", to: "/" },
  { label: "Proyectos", to: "/projects" },
  { label: "Sistema", to: "/system" },
];
</script>
