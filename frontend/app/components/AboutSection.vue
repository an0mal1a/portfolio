<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="about__inner shell">
      <div class="about__title reveal">
        <p class="eyebrow">About / Approach</p>
        <h2 id="about-title" class="section-heading">Quiet<br>complexity.</h2>
      </div>

      <div class="about__copy reveal">
        <p class="about__lead">I build the parts users never see — and the interfaces that make them feel effortless.</p>
        <p>My work sits between backend engineering, product thinking and interaction. I care about durable architecture, honest interfaces and shipping the smallest system that solves the real problem.</p>
        <div class="about__services">
          <span>Backend systems</span><span>API architecture</span><span>Product engineering</span><span>Automation</span><span>Technical direction</span><span>Creative development</span>
        </div>
      </div>

      <div class="about__portrait reveal">
        <div class="about__mark">PD</div>
        <img src="/images/me.png" alt="Pablo Diez, backend engineer and creative developer" width="600" height="480" loading="lazy">
        <p>Based in Madrid<br>Available worldwide</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about { padding: clamp(8rem, 14vw, 16rem) 0; background: #0b0b0a; }.about__inner { display: grid; grid-template-columns: .8fr 1fr; gap: clamp(4rem, 10vw, 12rem); }.about__title h2 { margin-top: 3rem; }.about__copy { padding-top: 5rem; }.about__lead { max-width: 40rem; margin: 0; font-size: clamp(2rem, 3.7vw, 4.25rem); line-height: 1.03; letter-spacing: -.045em; }.about__copy > p:nth-child(2) { max-width: 34rem; margin: 2rem 0 0 auto; color: var(--ink-dim); font-size: .95rem; line-height: 1.75; }.about__services { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 4rem; }.about__services span { padding: .7rem .9rem; border: 1px solid var(--line); border-radius: 3rem; font-size: .62rem; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; }
.about__portrait { position: relative; grid-column: 1 / -1; min-height: clamp(28rem, 48vw, 48rem); margin-top: 5rem; overflow: hidden; background: linear-gradient(135deg, #22070a, #080808 70%); }.about__portrait::before { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 9.9%, rgb(255 255 255 / 6%) 10% 10.1%); content: ""; }.about__portrait img { position: absolute; right: 10%; bottom: 0; height: 98%; width: auto; filter: contrast(1.08) grayscale(.25); }.about__portrait p { position: absolute; right: 2rem; bottom: 2rem; z-index: 2; color: var(--ink-dim); font-size: .6rem; line-height: 1.5; letter-spacing: .1em; text-align: right; text-transform: uppercase; }.about__mark { position: absolute; top: 8%; left: 3%; color: var(--red-dark); font-family: var(--font-display); font-size: clamp(17rem, 50vw, 55rem); line-height: .7; }
@media (max-width: 760px) { .about__inner { grid-template-columns: 1fr; }.about__copy { padding-top: 0; }.about__portrait { grid-column: auto; min-height: 30rem; }.about__portrait img { right: -25%; height: 82%; }.about__mark { top: 12%; font-size: 18rem; } }
</style>
