<template>
  <footer class="footer">
    <div class="footer__inner shell">
      <p>Pablo Diez® / {{ year }}</p>
      <p>Backend engineer & creative developer</p>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>
</template>

<script setup lang="ts">const year = new Date().getFullYear()</script>

<style scoped>
.footer { color: #11110f; background: #eeece4; }.footer__inner { display: flex; padding-block: 1.4rem; justify-content: space-between; border-top: 1px solid rgb(0 0 0 / 22%); font-size: .58rem; font-weight: 650; letter-spacing: .09em; text-transform: uppercase; }.footer p { margin: 0; }.footer a:hover { color: var(--red); }
@media (max-width: 620px) { .footer__inner { gap: 1rem; }.footer p:nth-child(2) { display: none; } }
</style>
