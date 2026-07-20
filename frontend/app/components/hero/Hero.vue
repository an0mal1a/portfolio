<template>
    <section class="hero" aria-labelledby="hero-title">
        <header class="hero__header">
            <div class="hero__eyebrow">
                <p>Backend Developer</p>
                <p>Software Engineer</p>
            </div>

            <div class="hero__availability">
                <span>Available for freelance</span>
                <Spark aria-hidden="true" />
            </div>
        </header>

        <div class="hero__stage">
            <p class="hero__backdrop" aria-hidden="true">Portfolio</p>

            <div class="hero__intro">
                <p class="hero__signature" aria-hidden="true">Hello, I'm</p>

                <h1 id="hero-title" class="hero__name">
                    Pablo<br>
                    Diez
                </h1>

                <p class="hero__role">Backend Developer &amp;<br>Software Engineer</p>

                <p class="hero__bio">
                    I design and build reliable digital products where clean code,
                    thoughtful architecture and useful experiences come together.
                </p>
            </div>

            <div class="hero__portrait" aria-hidden="true">
                <div class="hero__portrait-glow" />
                <img src="/images/me.png" alt="" width="600" height="480">
            </div>

            <div class="hero__statement">
                <span class="hero__statement-icon"><Spark aria-hidden="true" /></span>
                <p>Turning ideas into powerful digital experiences.</p>
            </div>

            <dl class="hero__stats" aria-label="Professional highlights">
                <div>
                    <dt><strong>5+</strong><span>Years<br>experience</span></dt>
                </div>
                <div>
                    <dt><strong>8+</strong><span>Projects<br>completed</span></dt>
                </div>
                <div>
                    <dt><strong>6+</strong><span>Happy<br>clients</span></dt>
                </div>
            </dl>

            <!-- <p class="hero__location">
                <span aria-hidden="true">◎</span>
                Available worldwide
            </p> -->
        </div>
    </section>
</template>

<script setup>
import Spark from '~/icons/Spark.vue';
</script>

<style scoped>
.hero {
    --hero-red: #d40818;
    --hero-red-dark: #760008;
    width: 100%;
    min-height: 100svh;
    margin-inline: auto;
    padding: 0 clamp(1rem, 2.2vw, 2.5rem);
    overflow: hidden;
    color: #f4f4f5;
    background:
        radial-gradient(circle at 54% 42%, rgb(118 0 8 / 18%), transparent 28rem),
        #030303;
}

.hero__header {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 5.25rem;
    border-bottom: 1px solid rgb(212 8 24 / 35%);
    font-family: var(--font-body);
    font-size: clamp(.65rem, .72vw, .78rem);
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: .06em;
    text-transform: uppercase;
}

