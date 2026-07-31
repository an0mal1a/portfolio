<template>
  <section
    id="top"
    class="relative overflow-hidden border-b border-line px-4 pt-32 pb-16 sm:px-6 sm:pt-36 lg:pt-40 lg:pb-20"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_76%_18%,rgba(229,72,77,.08),transparent_30%)]"
    />

    <div
      class="relative mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,.62fr)] lg:items-center lg:gap-20"
    >
      <div data-reveal>
        <div class="mb-7 flex flex-wrap items-center gap-2">
          <span
            class="flex items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1 text-xs text-muted"
          >
            <Terminal :size="16" />
            Backend y producto
          </span>
          <span class="flex items-center gap-2 px-2 py-1 text-xs text-muted">
            <i class="size-1.5 rounded-full bg-signal" />
            Disponible de forma selectiva
          </span>
        </div> 

        <h1
          class="m-0 font-display text-[clamp(4.8rem,10.5vw,11rem)] leading-[0.78]"
        >
          Construyo sistemas que sostienen el producto.
        </h1>

        <div
          class="mt-9 grid max-w-3xl gap-7 border-t border-line pt-6 sm:grid-cols-[1fr_auto] sm:items-end"
        >
          <p class="m-0 max-w-xl text-base leading-7 text-muted">
            APIs, infraestructura e interfaces diseñadas para seguir siendo
            claras cuando la complejidad deja de serlo.
          </p>
          <div class="flex gap-2">
            <NuxtLink
              to="/projects"
              class="flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Ver proyectos
              <ArrowUpRight :size="16" />
            </NuxtLink>
            <NuxtLink
              to="/system"
              class="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
            >
              Explorar sistema
              <Network :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-[31rem] lg:mx-0" data-reveal>
        <div
          class="soft-noise relative overflow-hidden rounded-sm border border-line bg-surface shadow-[0_32px_100px_rgba(0,0,0,.4)] transition-transform duration-300 ease-out"
          :style="cardTransform"
          @pointermove="tilt"
          @pointerleave="resetTilt"
        >
          <div
            class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
          >
            <span class="flex items-center gap-2">
              <ScanFace :size="16" />
              perfil.dev
            </span>
            <span class="flex items-center gap-2">
              <i class="size-1.5 rounded-full bg-signal" />
              En línea
            </span>
          </div>
          <div
            class="relative aspect-[1/1.03] overflow-hidden bg-background-secondary"
          >
            <div
              class="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:4rem_4rem]"
            />
            <span
              class="absolute top-5 left-5 z-10 max-w-[12rem] text-2xl leading-6 font-medium tracking-[-0.04em]"
              >Infraestructura silenciosa para ideas ambiciosas.</span
            >
            <img
              src="/images/me.png"
              alt="Pablo Diez"
              width="600"
              height="480"
              fetchpriority="high"
              class="absolute right-[-7%] bottom-0 w-[86%] max-w-none saturate-50"
            />
            <div
              class="absolute right-3 bottom-3 flex items-center gap-2 rounded-sm border border-white/10 bg-background/75 px-2 py-1 text-xs text-white/70 backdrop-blur-md"
            >
              <MapPin :size="16" />
              Ibiza · {{ localTime }}
            </div>
          </div>
        </div>

        <div
          class="absolute -right-2 -bottom-7 flex items-center gap-2 rounded-sm border border-line bg-surface-raised px-2 py-1.5 text-xs text-muted shadow-xl sm:-right-6"
        >
          <Activity :size="16" class="text-signal" />
          Portfolio desplegado y operativo
        </div>
      </div>
    </div>

    <div
      class="relative mx-auto mt-20 grid max-w-[92rem] grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4"
      data-reveal
    >
      <div
        v-for="item in stats"
        :key="item.label"
        class="bg-background-secondary p-4"
      >
        <component :is="item.icon" :size="16" class="mb-7 text-muted" />
        <strong class="block text-2xl font-medium tracking-[-0.04em]">{{
          item.value
        }}</strong>
        <span class="mt-1 block text-xs text-muted">{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Database,
  MapPin,
  Network,
  ScanFace,
  Server,
  Terminal,
} from "@lucide/vue";

const props = defineProps<{
  projectCount: number;
  clientCount: number;
}>();

const localTime = ref("CET");
const rotate = reactive({ x: 0, y: 0 });
let timer: ReturnType<typeof setInterval> | undefined;

const cardTransform = computed(() => ({
  transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
}));

const stats = computed(() => [
  {
    icon: Boxes,
    value: props.projectCount.toString().padStart(2, "0"),
    label: "proyectos públicos",
  },
  { icon: Server, value: "03", label: "servicios desplegados" },
  {
    icon: Database,
    value: props.clientCount.toString().padStart(2, "0"),
    label: "clientes y partners",
  },
  { icon: Activity, value: "24/7", label: "sistema monitorizado" },
]);

const updateTime = () => {
  localTime.value = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
};

const tilt = (event: PointerEvent) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  rotate.y = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
  rotate.x = -((event.clientY - rect.top) / rect.height - 0.5) * 5;
};

const resetTilt = () => {
  rotate.x = 0;
  rotate.y = 0;
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 60_000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>
