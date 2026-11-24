<script setup lang="ts">
import { ArrowRight, Check, LoaderCircle } from '@lucide/vue'

/**
 * Lead form. Posts straight to the Rust API from the browser (per-visitor rate
 * limit). Every state is spoken through a live region.
 */
const props = withDefaults(defineProps<{ idPrefix?: string }>(), { idPrefix: 'contact' })
const { t } = useI18n()
const localePath = useLocalePath()
const { state, error, retryAfter, send, reset } = useContactForm()

const kinds = ['web', 'software', 'automation', 'other'] as const
type Kind = typeof kinds[number]

const form = reactive({ kind: 'web' as Kind, name: '', email: '', phone: '', message: '', consent: false, website: '' })
const touched = reactive({ name: false, email: false, message: false, consent: false })

const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
const errors = computed(() => ({
  name: form.name.trim().length < 2 ? t('form.errors.name') : '',
  email: !emailOk.value ? t('form.errors.email') : '',
  message: form.message.trim().length < 20 ? t('form.errors.message') : '',
  consent: !form.consent ? t('form.errors.consent') : '',
}))
const valid = computed(() => Object.values(errors.value).every(e => !e))

const id = (name: string) => `${props.idPrefix}-${name}`

async function submit() {
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))
  if (!valid.value) {
    const first = (['name', 'email', 'message', 'consent'] as const).find(k => errors.value[k])
    if (first) document.getElementById(id(first))?.focus()
    return
  }
  // Honeypot: bots fill hidden fields. Pretend it went through.
  if (form.website) { state.value = 'sent'; return }
  await send({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || undefined,
    subject: `${t(`form.kinds.${form.kind}`)} · ${form.name.trim()}`,
    message: form.message.trim(),
  })
}

function again() {
  form.message = ''
  touched.message = false
  reset()
}

const errorText = computed(() => {
  if (!error.value) return ''
  if (error.value === 'rate_limited') return t('form.status.rateLimited', { s: retryAfter.value ?? 60 })
  if (error.value === 'invalid_mail') return t('form.status.invalidMail')
  if (error.value === 'network_error') return t('form.status.network')
  return t('form.status.failed')
})
</script>

<template>
  <div class="contact-form">
    <div v-if="state === 'sent'" class="sent" role="status">
      <span class="sent-mark"><Check aria-hidden="true" /></span>
      <p class="mt-6 text-[2rem] font-bold leading-tight tracking-[-0.03em]">{{ t('form.status.sentTitle') }}</p>
      <p class="mt-3 max-w-[46ch] text-ink-2">{{ t('form.status.sent') }}</p>
      <button type="button" class="again" @click="again">{{ t('form.again') }}</button>
    </div>

    <form v-else novalidate class="grid gap-6" @submit.prevent="submit">
      <fieldset>
        <legend class="label mb-3">{{ t('form.kind') }}</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="k in kinds" :key="k" class="chip">
            <input v-model="form.kind" type="radio" :name="id('kind')" :value="k" class="sr-only">
            <span class="chip-face">{{ t(`form.kinds.${k}`) }}</span>
          </label>
        </div>
      </fieldset>

      <div class="grid gap-6 sm:grid-cols-2">
        <div class="field">
          <label :for="id('name')" class="label">{{ t('form.name') }}</label>
          <input :id="id('name')" v-model="form.name" type="text" autocomplete="name" required :aria-invalid="touched.name && !!errors.name" :aria-describedby="id('name-err')" @blur="touched.name = true">
          <p :id="id('name-err')" class="field-error">{{ touched.name ? errors.name : '' }}</p>
        </div>
        <div class="field">
          <label :for="id('email')" class="label">{{ t('form.email') }}</label>
          <input :id="id('email')" v-model="form.email" type="email" autocomplete="email" inputmode="email" required :aria-invalid="touched.email && !!errors.email" :aria-describedby="id('email-err')" @blur="touched.email = true">
          <p :id="id('email-err')" class="field-error">{{ touched.email ? errors.email : '' }}</p>
        </div>
      </div>

      <div class="field">
        <label :for="id('phone')" class="label">{{ t('form.phone') }} <span class="text-mute">({{ t('form.optional') }})</span></label>
        <input :id="id('phone')" v-model="form.phone" type="tel" autocomplete="tel" inputmode="tel">
      </div>

      <div class="field">
        <label :for="id('message')" class="label">{{ t('form.message') }}</label>
        <textarea :id="id('message')" v-model="form.message" rows="5" required :placeholder="t('form.messagePlaceholder')" :aria-invalid="touched.message && !!errors.message" :aria-describedby="id('message-err')" @blur="touched.message = true" />
        <p :id="id('message-err')" class="field-error">{{ touched.message ? errors.message : '' }}</p>
      </div>

      <div class="sr-only" aria-hidden="true">
        <label :for="id('website')">Website</label>
        <input :id="id('website')" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
      </div>

      <div>
        <label class="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug text-ink-2">
          <input :id="id('consent')" v-model="form.consent" type="checkbox" class="check mt-0.5 flex-none" :aria-invalid="touched.consent && !!errors.consent" :aria-describedby="id('consent-err')" @change="touched.consent = true">
          <span>
            {{ t('form.consent') }}
            <NuxtLink :to="localePath('privacy')" class="text-ink underline underline-offset-4">{{ t('form.privacy') }}</NuxtLink>.
          </span>
        </label>
        <p :id="id('consent-err')" class="field-error">{{ touched.consent ? errors.consent : '' }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
        <UiButton type="submit" size="md" :disabled="state === 'sending'">
          {{ state === 'sending' ? t('form.sending') : t('form.submit') }}
          <template #icon>
            <LoaderCircle v-if="state === 'sending'" class="animate-spin" aria-hidden="true" />
            <ArrowRight v-else aria-hidden="true" />
          </template>
        </UiButton>
        <p class="text-[0.9375rem] text-error" role="alert">{{ state === 'error' ? errorText : '' }}</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink-2); }
