<script setup lang="ts">
import { Clock, Languages, MapPin } from '@lucide/vue'

/** The close of every page: the invitation on the left, the form on a raised panel. */
const props = withDefaults(defineProps<{ title?: string, lead?: string, as?: 'h1' | 'h2' }>(), { title: undefined, lead: undefined, as: 'h2' })
const { t } = useI18n()
</script>

<template>
  <section id="contacto" class="contact container-x" aria-labelledby="contact-title">
    <div class="intro">
      <component :is="props.as" id="contact-title" v-reveal class="title">{{ props.title ?? t('contact.title') }}</component>
      <p class="lead mt-6 max-w-[40ch]">{{ props.lead ?? t('contact.lead') }}</p>
      <ul class="facts">
        <li><MapPin aria-hidden="true" />{{ t('contact.place') }}</li>
        <li><Languages aria-hidden="true" />{{ t('contact.languages') }}</li>
        <li><Clock aria-hidden="true" />{{ t('contact.reply') }}</li>
      </ul>
    </div>
    <div class="panel form-panel">
      <ContactForm />
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding-top: var(--section);
  padding-bottom: var(--section);
  display: grid;
  gap: 3rem clamp(2.5rem, 6vw, 6rem);
}
@media (min-width: 64rem) { .contact { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: start; } }
.title {
  max-width: 11ch;
  font-size: clamp(2.75rem, 1.4rem + 5vw, 5.75rem);
  font-weight: 760;
  line-height: 0.96;
  letter-spacing: -0.038em;
}
.facts { margin-top: 2.5rem; display: grid; gap: 0.875rem; color: var(--color-ink-2); }
.facts li { display: flex; align-items: center; gap: 0.75rem; }
.facts svg { width: 1.125rem; height: 1.125rem; color: var(--color-mute); flex: none; }
.form-panel { padding: clamp(1.5rem, 3.5vw, 3rem); }
</style>
