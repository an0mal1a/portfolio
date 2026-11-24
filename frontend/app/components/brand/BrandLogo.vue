<script setup lang="ts">
// The binding brand: modular P mark + PABLO wordmark, set in live type so it stays crisp.
// Lockup from the brand kit (logo-main.svg): cap height ~0.63 of the mark, caps
// hung from the top of the mark (the spine runs on below the baseline), gap ~0.48em.
// Gantari at line-height 1 starts its caps 0.17em into the line box, hence -0.11em.
</script>

<template>
  <span class="inline-flex items-start gap-[0.48em] leading-none text-ink">
    <BrandMark class="h-[1.08em] w-auto flex-none" />
    <span class="-mt-[0.11em] text-[1em] font-extrabold tracking-[-0.005em]">PABLO</span>
  </span>
</template>
