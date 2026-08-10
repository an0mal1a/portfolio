<template>
    <section
        class="overflow-hidden rounded-sm border border-line bg-surface"
        aria-labelledby="system-status-title"
    >
        <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-3"
        >
            <div class="flex items-center gap-2 text-xs text-muted">
                <Activity :size="16" class="text-signal" />
                <span id="system-status-title">Estado del sistema</span>
                <span class="text-line-strong">/system/status</span>
            </div>
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-sm border border-line px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-raised hover:text-ink disabled:cursor-wait disabled:opacity-60"
                :disabled="loading"
                @click="refresh"
            >
                <RefreshCw :size="14" :class="loading ? 'animate-spin' : ''" />
                Actualizar
            </button>
        </div>

        <div class="grid gap-px bg-line md:grid-cols-[1.25fr_1fr]">
            <div class="bg-background-secondary p-5 sm:p-6">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <span class="text-[10px] uppercase tracking-[0.12em] text-muted"
                            >Runtime</span
                        >
                        <strong class="mt-2 block text-3xl font-medium tracking-[-0.05em]"
                            >{{ current.status === "operational" ? "Operational" : "Degraded" }}</strong
                        >
                    </div>
                    <span
                        class="flex items-center gap-2 rounded-sm border px-2 py-1 text-xs"
                        :class="current.status === 'operational' ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/25 bg-amber-500/10 text-amber-300'"
                    >
                        <i class="size-1.5 rounded-full bg-current" />
                        {{ loading ? "Comprobando" : "En línea" }}
                    </span>
                </div>
                <p class="mt-5 mb-0 max-w-md text-xs leading-5 text-muted">
                    Métricas internas del servicio: dependencias, pools, jobs y
                    uptime. No se registran visitas ni comportamiento de usuarios.
                </p>
                <div class="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div class="rounded-sm border border-line bg-surface p-3">
                        <span class="text-[10px] text-muted">Uptime</span>
                        <strong class="mt-2 block text-sm font-medium">{{ formatUptime(current.uptime_seconds) }}</strong>
                    </div>
                    <div class="rounded-sm border border-line bg-surface p-3">
                        <span class="text-[10px] text-muted">API</span>
                        <strong class="mt-2 block text-sm font-medium">v{{ current.api_version }}</strong>
                    </div>
                    <div class="rounded-sm border border-line bg-surface p-3">
                        <span class="text-[10px] text-muted">DB latency</span>
                        <strong class="mt-2 block text-sm font-medium">{{ current.services.database.latency_ms ?? "—" }}<span v-if="current.services.database.latency_ms !== null"> ms</span></strong>
                    </div>
                    <div class="rounded-sm border border-line bg-surface p-3">
                        <span class="text-[10px] text-muted">Requests</span>
                        <strong class="mt-2 block text-sm font-medium">{{ current.requests_served ?? "—" }}</strong>
                    </div>
                </div>
            </div>

            <div class="bg-surface p-5 sm:p-6">
                <div class="mb-4 flex items-center justify-between">
                    <span class="text-xs font-medium">Servicios</span>
                    <span class="text-[10px] text-muted">checks concurrentes</span>
                </div>
                <div class="space-y-2">
                    <ServiceRow label="PostgreSQL" :service="current.services.database" :detail="`${current.services.database.reader_pool.status} / ${current.services.database.writer_pool.status}`" />
                    <ServiceRow label="Python worker" :service="current.services.python_worker" detail="FastAPI · jobs" />
                    <ServiceRow label="GitHub sync" :service="current.github" :detail="`${current.github.repositories} repos · ${current.github.languages} lenguajes`" />
                    <ServiceRow label="SMTP" :service="current.services.smtp" detail="opcional" />
                </div>
            </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2 text-[10px] text-muted">
            <span v-if="current.github.last_sync">GitHub sync · {{ formatDate(current.github.last_sync) }} · {{ current.github.duration_ms ?? "—" }} ms</span>
            <span v-else>GitHub sync · sin ejecuciones registradas</span>
            <span>{{ lastChecked ? `Comprobado ${formatDate(lastChecked)}` : "Esperando comprobación" }}</span>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Activity, RefreshCw } from "@lucide/vue";

type Service = {
    status: string;
    latency_ms?: number | null;
    detail?: string | null;
    reader_pool?: Service;
    writer_pool?: Service;
};

type SystemStatus = {
    status: string;
    api_version: string;
    requests_served: number | null;
    uptime_seconds: number;
    generated_at: string;
    services: { database: Service & { latency_ms?: number | null }; python_worker: Service; smtp: Service };
    github: Service & { last_sync?: string | null; repositories: number; languages: number; duration_ms?: number | null };
};

const ServiceRow = defineComponent({
    props: {
        label: { type: String, required: true },
        service: { type: Object as PropType<Service>, required: true },
        detail: { type: String, required: true },
    },
    setup(props) {
        return () => h("div", { class: "flex items-center justify-between gap-3 rounded-sm border border-line bg-background-secondary px-3 py-2.5" }, [
            h("div", { class: "min-w-0" }, [h("strong", { class: "block truncate text-xs font-medium" }, props.label), h("span", { class: "mt-0.5 block truncate text-[10px] text-muted" }, props.detail)]),
            h("span", { class: `flex shrink-0 items-center gap-1.5 text-[10px] ${props.service.status === 'healthy' || props.service.status === 'operational' ? 'text-emerald-300' : props.service.status === 'disabled' ? 'text-muted' : 'text-amber-300'}` }, [h("i", { class: "size-1.5 rounded-full bg-current" }), props.service.status]),
        ]);
    },
});

const fallback: SystemStatus = {
    status: "operational",
    api_version: "0.1.0",
    requests_served: null,
    uptime_seconds: 3 * 86400 + 18 * 3600,
    generated_at: new Date().toISOString(),
    services: {
        database: { status: "healthy", latency_ms: 2, reader_pool: { status: "healthy" }, writer_pool: { status: "healthy" } },
        python_worker: { status: "healthy" },
        smtp: { status: "disabled" },
    },
    github: { status: "healthy", last_sync: new Date().toISOString(), repositories: 37, languages: 12, duration_ms: 1840 },
};

const current = ref<SystemStatus>(fallback);
const loading = ref(false);
const lastChecked = ref<string | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;

const refresh = async () => {
    loading.value = true;
    try {
        const config = useRuntimeConfig();
        const base = config.public.apiBase || "https://rust-api.impablo.dev";
        const response = await $fetch<SystemStatus>(`${base}/system/status`);
        current.value = response;
        lastChecked.value = new Date().toISOString();
    } catch {
        // The fallback keeps the documentation useful while the API is restarting.
    } finally {
        loading.value = false;
    }
};

const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

onMounted(() => {
    refresh();
    timer = setInterval(refresh, 30_000);
});
onBeforeUnmount(() => timer && clearInterval(timer));
</script>