.field { display: grid; gap: 0.5rem; }
.field input,
.field textarea {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--color-line);
  background: rgb(238 234 227 / 0.04);
  padding: 0.8rem 1rem;
  font-size: 1.0625rem;
  color: var(--color-ink);
  transition: border-color 0.2s var(--ease-out-quart), background-color 0.2s var(--ease-out-quart), box-shadow 0.2s var(--ease-out-quart);
}
.field textarea { resize: vertical; min-height: 8.5rem; line-height: 1.5; }
.field input::placeholder,
.field textarea::placeholder { color: var(--color-mute); }
.field input:hover,
.field textarea:hover { border-color: var(--color-line-strong); }
.field input:focus,
.field textarea:focus { outline: none; border-color: var(--color-ink); background: rgb(238 234 227 / 0.06); box-shadow: 0 0 0 3px rgb(238 234 227 / 0.12); }
.field [aria-invalid="true"] { border-color: var(--color-error); }
.field-error { font-size: 0.875rem; color: var(--color-error); }
.field-error:empty { display: none; }

.check {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  display: grid;
  place-items: center;
  border-radius: 0.375rem;
  border: 1px solid var(--color-line-strong);
  background: rgb(238 234 227 / 0.04);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}
.check:hover { border-color: var(--color-ink-2); }
.check:checked { background: var(--color-ink); border-color: var(--color-ink); }
.check:checked::after {
  content: "";
  width: 0.6rem;
  height: 0.32rem;
  border-left: 2px solid var(--color-ground);
  border-bottom: 2px solid var(--color-ground);
  transform: translateY(-0.08rem) rotate(-45deg);
}
.check[aria-invalid="true"] { border-color: var(--color-error); }

.chip-face {
  display: inline-flex;
  align-items: center;
  height: 2.5rem;
  padding-inline: 1.1rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink-2);
  background: rgb(238 234 227 / 0.06);
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out-quart), color 0.2s var(--ease-out-quart);
}
.chip:hover .chip-face { background: rgb(238 234 227 / 0.12); color: var(--color-ink); }
.chip input:checked + .chip-face { background: var(--color-ink); color: var(--color-ground); }
.chip input:focus-visible + .chip-face { outline: 2px solid var(--color-ink); outline-offset: 3px; }

.sent-mark { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 999px; background: var(--color-ink); color: var(--color-ground); }
.sent-mark svg { width: 1.5rem; height: 1.5rem; }
.again { margin-top: 2rem; font-weight: 600; color: var(--color-ink); text-decoration: underline; text-underline-offset: 0.25em; }
</style>
