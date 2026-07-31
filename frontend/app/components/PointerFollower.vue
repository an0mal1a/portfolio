<template>
    <div
        v-if="enabled"
        class="pointer-events-none fixed top-0 left-0 z-[95] hidden size-2 rounded-full bg-signal md:block motion-reduce:hidden [@media(pointer:coarse)]:hidden"
        :style="{ transform: `translate3d(${dot.x - 4}px, ${dot.y - 4}px, 0)` }"
        aria-hidden="true"
    />
    <div
        v-if="enabled"
        class="pointer-events-none fixed top-0 left-0 z-[94] hidden size-8 rounded-full border border-signal/35 md:block motion-reduce:hidden [@media(pointer:coarse)]:hidden"
        :style="{
            transform: `translate3d(${ring.x - 16}px, ${ring.y - 16}px, 0) scale(${pressed ? 0.72 : 1})`,
        }"
        aria-hidden="true"
    />
</template>

<script setup lang="ts">
const enabled = ref(false);
const pressed = ref(false);
const target = reactive({ x: -100, y: -100 });
const dot = reactive({ x: -100, y: -100 });
const ring = reactive({ x: -100, y: -100 });
let frame = 0;

const move = (event: PointerEvent) => {
    target.x = event.clientX;
    target.y = event.clientY;
    enabled.value = true;
};

const press = () => {
    pressed.value = true;
};
const release = () => {
    pressed.value = false;
};

const tick = () => {
    dot.x += (target.x - dot.x) * 0.42;
    dot.y += (target.y - dot.y) * 0.42;
    ring.x += (target.x - ring.x) * 0.13;
    ring.y += (target.y - ring.y) * 0.13;
    frame = requestAnimationFrame(tick);
};

onMounted(() => {
    if (
        window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)")
            .matches
    )
        return;
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    frame = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerdown", press);
    window.removeEventListener("pointerup", release);
});
</script>
