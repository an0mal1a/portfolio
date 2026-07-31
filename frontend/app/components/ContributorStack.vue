<template>
  <div v-if="contributors.length" class="contributors" :aria-label="`${contributors.length} contributors`">
    <a
      v-for="person in contributors.slice(0, limit)"
      :key="person.github_login"
      :href="person.profile_url || undefined"
      :title="person.github_login"
      :aria-label="`GitHub profile: ${person.github_login}`"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop
    >
      <img v-if="person.avatar_url" :src="person.avatar_url" :alt="person.github_login" loading="lazy">
      <span v-else>{{ initials(person.github_login) }}</span>
    </a>
    <b v-if="contributors.length > limit">+{{ contributors.length - limit }}</b>
  </div>
</template>

<script setup lang="ts">
import type { Contributor } from '~/types/portfolio'
withDefaults(defineProps<{ contributors: Contributor[]; limit?: number }>(), { limit: 4 })
const initials = (value: string) => value.slice(0, 2).toUpperCase()
</script>

<style scoped>
.contributors { display: flex; min-height: 2rem; padding-left: .35rem; align-items: center; }
.contributors a, .contributors b { display: grid; width: 2rem; aspect-ratio: 1; margin-left: -.35rem; overflow: hidden; place-items: center; border: 2px solid var(--paper-raised); border-radius: 50%; color: var(--ink-soft); background: #252525; font-family: var(--font-mono); font-size: .5rem; font-weight: 700; }
.contributors a { position: relative; transition: transform .2s ease, z-index .2s ease; }
.contributors a:hover { z-index: 2; transform: translateY(-.2rem); }
.contributors img { width: 100%; height: 100%; object-fit: cover; }
.contributors b { position: relative; margin-left: -.25rem; }
</style>
