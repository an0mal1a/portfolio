<template>
  <section id="contact" class="contact" aria-labelledby="contact-title">
    <div class="contact__inner shell">
      <header class="contact__header reveal">
        <p class="eyebrow">New business / Say hello</p>
        <h2 id="contact-title">Have a hard<br>problem? <i>Good.</i></h2>
        <p>Tell me what you’re building, what’s getting in the way and where you want to go.</p>
      </header>

      <form class="contact__form reveal" @submit.prevent="submitForm">
        <label><span>01 / Your name</span><input v-model.trim="form.name" name="name" autocomplete="name" required placeholder="How should I call you?"></label>
        <label><span>02 / Email</span><input v-model.trim="form.email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"></label>
        <label><span>03 / Subject</span><input v-model.trim="form.subject" name="subject" required placeholder="A new product, an API, a rescue..."></label>
        <label><span>04 / The details</span><textarea v-model.trim="form.message" name="message" required rows="4" placeholder="Context, constraints, ambition." /></label>
        <button type="submit" :disabled="sending"><span>{{ sending ? 'Sending' : 'Send inquiry' }}</span><i>{{ sending ? '···' : '↗' }}</i></button>
        <p v-if="feedback" class="contact__feedback" :class="{ 'is-error': feedbackError }" aria-live="polite">{{ feedback }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ sendContact: (payload: { name: string; email: string; phone?: string; subject: string; message: string }) => Promise<{ status: string; error?: string }> }>()
const form = reactive({ name: '', email: '', subject: '', message: '', phone: '' })
const sending = ref(false)
const feedback = ref('')
const feedbackError = ref(false)

const submitForm = async () => {
  sending.value = true
  feedback.value = ''
  feedbackError.value = false
  try {
    const response = await props.sendContact({ ...form })
    if (response.status !== 'ok') throw new Error(response.error || 'unknown_error')
    feedback.value = 'Message received. I’ll get back to you shortly.'
    Object.assign(form, { name: '', email: '', subject: '', message: '', phone: '' })
  }
  catch {
    feedbackError.value = true
    feedback.value = 'The message could not be sent. Please try again in a moment.'
  }
  finally { sending.value = false }
}
</script>

<style scoped>
.contact { padding: clamp(7rem, 13vw, 14rem) 0 3rem; border-top: 1px solid var(--line); color: var(--ink); background: var(--paper-raised); }.contact__inner { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(4rem, 9vw, 11rem); }.contact__header h2 { margin: 2.5rem 0; font-family: var(--font-display); font-size: clamp(3.8rem, 8.5vw, 9.5rem); font-weight: 650; line-height: .84; letter-spacing: -.075em; }.contact__header h2 i { color: var(--red); font-style: normal; }.contact__header > p:last-child { max-width: 24rem; color: var(--ink-dim); line-height: 1.7; }
.contact__form { padding-top: 1rem; }.contact label { display: block; padding: 1.25rem 0; border-bottom: 1px solid var(--line-strong); }.contact label span { display: block; margin-bottom: .7rem; color: var(--ink-dim); font-family: var(--font-mono); font-size: .55rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }.contact input, .contact textarea { width: 100%; padding: 0; border: 0; border-radius: 0; outline: none; color: var(--ink); background: transparent; font-size: clamp(1.1rem, 1.7vw, 1.55rem); resize: vertical; }.contact input::placeholder, .contact textarea::placeholder { color: #62625f; }.contact label:focus-within { border-color: var(--red); }.contact button { display: flex; width: 100%; margin-top: 1.4rem; padding: 1rem 1.2rem; align-items: center; justify-content: space-between; border: 0; color: white; background: var(--red); cursor: pointer; font-family: var(--font-mono); font-size: .65rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; transition: background .25s ease; }.contact button:hover { background: #b71120; }.contact button:disabled { opacity: .6; cursor: wait; }.contact button i { font-size: 1.35rem; font-style: normal; }.contact__feedback { margin: 1rem 0 0; color: var(--ink-soft); font-size: .75rem; }.contact__feedback.is-error { color: var(--red-bright); }
@media (max-width: 800px) { .contact__inner { grid-template-columns: 1fr; } }
</style>
