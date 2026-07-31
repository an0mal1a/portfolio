<template>
  <footer class="footer">
    <div class="footer__inner shell">
      <p>Pablo Diez ® / {{ year }}</p>
      <p>Backend engineer & creative developer</p>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>
</template>

<script setup lang="ts">const year = new Date().getFullYear()</script>

<style scoped>
.footer { color: var(--ink-dim); background: var(--paper-raised); }.footer__inner { display: flex; padding-block: 1.4rem; justify-content: space-between; border-top: 1px solid var(--line); font-family: var(--font-mono); font-size: .55rem; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; }.footer p { margin: 0; }.footer a:hover { color: var(--red-bright); }
@media (max-width: 620px) { .footer__inner { gap: 1rem; }.footer p:nth-child(2) { display: none; } }
</style>