.hero__eyebrow p:first-child { color: var(--hero-red); }
.hero__eyebrow p:last-child { color: #8a8a8d; }

.hero__availability {
    display: flex;
    align-items: center;
    gap: .85rem;
    color: #c4c4c6;
}

.hero__availability svg {
    width: 1.45rem;
    color: var(--hero-red);
}

.hero__stage {
    position: relative;
    isolation: isolate;
    min-height: calc(100svh - 5.25rem);
    border-bottom: 1px solid rgb(212 8 24 / 28%);
}

.hero__backdrop {
    position: absolute;
    z-index: -2;
    top: clamp(1rem, 2.3vh, 2rem);
    left: 50%;
    width: max-content;
    transform: translateX(-50%) scaleX(.95);
    transform-origin: center;
    color: var(--hero-red-dark);
    font-family: var(--font-heading);
    font-size: clamp(20rem, min(51vw, 71svh), 80rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.012em;
    text-transform: uppercase;
    user-select: none;
}

.hero__intro {
    position: absolute;
    z-index: 10;
    bottom: clamp(3.5rem, 6vh, 5rem);
    left: 0;
    width: min(28vw, 28rem);
}

.hero__signature {
    margin: 0 0 -.3rem -.1rem;
    font-family: var(--font-hand);
    font-size: clamp(2.75rem, 5.4vw, 6rem);
    line-height: 1;
    transform: rotate(-3deg);
}

.hero__name {
    font-family: var(--font-heading);
    font-size: clamp(7rem, 17vw, 14rem);
    font-weight: 400;
    line-height: .77;
    letter-spacing: -.01em;
    text-transform: uppercase;
    text-shadow: 0 4px 28px rgb(0 0 0 / 65%);
}

.hero__role {
    margin-top: 1.2rem;
    color: var(--hero-red);
    font-family: var(--font-body);
    font-size: clamp(1rem, 1.45vw, 1.55rem);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: .025em;
    text-transform: uppercase;
}

.hero__bio {
    max-width: 25rem;
    margin-top: 1rem;
    color: #aaa9ac;
    font-family: var(--font-body);
    font-size: clamp(.72rem, .86vw, .95rem);
    line-height: 1.55;
}

.hero__portrait {
    position: absolute;
    z-index: 3;
    right: 8%;
    bottom: 0;
    left: 16%;
    height: 100%;
    pointer-events: none;
}

.hero__portrait::after {
    position: absolute;
    right: 10%;
    bottom: -2px;
    left: 9%;
    height: 30%;
    background: linear-gradient(to top, #030303 2%, transparent 90%);
    content: '';
}

.hero__portrait-glow {
    position: absolute;
    top: 11%;
    left: 57%;
    width: min(34vw, 31rem);
    aspect-ratio: 1;
    transform: translateX(-50%);
    border-radius: 50%;
    background: rgb(212 8 24 / 19%);
    filter: blur(70px);
}

.hero__portrait img {
    position: absolute;
    bottom: 0;
    left: 47%;
    width: auto;
    height: 94%;
    max-width: none;
    transform: translateX(-50%);
    filter: drop-shadow(0 0 32px rgb(0 0 0 / 72%));
}

.hero__statement {
    position: absolute;
    z-index: 11;
    top: 43%;
    right: clamp(7.5rem, 15vw, 14rem);
    display: flex;
    align-items: center;
    gap: 1rem;
    width: clamp(11rem, 14vw, 14rem);
    color: #c4c4c6;
    font-family: var(--font-body);
    font-size: clamp(.68rem, .78vw, .82rem);
    line-height: 1.4;
}

.hero__statement-icon {
    display: grid;
    flex: 0 0 3.25rem;
    width: 3.25rem;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid rgb(212 8 24 / 75%);
    border-radius: 50%;
    color: #f4f4f5;
}

.hero__statement-icon svg { width: 1.1rem; }

.hero__stats {
    position: absolute;
    z-index: 12;
    right: 0;
    bottom: clamp(2rem, 3.5vh, 4rem);
    width: clamp(12rem, 15vw, 15rem);
    font-family: var(--font-body);
    text-transform: uppercase;
}

.hero__stats > div {
    padding: 1.25rem 0;
    border-bottom: 1px solid rgb(255 255 255 / 17%);
}

.hero__stats dt {
    display: flex;
    align-items: center;
    gap: .85rem;
}

.hero__stats strong {
    min-width: 4.5rem;
    color: var(--hero-red);
    font-family: var(--font-heading);
    font-size: clamp(2.75rem, 4vw, 4.25rem);
    font-weight: 400;
    line-height: .8;
}

.hero__stats span {
    color: #aaa9ac;
    font-size: clamp(.58rem, .66vw, .7rem);
    line-height: 1.5;
}

.hero__location {
    position: absolute;
    z-index: 20;
    bottom: 1.25rem;
    left: 0;
    display: flex;
    align-items: center;
    gap: .55rem;
    color: #9c9c9f;
    font-family: var(--font-body);
    font-size: .68rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
}

.hero__location span {
    color: var(--hero-red);
    font-size: 1rem;
}

@media (min-width: 901px) and (min-aspect-ratio: 16 / 9) {
    .hero__backdrop {
        transform: translateX(-50%) scaleX(1.15);
        font-size: clamp(20rem, min(51vw, 82svh), 80rem);
    }
}

@media (max-width: 900px) {
    .hero__stage { min-height: 48rem; }
    .hero__backdrop { font-size: clamp(16rem, 49vw, 27rem); }
    .hero__portrait { right: 2%; left: 10%; height: 78%; }
    .hero__portrait img { left: 56%; width: min(68vw, 38rem); height: auto; }
    .hero__intro { width: 17rem; }
    .hero__statement { display: none; }
    .hero__stats { width: 9rem; }
}

@media (max-width: 640px) {
    .hero { min-height: auto; padding-inline: 1rem; }
    .hero__header { min-height: 4.25rem; }
    .hero__availability span { display: none; }
    .hero__availability svg { width: 1.25rem; }

    .hero__stage {
        display: grid;
        min-height: auto;
        padding-top: 1rem;
    }

    .hero__backdrop {
        top: 1.5rem;
        font-size: clamp(11.5rem, 55vw, 14rem);
        line-height: .78;
    }

    .hero__portrait {
        position: relative;
        right: auto;
        bottom: auto;
        left: auto;
        z-index: 2;
        grid-area: 1 / 1;
        height: 24.5rem;
        margin-top: 5.5rem;
    }

    .hero__portrait img {
        left: 55%;
        width: min(34rem, 128vw);
    }

    .hero__portrait::after { right: -1rem; left: -1rem; height: 28%; }
    .hero__portrait-glow { top: 15%; left: 58%; width: 18rem; }

    .hero__intro {
        position: relative;
        bottom: auto;
        left: auto;
        z-index: 10;
        grid-area: 1 / 1;
        align-self: end;
        width: 100%;
        padding-bottom: 1.5rem;
    }

    .hero__signature { font-size: clamp(2.2rem, 11vw, 3.2rem); }
    .hero__name { font-size: clamp(5rem, 26vw, 7.6rem); }
    .hero__role { margin-top: .9rem; font-size: .9rem; }
    .hero__bio { max-width: 17rem; font-size: .68rem; }

    .hero__stats {
        position: relative;
        right: auto;
        bottom: auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        padding-bottom: 3.5rem;
        border-top: 1px solid rgb(255 255 255 / 17%);
    }

    .hero__stats > div { padding: 1rem .4rem; }
    .hero__stats > div:first-child { padding-left: 0; }
    .hero__stats > div + div { border-left: 1px solid rgb(255 255 255 / 17%); }
    .hero__stats dt { display: block; }
    .hero__stats strong { display: block; margin-bottom: .45rem; font-size: 2.35rem; }
    .hero__stats span { font-size: .47rem; }
    .hero__location { bottom: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
    .hero__portrait-glow { filter: blur(55px); }
}
</style>
