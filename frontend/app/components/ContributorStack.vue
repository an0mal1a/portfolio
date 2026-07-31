<template>
  <div
    v-if="contributors.length"
    class="flex min-h-7 items-center pl-1"
    :aria-label="`${contributors.length} colaboradores`"
  >
    <a
      v-for="person in contributors.slice(0, limit)"
      :key="person.github_login"
      :href="person.profile_url || undefined"
      :title="person.github_login"
      :aria-label="`Perfil de ${person.github_login}`"
      target="_blank"
      rel="noopener noreferrer"
      class="relative -ml-1 grid size-7 place-items-center overflow-hidden rounded-full border-2 border-surface bg-surface-raised text-[8px] font-medium text-white transition-transform hover:z-10 hover:-translate-y-1"
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
      class="relative -ml-1 grid size-7 place-items-center rounded-full border-2 border-surface bg-surface-raised text-[8px] font-medium text-white"
      >+{{ contributors.length - limit }}</b
    >
  </div>
</template>

<script setup lang="ts">
import type { Contributor } from "~/types/portfolio";
withDefaults(defineProps<{ contributors: Contributor[]; limit?: number }>(), {
  limit: 4,
});
const initials = (value: string) => value.slice(0, 2).toUpperCase();
</script>
