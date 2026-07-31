<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero__grid" aria-hidden="true" />
    <div class="hero__inner shell">
      <div class="hero__status">
        <span><i /> Available for selected projects</span>
        <span>Ibiza, Spain · {{ localTime }}</span>
      </div>

      <div class="hero__copy">
        <p class="eyebrow">Independent backend & product engineer</p>
        <h1 id="hero-title">I make complex<br>systems feel <em>clear.</em></h1>
        <p class="hero__intro">Reliable APIs, resilient infrastructure and thoughtful digital products  engineered from the inside out.</p>
        <div class="hero__actions">
          <NuxtLink class="hero__primary" to="/projects">Explore projects <span>↗</span></NuxtLink>
          <a class="text-link" href="#about">More about me <span>↓</span></a>
        </div>
      </div>

      <div class="hero__portrait" aria-label="Portrait of Pablo Diez">
        <div class="hero__portrait-frame">
          <img src="/images/me.png" alt="Pablo Diez" width="600" height="480" fetchpriority="high">
        </div>
        <p>Backend engineer<br>Creative developer</p>
        <span class="hero__portrait-code">PD·01</span>
      </div>

      <dl class="hero__stats" aria-label="Portfolio snapshot">
        <div><dt>{{ projectCount.toString().padStart(2, '0') }}</dt><dd>Selected<br>projects</dd></div>
        <div><dt>{{ clientCount.toString().padStart(2, '0') }}</dt><dd>Clients &<br>partners</dd></div>
        <div><dt>05+</dt><dd>Years<br>building</dd></div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ projectCount: number; clientCount: number }>()
const localTime = ref('CET')
let timer: ReturnType<typeof setInterval> | undefined
const updateTime = () => {
  localTime.value = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 60_000) })
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.hero { position: relative; isolation: isolate; min-height: max(52rem, 100svh); overflow: hidden; border-bottom: 1px solid var(--line); background: radial-gradient(circle at 78% 45%, rgb(225 29 46 / 13%), transparent 28%), var(--paper); }
.hero__grid { position: absolute; z-index: -1; inset: 0; opacity: .52; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: clamp(4rem, 8vw, 9rem) clamp(4rem, 8vw, 9rem); mask-image: linear-gradient(to bottom, black, transparent 92%); }
.hero__inner { position: relative; min-height: max(52rem, 100svh); padding-top: 7rem; padding-bottom: 2rem; }
.hero__status { display: flex; justify-content: space-between; color: var(--ink-dim); font-family: var(--font-mono); font-size: .61rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; }
.hero__status span:first-child { color: var(--ink-soft); }.hero__status i { display: inline-block; width: .4rem; aspect-ratio: 1; margin-right: .5rem; border-radius: 50%; background: var(--red); box-shadow: 0 0 .65rem var(--red); }
.hero__copy { position: relative; z-index: 4; max-width: min(72rem, 72vw); margin-top: clamp(8rem, 19vh, 13rem); }
.hero h1 { margin: 1.8rem 0 0; font-size: clamp(4.6rem, 9.3vw, 11rem); font-weight: 650; line-height: .84; letter-spacing: -.085em; }
.hero h1 em { color: var(--red); font-style: normal; }
.hero__intro { max-width: 35rem; margin: 2.2rem 0 0; color: var(--ink-dim); font-size: clamp(1rem, 1.35vw, 1.3rem); line-height: 1.65; }
.hero__actions { display: flex; align-items: center; gap: 1.6rem; margin-top: 2.25rem; }
.hero__primary { display: inline-flex; min-width: 11rem; padding: .9rem 1rem; align-items: center; justify-content: space-between; border: 1px solid var(--red); background: var(--red); font-family: var(--font-mono); font-size: .68rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; transition: background .2s ease; }.hero__primary:hover { background: #b71120; }
.hero__portrait { position: absolute; z-index: 2; right: clamp(1rem, 4vw, 5rem); bottom: 6rem; width: clamp(20rem, 31vw, 39rem); }
.hero__portrait-frame { position: relative; aspect-ratio: 1 / 1.1; overflow: hidden; border: 1px solid var(--line); background: linear-gradient(145deg, #1c1c1c, #090909 70%); }
.hero__portrait-frame::before { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 49.8%, rgb(255 255 255 / 8%) 50%, transparent 50.2%), linear-gradient(transparent 49.8%, rgb(255 255 255 / 8%) 50%, transparent 50.2%); content: ""; }
.hero__portrait img { position: absolute; right: -5%; bottom: 0; width: 112%; max-width: none; filter: saturate(.78) contrast(1.08); }
.hero__portrait p { margin: .8rem 0 0; color: var(--ink-dim); font-family: var(--font-mono); font-size: .57rem; line-height: 1.45; letter-spacing: .08em; text-transform: uppercase; }
.hero__portrait-code { position: absolute; right: .8rem; bottom: -1.2rem; color: var(--red); font-family: var(--font-mono); font-size: .58rem; }
.hero__stats { position: absolute; z-index: 5; right: clamp(1rem, 4vw, 5rem); bottom: 1.7rem; display: grid; grid-template-columns: repeat(3, auto); gap: clamp(1.2rem, 2.5vw, 3rem); margin: 0; }
.hero__stats div { display: flex; align-items: flex-end; gap: .6rem; }.hero__stats dt { color: var(--red); font-size: clamp(1.9rem, 2.6vw, 3.2rem); font-weight: 600; line-height: .75; letter-spacing: -.06em; }.hero__stats dd { margin: 0; color: var(--ink-dim); font-family: var(--font-mono); font-size: .5rem; line-height: 1.4; letter-spacing: .07em; text-transform: uppercase; }

@media (max-width: 1040px) {
  .hero__copy { max-width: 82vw; }.hero__portrait { right: -5rem; width: 29rem; opacity: .72; }.hero__intro { max-width: 28rem; }
}
@media (max-width: 700px) {
  .hero, .hero__inner { min-height: 51rem; }.hero__inner { padding-top: 5.75rem; }.hero__status span:last-child { display: none; }
  .hero__copy { max-width: none; margin-top: 5.4rem; }.hero h1 { font-size: clamp(3.8rem, 18vw, 6.3rem); line-height: .86; }.hero__intro { max-width: 19rem; font-size: .94rem; }
  .hero__actions { align-items: flex-start; flex-direction: column; gap: 1.15rem; }.hero__portrait { right: -6rem; bottom: 4.8rem; width: 21rem; opacity: .66; }.hero__portrait p, .hero__portrait-code { display: none; }
  .hero__stats { right: auto; bottom: 1.25rem; left: 1rem; gap: 1.25rem; }.hero__stats div:last-child { display: none; }
}
</style>
