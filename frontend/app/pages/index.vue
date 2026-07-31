<template>
  <div>
    <Hero :project-count="projects.length" :client-count="clients.length" />
    <ProjectGallery :projects="projects" :status="status" />
    <SystemPreview />
    <ContactSection :send-contact="sendContact" />

    <aside
      v-if="error"
      class="fixed right-3 bottom-3 z-40 flex items-center gap-3 rounded-sm border border-line bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
      role="status"
    >
      <span>La fuente de datos no está disponible.</span>
      <button
        type="button"
        class="rounded-sm bg-ink px-2 py-1 text-xs font-medium text-background"
        @click="refresh()"
      >
        Reintentar
      </button>
    </aside>
  </div>
</template>

<script setup lang="ts">
const { projects, clients, status, error, refresh, sendContact } =
  usePortfolio();
useReveal();

useSeoMeta({
  title: "Pablo Diez — Backend y producto",
  description:
    "Ingeniero backend especializado en APIs, infraestructura y productos digitales mantenibles.",
  ogTitle: "Pablo Diez — Los sistemas detrás del producto",
  ogDescription:
    "Proyectos, arquitectura y decisiones de ingeniería detrás de este portfolio.",
  ogType: "website",
  twitterCard: "summary_large_image",
});
</script>
