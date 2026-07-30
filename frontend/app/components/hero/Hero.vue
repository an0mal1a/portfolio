<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero__noise" aria-hidden="true" />
    <div class="hero__orb" aria-hidden="true" />

    <div class="hero__inner shell">
      <div class="hero__meta">
        <p>Backend engineer<br>Creative developer</p>
        <p><span class="hero__pulse" /> Available for selected projects<br>Madrid · Working worldwide</p>
      </div>

      <div class="hero__copy">
        <p class="hero__overline">Pablo Diez — Independent developer</p>
        <h1 id="hero-title">
          <span>Systems</span>
          <span>with a <em>pulse.</em></span>
        </h1>
        <p class="hero__intro">I engineer reliable digital products and give complex systems a clear, human surface.</p>
      </div>

      <div class="hero__portrait" aria-label="Portrait of Pablo Diez">
        <p class="hero__code" aria-hidden="true">01 / PD<br>EST. 2021</p>
        <div class="hero__image-wrap">
          <img src="/images/me.png" alt="Pablo Diez" width="600" height="480" fetchpriority="high">
        </div>
        <p class="hero__signature" aria-hidden="true">Pablo</p>
      </div>

      <dl class="hero__stats" aria-label="Portfolio snapshot">
        <div><dt>{{ projectCount.toString().padStart(2, '0') }}</dt><dd>Public<br>projects</dd></div>
        <div><dt>{{ clientCount.toString().padStart(2, '0') }}</dt><dd>Clients<br>& partners</dd></div>
        <div><dt>05+</dt><dd>Years<br>building</dd></div>
      </dl>

      <a class="hero__scroll" href="#work"><span>Scroll to work</span><i>↓</i></a>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ projectCount: number; clientCount: number }>()
</script>

<style scoped>
.hero { position: relative; isolation: isolate; min-height: 100svh; overflow: hidden; background: radial-gradient(circle at 70% 48%, #3a080c 0, #120708 23%, transparent 46%), var(--paper); }
.hero::after { position: absolute; z-index: -3; inset: 0; background-image: linear-gradient(90deg, transparent calc(25% - 1px), rgb(255 255 255 / 5%) 25%, transparent calc(25% + 1px), transparent calc(50% - 1px), rgb(255 255 255 / 5%) 50%, transparent calc(50% + 1px), transparent calc(75% - 1px), rgb(255 255 255 / 5%) 75%, transparent calc(75% + 1px)); content: ""; }
.hero__noise { position: absolute; z-index: 10; inset: 0; opacity: .22; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
.hero__orb { position: absolute; z-index: -1; top: 17%; left: 64%; width: clamp(20rem, 40vw, 46rem); aspect-ratio: 1; border: 1px solid rgb(226 27 45 / 22%); border-radius: 50%; animation: breathe 5s ease-in-out infinite; }
.hero__orb::before, .hero__orb::after { position: absolute; border: 1px solid rgb(226 27 45 / 14%); border-radius: inherit; content: ""; }
.hero__orb::before { inset: 12%; }.hero__orb::after { inset: 29%; background: rgb(226 27 45 / 5%); }
.hero__inner { position: relative; min-height: 100svh; padding-top: 7.25rem; padding-bottom: 2rem; }
.hero__meta { display: flex; justify-content: space-between; color: var(--ink-dim); font-size: .63rem; font-weight: 600; line-height: 1.55; letter-spacing: .09em; text-transform: uppercase; }
.hero__meta p:last-child { text-align: right; }.hero__pulse { display: inline-block; width: .4rem; aspect-ratio: 1; margin-right: .45rem; border-radius: 50%; background: var(--acid); box-shadow: 0 0 .7rem var(--acid); }
.hero__copy { position: relative; z-index: 4; margin-top: clamp(6rem, 16vh, 11rem); }
.hero__overline { margin: 0 0 1.25rem .45rem; color: var(--red); font-size: .68rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.hero h1 { margin: 0; font-family: var(--font-display); font-size: clamp(7.4rem, 15.6vw, 18.5rem); font-weight: 400; line-height: .68; letter-spacing: -.035em; text-transform: uppercase; }
.hero h1 span { display: block; }.hero h1 span:last-child { margin-left: clamp(1.5rem, 8.5vw, 10rem); white-space: nowrap; }.hero h1 em { color: var(--red); font-style: normal; }
.hero__intro { width: min(24rem, 28vw); margin: clamp(1.5rem, 3vh, 2.75rem) 0 0 clamp(1.5rem, 8.5vw, 10rem); color: var(--ink-dim); font-size: clamp(.83rem, 1vw, 1.05rem); line-height: 1.65; }
.hero__portrait { position: absolute; z-index: 3; right: clamp(1rem, 5vw, 6rem); bottom: 0; width: clamp(25rem, 39vw, 48rem); height: 78%; pointer-events: none; }
.hero__image-wrap { position: absolute; right: 0; bottom: 0; width: 100%; height: 100%; overflow: hidden; }
.hero__image-wrap::after { position: absolute; inset: auto 0 0; height: 30%; background: linear-gradient(transparent, var(--paper)); content: ""; }
.hero__portrait img { position: absolute; right: -3%; bottom: 0; width: 100%; height: auto; filter: contrast(1.08) saturate(.75) drop-shadow(0 2rem 3rem #000); transform-origin: bottom; animation: portrait-in 1.2s cubic-bezier(.16,.8,.2,1) both; }
.hero__code { position: absolute; z-index: 2; top: 15%; right: 2%; color: rgb(242 240 233 / 45%); font-size: .58rem; line-height: 1.5; letter-spacing: .12em; }
.hero__signature { position: absolute; z-index: 3; right: -1rem; bottom: 11%; color: var(--ink); font-family: var(--font-hand); font-size: clamp(4rem, 7vw, 8rem); transform: rotate(-7deg); }
.hero__stats { position: absolute; z-index: 5; right: 0; bottom: 2.3rem; display: grid; grid-template-columns: repeat(3, auto); gap: clamp(1rem, 2.4vw, 2.8rem); margin: 0; }
.hero__stats div { display: flex; align-items: flex-end; gap: .55rem; }.hero__stats dt { color: var(--red); font-family: var(--font-display); font-size: clamp(2.2rem, 3.2vw, 4rem); line-height: .7; }.hero__stats dd { margin: 0; color: var(--ink-dim); font-size: .52rem; line-height: 1.35; letter-spacing: .08em; text-transform: uppercase; }
.hero__scroll { position: absolute; z-index: 5; bottom: 2rem; left: clamp(1rem, 3vw, 3.5rem); display: flex; align-items: center; gap: .7rem; font-size: .6rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }.hero__scroll i { display: grid; width: 2.4rem; aspect-ratio: 1; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--red); font-style: normal; transition: .25s ease; }.hero__scroll:hover i { color: var(--paper); background: var(--red); transform: translateY(.25rem); }
@keyframes breathe { 50% { transform: scale(1.04); opacity: .65; } }
@keyframes portrait-in { from { opacity: 0; transform: translateY(4rem) scale(.95); } }

@media (max-width: 960px) {
  .hero__copy { margin-top: 8rem; }.hero h1 { font-size: clamp(6.7rem, 18vw, 12rem); }.hero__portrait { right: -6rem; width: 35rem; height: 67%; opacity: .85; }.hero__intro { width: 19rem; }.hero__stats { gap: 1rem; }
}
@media (max-width: 680px) {
  .hero { min-height: 52rem; }.hero__inner { min-height: 52rem; padding-top: 6rem; }.hero__meta p:first-child { display: none; }.hero__meta { justify-content: flex-end; }.hero__copy { margin-top: 6.5rem; }.hero__overline { margin-left: 0; }.hero h1 { font-size: clamp(5.5rem, 28vw, 8.5rem); line-height: .72; }.hero h1 span:last-child { margin-left: 0; }.hero__intro { width: 16rem; margin-left: 0; font-size: .78rem; }.hero__portrait { right: -8.5rem; width: 28rem; height: 50%; }.hero__signature { display: none; }.hero__stats { right: auto; bottom: 5.5rem; left: 1rem; grid-template-columns: repeat(2, auto); }.hero__stats div:last-child { display: none; }.hero__scroll { bottom: 1rem; left: 1rem; }.hero__orb { top: 35%; left: 37%; }
}
</style>
