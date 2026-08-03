<template>
    <div class="min-h-screen bg-[#07090c] pt-14 text-[#edf1f7]">
        <section
            class="relative flex min-h-[calc(100vh-3.5rem)] flex-col overflow-hidden"
            :class="activeOs === 'windows' ? 'workspace-windows' : 'workspace-parrot'"
            aria-labelledby="workspace-title"
        >
            <header
                class="relative z-40 flex min-h-12 items-center justify-between gap-3 border-b border-white/10 bg-[#090b0f]/88 px-3 backdrop-blur-xl sm:px-4"
            >
                <div class="flex min-w-0 items-center gap-2">
                    <MonitorDot :size="16" class="shrink-0 text-[#84a9ff]" />
                    <h1 id="workspace-title" class="truncate text-xs font-medium">
                        Mi entorno
                    </h1>
                    <span class="hidden text-[11px] text-white/38 sm:inline">/ sesión pública</span>
                </div>

                <div
                    class="flex shrink-0 items-center rounded-md border border-white/10 bg-white/[0.045] p-0.5"
                    role="group"
                    aria-label="Cambiar sistema operativo"
                >
                    <button
                        v-for="profile in osProfiles"
                        :key="profile.id"
                        type="button"
                        class="flex cursor-pointer items-center gap-1.5 rounded-[4px] px-2 py-1 text-[11px] transition-colors sm:px-2.5"
                        :class="activeOs === profile.id ? 'bg-white/12 text-white' : 'text-white/45 hover:text-white/80'"
                        :aria-pressed="activeOs === profile.id"
                        @click="switchOs(profile.id)"
                    >
                        <component :is="profile.icon" :size="13" />
                        {{ profile.shortLabel }}
                    </button>
                </div>

                <div class="hidden items-center gap-3 text-[11px] text-white/45 sm:flex">
                    <span class="flex items-center gap-1.5">
                        <Wifi :size="14" /> invitado
                    </span>
                    <time>{{ currentTime }}</time>
                </div>
            </header>

            <div ref="desktopRef" class="workspace-desktop relative min-h-[42rem] flex-1 overflow-hidden">
                <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div class="workspace-orb workspace-orb-one" />
                    <div class="workspace-orb workspace-orb-two" />
                    <div class="workspace-grid" />
                </div>

                <div
                    class="absolute top-4 right-4 z-10 hidden w-56 rounded-lg border border-white/10 bg-[#090b0f]/48 p-3 text-[11px] text-white/50 backdrop-blur-md lg:block"
                >
                    <div class="mb-2 flex items-center justify-between text-white/78">
                        <span class="flex items-center gap-1.5"><Activity :size="14" /> Estado</span>
                        <span class="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                    </div>
                    <div class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
                        <span>Perfil</span><span class="text-white/75">{{ currentProfile.label }}</span>
                        <span>Modo</span><span class="text-white/75">solo lectura</span>
                        <span>Sesión</span><span class="font-mono text-white/75">guest-01</span>
                    </div>
                </div>

                <div
                    class="relative z-10 grid w-fit grid-cols-3 gap-x-2 gap-y-3 p-3 pb-24 sm:grid-cols-2 sm:p-4"
                    aria-label="Aplicaciones del escritorio"
                >
                    <button
                        v-for="app in currentApps"
                        :key="`${activeOs}-${app.id}`"
                        type="button"
                        class="group flex w-[4.7rem] cursor-grab touch-none flex-col items-center gap-1.5 rounded-md p-1.5 text-center text-[10px] leading-3.5 text-white/85 transition-colors hover:bg-white/10 focus:bg-white/10 active:cursor-grabbing"
                        :style="iconStyle(app.id)"
                        :aria-label="`Abrir ${app.name}`"
                        @pointerdown="startIconDrag($event, app.id)"
                        @dblclick="openApp(app)"
                        @keydown.enter="openApp(app)"
                    >
                        <span
                            class="grid size-10 place-items-center rounded-xl border border-white/12 bg-[#10141b]/86 shadow-[0_8px_24px_rgba(0,0,0,.28)] transition-transform group-hover:-translate-y-0.5"
                            :style="{ color: app.color }"
                        >
                            <component :is="app.icon" :size="21" :stroke-width="1.65" />
                        </span>
                        <span class="line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,.95)]">{{ app.name }}</span>
                    </button>
                </div>

                <article
                    v-for="windowItem in visibleWindows"
                    :key="windowItem.key"
                    class="workspace-window absolute z-20 flex min-h-72 w-[min(43rem,calc(100%-2rem))] flex-col overflow-hidden rounded-lg border border-white/13 bg-[#0c0f14]/96 shadow-[0_28px_90px_rgba(0,0,0,.58)] backdrop-blur-xl"
                    :class="activeWindowKey === windowItem.key ? 'ring-1 ring-white/10' : 'brightness-90'"
                    :style="windowStyle(windowItem)"
                    @pointerdown="focusWindow(windowItem.key)"
                >
                    <div
                        class="flex h-10 shrink-0 touch-none items-center justify-between border-b border-white/10 bg-white/[0.035] px-3"
                        @pointerdown="startWindowDrag($event, windowItem.key)"
                    >
                        <div class="flex min-w-0 items-center gap-2 text-xs text-white/72">
                            <component :is="windowItem.app.icon" :size="15" :style="{ color: windowItem.app.color }" />
                            <span class="truncate">{{ windowItem.app.windowTitle || windowItem.app.name }}</span>
                        </div>
                        <div class="flex items-center gap-1" @pointerdown.stop>
                            <button
                                type="button"
                                class="grid size-6 cursor-pointer place-items-center rounded text-white/40 hover:bg-white/10 hover:text-white"
                                :aria-label="`Minimizar ${windowItem.app.name}`"
                                @click="minimizeWindow(windowItem.key)"
                            >
                                <Minus :size="13" />
                            </button>
                            <button
                                type="button"
                                class="grid size-6 cursor-pointer place-items-center rounded text-white/40 hover:bg-red-500/80 hover:text-white"
                                :aria-label="`Cerrar ${windowItem.app.name}`"
                                @click="closeWindow(windowItem.key)"
                            >
                                <X :size="13" />
                            </button>
                        </div>
                    </div>

                    <div v-if="windowItem.app.id === 'readme'" class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
                        <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                            <div>
                                <p class="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[#84a9ff]">readme.md</p>
                                <h2 class="mt-2 mb-0 text-2xl font-medium tracking-[-0.035em] sm:text-3xl">Esto es mi escritorio. Más o menos.</h2>
                            </div>
                            <FileText :size="22" class="shrink-0 text-white/32" />
                        </div>
                        <div class="mt-5 grid gap-6 text-[13px] leading-6 text-white/58 md:grid-cols-[1fr_13rem]">
                            <div>
                                <p class="m-0 text-white/82">
                                    No es Windows metido en una web ni una terminal conectada a mi equipo. Es una forma de enseñar con qué trabajo y cómo separo el desarrollo diario del laboratorio de seguridad.
                                </p>
                                <p class="mt-4 mb-0">
                                    Puedes cambiar de sistema, abrir herramientas, mover iconos y curiosear sin registrarte. Las aplicaciones son fichas interactivas: explican para qué las uso, pero no ejecutan software real.
                                </p>
                                <p class="mt-4 mb-0">
                                    Si más adelante añado una acción que necesite identidad —guardar una sesión, lanzar una demo o compartir un laboratorio— pediré un código por email en ese momento. Para mirar, no.
                                </p>
                            </div>
                            <aside class="rounded-md border border-white/10 bg-white/[0.035] p-3">
                                <p class="m-0 text-[11px] font-medium text-white/80">Prueba esto</p>
                                <ol class="mt-2 mb-0 list-decimal space-y-1 pl-4 text-[11px] leading-5">
                                    <li>Cambia entre Work y Parrot.</li>
                                    <li>Abre Stack o Hardware.</li>
                                    <li>Mueve una ventana.</li>
                                    <li>Usa el terminal de invitado.</li>
                                </ol>
                            </aside>
                        </div>
                        <div class="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                            <button type="button" class="workspace-button" @click="openAppById('stack')">
                                <Braces :size="14" /> Ver stack
                            </button>
                            <button type="button" class="workspace-button workspace-button-muted" @click="showAccess = true">
                                <KeyRound :size="14" /> Acción con acceso
                            </button>
                        </div>
                    </div>

                    <div v-else-if="windowItem.app.id === 'stack'" class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                        <p class="m-0 text-[11px] text-white/42">Tecnologías con las que trabajo de verdad</p>
                        <div class="mt-4 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
                            <div v-for="group in stackGroups" :key="group.title" class="bg-[#0c0f14] p-4">
                                <p class="m-0 text-xs font-medium text-white/82">{{ group.title }}</p>
                                <div class="mt-3 flex flex-wrap gap-1.5">
                                    <span v-for="item in group.items" :key="item" class="rounded border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[10px] text-white/52">{{ item }}</span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-4 mb-0 text-[11px] leading-5 text-white/40">No es una nube de logos: está ordenado por el papel que ocupa cada tecnología en mis proyectos.</p>
                    </div>

                    <div v-else-if="windowItem.app.id === 'hardware'" class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                        <div class="grid gap-5 md:grid-cols-[1fr_15rem]">
                            <div>
                                <p class="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300">workbench / en construcción</p>
                                <h2 class="mt-2 mb-0 text-2xl font-medium tracking-[-0.03em]">Hardware y reparación</h2>
                                <p class="mt-3 mb-0 text-[13px] leading-6 text-white/58">Esta parte no está cerrada todavía. La idea es documentar procesos reales de diagnóstico y reparación, no añadir otra lista de herramientas.</p>
                            </div>
                            <div class="rounded-md border border-amber-300/15 bg-amber-300/[0.045] p-3 text-[11px] leading-5 text-white/52">
                                <Wrench :size="16" class="mb-2 text-amber-300" />
                                Buen contenido aquí: caso, síntomas, medidas, hipótesis, reparación y resultado.
                            </div>
                        </div>
                        <div class="mt-5 grid gap-2 sm:grid-cols-2">
                            <div v-for="item in hardwareIdeas" :key="item.title" class="rounded-md border border-white/10 bg-white/[0.025] p-3">
                                <div class="flex items-center gap-2 text-xs text-white/78"><component :is="item.icon" :size="15" />{{ item.title }}</div>
                                <p class="mt-2 mb-0 text-[11px] leading-5 text-white/45">{{ item.text }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="windowItem.app.id === 'terminal'" class="min-h-0 flex-1 overflow-y-auto bg-[#07090b] p-4 font-mono text-[11px] leading-6 text-white/55">
                        <p class="m-0 text-emerald-300">guest@impablo:~$ <span class="text-white/72">whoami</span></p>
                        <p class="m-0">visitor — public, isolated, read-only</p>
                        <p class="m-0 text-emerald-300">guest@impablo:~$ <span class="text-white/72">profile --current</span></p>
                        <p class="m-0">{{ currentProfile.terminalProfile }}</p>
                        <p class="m-0 text-emerald-300">guest@impablo:~$ <span class="text-white/72">help</span></p>
                        <p class="m-0">open [tool] · profile [work|parrot] · clear</p>
                        <p class="m-0"><span class="text-emerald-300">guest@impablo:~$</span> <span class="terminal-caret">_</span></p>
                    </div>

                    <div v-else class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                        <div class="flex items-start gap-4">
                            <span class="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.035]" :style="{ color: windowItem.app.color }">
                                <component :is="windowItem.app.icon" :size="24" :stroke-width="1.5" />
                            </span>
                            <div>
                                <p class="m-0 text-[10px] uppercase tracking-[0.14em] text-white/35">{{ windowItem.app.category }}</p>
                                <h2 class="mt-1 mb-0 text-2xl font-medium tracking-[-0.03em]">{{ windowItem.app.name }}</h2>
                            </div>
                        </div>
                        <p class="mt-6 mb-0 max-w-xl text-[13px] leading-6 text-white/60">{{ windowItem.app.description }}</p>
                        <div class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 text-[11px]">
                            <div class="bg-[#0c0f14] p-3 text-white/40">Entorno</div>
                            <div class="bg-[#0c0f14] p-3 text-white/72">{{ currentProfile.label }}</div>
                            <div class="bg-[#0c0f14] p-3 text-white/40">Uso</div>
                            <div class="bg-[#0c0f14] p-3 text-white/72">{{ windowItem.app.usage }}</div>
                        </div>
                        <p class="mt-4 mb-0 flex items-center gap-2 text-[10px] text-white/35"><ShieldCheck :size="13" />Vista de portfolio. La aplicación real no se ejecuta aquí.</p>
                    </div>
                </article>
            </div>

            <div class="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center px-3">
                <div class="pointer-events-auto flex max-w-full items-center gap-1 rounded-xl border border-white/13 bg-[#090b0f]/82 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,.48)] backdrop-blur-2xl">
                    <button
                        type="button"
                        class="grid size-9 cursor-pointer place-items-center rounded-lg text-[#84a9ff] transition-colors hover:bg-white/10"
                        aria-label="Abrir archivo de bienvenida"
                        @click="openAppById('readme')"
                    >
                        <LayoutGrid :size="18" />
                    </button>
                    <span class="mx-0.5 h-6 w-px bg-white/10" />
                    <button
                        v-for="windowItem in currentOpenWindows"
                        :key="`dock-${windowItem.key}`"
                        type="button"
                        class="relative grid size-9 cursor-pointer place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                        :class="!windowItem.minimized && activeWindowKey === windowItem.key ? 'bg-white/10 text-white' : ''"
                        :aria-label="`Mostrar ${windowItem.app.name}`"
                        @click="restoreWindow(windowItem.key)"
                    >
                        <component :is="windowItem.app.icon" :size="17" :style="{ color: windowItem.app.color }" />
                        <i class="absolute bottom-0.5 h-0.5 w-3 rounded-full bg-white/55" />
                    </button>
                    <span class="mx-0.5 h-6 w-px bg-white/10" />
                    <button type="button" class="grid size-9 cursor-pointer place-items-center rounded-lg text-white/48 hover:bg-white/10 hover:text-white" aria-label="Información sobre el acceso" @click="showAccess = true">
                        <LockKeyhole :size="16" />
                    </button>
                </div>
            </div>

            <Transition name="boot-fade">
                <div v-if="booting" class="absolute inset-0 z-50 grid place-items-center bg-[#07090c] px-5" aria-live="polite">
                    <div class="w-full max-w-sm">
                        <div class="mb-7 flex items-center gap-3">
                            <component :is="currentProfile.icon" :size="25" class="text-[#84a9ff]" />
                            <div>
                                <p class="m-0 text-sm font-medium">{{ currentProfile.bootName }}</p>
                                <p class="mt-1 mb-0 text-[10px] text-white/36">public workspace / isolated session</p>
                            </div>
                        </div>
                        <div class="space-y-1 font-mono text-[10px] leading-5 text-white/38">
                            <p class="m-0">mounting /tools ........................ ok</p>
                            <p class="m-0">loading public profile ................. ok</p>
                            <p class="m-0">network policy .................. read-only</p>
                        </div>
                        <div class="mt-5 h-px overflow-hidden bg-white/10"><i class="boot-progress block h-full bg-[#84a9ff]" /></div>
                    </div>
                </div>
            </Transition>
        </section>

        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="showAccess" class="fixed inset-0 z-[100] grid place-items-center bg-black/72 p-4 backdrop-blur-sm" @click.self="showAccess = false">
                    <section class="w-full max-w-md overflow-hidden rounded-lg border border-white/13 bg-[#0d1015] text-[#edf1f7] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="access-title">
                        <div class="flex h-11 items-center justify-between border-b border-white/10 px-4">
                            <span class="flex items-center gap-2 text-xs text-white/62"><KeyRound :size="15" />Verificación puntual</span>
                            <button type="button" class="grid size-7 cursor-pointer place-items-center rounded text-white/40 hover:bg-white/10 hover:text-white" aria-label="Cerrar" @click="showAccess = false"><X :size="14" /></button>
                        </div>
                        <div class="p-5 sm:p-6">
                            <h2 id="access-title" class="m-0 text-2xl font-medium tracking-[-0.03em]">Solo cuando haga falta.</h2>
                            <p class="mt-3 mb-0 text-[13px] leading-6 text-white/52">La exploración siempre es pública. Este paso serviría para acciones que creen estado o consuman recursos: guardar una sesión, lanzar una demo o entrar en un laboratorio compartido.</p>
                            <form class="mt-5" @submit.prevent="accessRequested = true">
                                <label for="workspace-email" class="block text-[11px] text-white/48">Email para recibir un código</label>
                                <div class="mt-2 flex gap-2">
                                    <input id="workspace-email" v-model="email" required type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" class="min-w-0 flex-1 rounded-md border border-white/12 bg-white/[0.035] px-3 py-2 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#84a9ff]" />
                                    <button type="submit" class="workspace-button shrink-0">Continuar</button>
                                </div>
                            </form>
                            <p v-if="accessRequested" class="mt-3 mb-0 rounded-md border border-amber-300/15 bg-amber-300/[0.045] p-3 text-[11px] leading-5 text-white/52">Este es el punto de integración, no un formulario que finja enviar nada. El backend de códigos se conectaría aquí.</p>
                        </div>
                    </section>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import {
    Activity,
    AppWindow,
    Binary,
    Boxes,
    Braces,
    Bug,
    Code2,
    Container,
    Cpu,
    Database,
    FileCode2,
    FileKey2,
    FileText,
    GitBranch,
    Hammer,
    HardDrive,
    KeyRound,
    Laptop,
    LayoutGrid,
    LockKeyhole,
    MemoryStick,
    Minus,
    Monitor,
    MonitorDot,
    Network,
    PackageSearch,
    RadioTower,
    ScanLine,
    Server,
    ShieldCheck,
    Smartphone,
    Terminal,
    Wifi,
    Wrench,
    X,
    Zap,
} from "@lucide/vue";

type OsId = "windows" | "parrot";
type AppDefinition = {
    id: string;
    name: string;
    windowTitle?: string;
    category: string;
    description: string;
    usage: string;
    color: string;
    icon: Component;
};
type WorkspaceWindow = {
    key: string;
    app: AppDefinition;
    x: number;
    y: number;
    z: number;
    minimized: boolean;
};

const sharedApps: AppDefinition[] = [
    { id: "readme", name: "Léeme", windowTitle: "readme.md — Bienvenida", category: "Sistema", description: "Una nota breve sobre esta sección.", usage: "Orientación", color: "#84a9ff", icon: FileText },
    { id: "stack", name: "Stack", windowTitle: "stack.yml — Tecnologías", category: "Desarrollo", description: "Lenguajes y tecnologías, ordenados por cómo los uso.", usage: "Referencia", color: "#c4b5fd", icon: Braces },
    { id: "hardware", name: "Hardware", windowTitle: "workbench — Hardware y reparación", category: "Taller", description: "Ideas y futuros casos sobre diagnóstico, móviles y reparación.", usage: "Documentación", color: "#fcd34d", icon: Wrench },
    { id: "terminal", name: "Terminal", category: "Sistema", description: "Una consola de invitado aislada para explorar comandos de demostración.", usage: "Shell / automatización", color: "#6ee7b7", icon: Terminal },
];

const windowsApps: AppDefinition[] = [
    ...sharedApps,
    { id: "vscode", name: "VS Code", category: "Editor", description: "Mi editor principal para Vue, Python, Rust y los pequeños cambios que acaban convirtiéndose en una tarde completa.", usage: "Diario", color: "#5aa9e6", icon: Code2 },
    { id: "codex", name: "Codex", category: "AI / desarrollo", description: "Lo uso como compañero de implementación y revisión: para explorar bases de código, probar hipótesis y cerrar tareas concretas.", usage: "Frecuente", color: "#d8f3dc", icon: Binary },
    { id: "docker", name: "Docker", category: "Infraestructura", description: "Entornos reproducibles para el frontend, las APIs y PostgreSQL sin depender de la configuración de una sola máquina.", usage: "Contenedores", color: "#60a5fa", icon: Container },
    { id: "datagrip", name: "DataGrip", category: "Datos", description: "Trabajo con esquemas, consultas complejas y revisión de datos cuando necesito algo más completo que una consola SQL.", usage: "SQL / modelado", color: "#fb7185", icon: Database },
    { id: "heidisql", name: "HeidiSQL", category: "Datos", description: "Cliente ligero para inspecciones rápidas, cambios pequeños y conexiones que no necesitan abrir un IDE completo.", usage: "SQL rápido", color: "#fda4af", icon: Server },
    { id: "redis", name: "Redis", category: "Datos", description: "Caché, colas y estados efímeros cuando una base relacional no es la pieza adecuada.", usage: "Servicios", color: "#f87171", icon: Zap },
    { id: "vmware", name: "VMware", category: "Virtualización", description: "Máquinas aisladas para probar sistemas, redes y laboratorios sin mezclarlo con el entorno de trabajo.", usage: "Laboratorios", color: "#fbbf24", icon: Boxes },
    { id: "git", name: "Git", category: "Control de versiones", description: "Historial, ramas y revisiones pequeñas. La parte menos vistosa y más importante del trabajo diario.", usage: "Diario", color: "#fb923c", icon: GitBranch },
    { id: "github", name: "GitHub Desktop", category: "Control de versiones", description: "Vista gráfica para revisar cambios y operaciones cotidianas cuando no aporta nada hacerlo desde terminal.", usage: "Flujo visual", color: "#e5e7eb", icon: GitBranch },
];

const parrotApps: AppDefinition[] = [
    ...sharedApps,
    { id: "nmap", name: "Nmap", category: "Reconocimiento", description: "Descubrimiento de hosts, servicios y superficies expuestas dentro de entornos autorizados.", usage: "Labs / auditoría", color: "#67e8f9", icon: ScanLine },
    { id: "ffuf", name: "ffuf + wfuzz", category: "Web security", description: "Enumeración y fuzzing de rutas y parámetros en laboratorios o aplicaciones con permiso explícito.", usage: "Descubrimiento web", color: "#a7f3d0", icon: PackageSearch },
    { id: "burp", name: "Burp Suite", category: "Web security", description: "Proxy de interceptación para entender y probar el flujo real entre navegador y aplicación.", usage: "Análisis HTTP", color: "#fb923c", icon: Bug },
    { id: "caido", name: "Caido", category: "Web security", description: "Una alternativa moderna y ligera para inspeccionar tráfico, repetir peticiones y organizar pruebas web.", usage: "Análisis HTTP", color: "#a78bfa", icon: RadioTower },
    { id: "htb", name: "HTB Labs", windowTitle: "lab-access.ovpn — Hack The Box", category: "Laboratorio", description: "Perfiles VPN para laboratorios de Hack The Box. Aquí solo se representa el flujo; nunca se expone un archivo .ovpn real.", usage: "Entorno autorizado", color: "#9ef01a", icon: FileKey2 },
    { id: "wireshark", name: "Wireshark", category: "Redes", description: "Captura y lectura de tráfico para entender protocolos, errores de red y comportamiento inesperado.", usage: "Análisis de red", color: "#60a5fa", icon: Network },
    { id: "ghidra", name: "Ghidra", category: "Reverse engineering", description: "Una pieza que encaja si quieres enseñar análisis estático o reversing mediante casos concretos, no solo mediante un icono.", usage: "Por documentar", color: "#f87171", icon: FileCode2 },
];

const osProfiles = [
    { id: "windows" as const, label: "Windows / Work", shortLabel: "Work", bootName: "Workstation", terminalProfile: "windows-dev / PowerShell 7 / WSL", icon: Monitor },
    { id: "parrot" as const, label: "ParrotOS / Lab", shortLabel: "Parrot", bootName: "Parrot Security", terminalProfile: "parrot-lab / bash / isolated network", icon: ShieldCheck },
];

const stackGroups = [
    { title: "Aplicación", items: ["Vue", "Nuxt", "HTML", "CSS", "JavaScript", "TypeScript"] },
    { title: "Backend", items: ["Python", "Rust", "C/C++", "SQL"] },
    { title: "Shell y automatización", items: ["Bash", "PowerShell", "Git", "Docker"] },
    { title: "Datos", items: ["PostgreSQL", "Redis", "DataGrip", "HeidiSQL"] },
];

const hardwareIdeas = [
    { title: "ADB y Fastboot", text: "Diagnóstico Android, logs, recuperación y flujos reproducibles.", icon: Smartphone },
    { title: "Diagnóstico eléctrico", text: "Consumo, continuidad, líneas principales y cómo se llega a una hipótesis.", icon: Zap },
    { title: "Microsoldadura", text: "Casos documentados con fotos, aumento y criterios de reparación.", icon: Hammer },
    { title: "Banco de pruebas", text: "Adaptadores, almacenamiento, memoria y herramientas de inspección.", icon: MemoryStick },
];

const activeOs = ref<OsId>("windows");
const booting = ref(true);
const currentTime = ref("");
const desktopRef = ref<HTMLElement>();
const openWindows = ref<WorkspaceWindow[]>([]);
const activeWindowKey = ref("");
const iconPositions = reactive<Record<string, { x: number; y: number }>>({});
const showAccess = ref(false);
const email = ref("");
const accessRequested = ref(false);
let zCounter = 20;
let clockTimer: ReturnType<typeof setInterval> | undefined;
let bootTimer: ReturnType<typeof setTimeout> | undefined;
let suppressOpen = false;

const currentApps = computed(() => activeOs.value === "windows" ? windowsApps : parrotApps);
const currentProfile = computed(() => osProfiles.find((profile) => profile.id === activeOs.value) || osProfiles[0]);
const currentOpenWindows = computed(() =>
    openWindows.value.filter((item) => item.key.startsWith(`${activeOs.value}-`)),
);
const visibleWindows = computed(() => currentOpenWindows.value.filter((item) => !item.minimized));

const updateClock = () => {
    currentTime.value = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date());
};

const appForId = (id: string) => currentApps.value.find((app) => app.id === id) || sharedApps.find((app) => app.id === id);

const openApp = (app: AppDefinition) => {
    if (suppressOpen) return;
    const key = `${activeOs.value}-${app.id}`;
    const existing = openWindows.value.find((item) => item.key === key);
    if (existing) {
        existing.minimized = false;
        focusWindow(key);
        return;
    }
    const offset = openWindows.value.length % 5;
    const item: WorkspaceWindow = { key, app, x: 105 + offset * 24, y: 54 + offset * 22, z: ++zCounter, minimized: false };
    openWindows.value.push(item);
    activeWindowKey.value = key;
};

const openAppById = (id: string) => {
    const app = appForId(id);
    if (app) openApp(app);
};

const closeWindow = (key: string) => {
    openWindows.value = openWindows.value.filter((item) => item.key !== key);
    activeWindowKey.value = visibleWindows.value.at(-1)?.key || "";
};
const minimizeWindow = (key: string) => {
    const item = openWindows.value.find((entry) => entry.key === key);
    if (item) item.minimized = true;
};
const restoreWindow = (key: string) => {
    const item = openWindows.value.find((entry) => entry.key === key);
    if (!item) return;
    item.minimized = false;
    focusWindow(key);
};
const focusWindow = (key: string) => {
    const item = openWindows.value.find((entry) => entry.key === key);
    if (!item) return;
    item.z = ++zCounter;
    activeWindowKey.value = key;
};

const windowStyle = (item: WorkspaceWindow) => ({ left: `${item.x}px`, top: `${item.y}px`, zIndex: item.z });
const iconStyle = (id: string) => ({ transform: `translate3d(${iconPositions[id]?.x || 0}px, ${iconPositions[id]?.y || 0}px, 0)` });

const startWindowDrag = (event: PointerEvent, key: string) => {
    if (window.innerWidth < 768 || event.button !== 0) return;
    const item = openWindows.value.find((entry) => entry.key === key);
    if (!item) return;
    focusWindow(key);
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = item.x;
    const originY = item.y;
    const bounds = desktopRef.value?.getBoundingClientRect();
    const move = (moveEvent: PointerEvent) => {
        item.x = Math.max(8, Math.min((bounds?.width || window.innerWidth) - 300, originX + moveEvent.clientX - startX));
        item.y = Math.max(8, Math.min((bounds?.height || window.innerHeight) - 80, originY + moveEvent.clientY - startY));
    };
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
};

const startIconDrag = (event: PointerEvent, id: string) => {
    if (event.button !== 0) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = iconPositions[id] || { x: 0, y: 0 };
    let moved = false;
    const move = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
        iconPositions[id] = { x: origin.x + dx, y: origin.y + dy };
    };
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        if (moved) {
            suppressOpen = true;
            window.setTimeout(() => { suppressOpen = false; }, 50);
        } else {
            const app = appForId(id);
            if (app) openApp(app);
        }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
};

const switchOs = (os: OsId) => {
    if (os === activeOs.value || booting.value) return;
    activeOs.value = os;
    booting.value = true;
    activeWindowKey.value = "";
    accessRequested.value = false;
    window.clearTimeout(bootTimer);
    bootTimer = window.setTimeout(() => {
        booting.value = false;
        openAppById("readme");
    }, 900);
};

useSeoMeta({
    title: "Mi entorno — Pablo Diez",
    description: "Un escritorio interactivo para recorrer las herramientas, sistemas y laboratorios que forman mi entorno de trabajo.",
});

onMounted(() => {
    updateClock();
    clockTimer = window.setInterval(updateClock, 30_000);
    bootTimer = window.setTimeout(() => {
        booting.value = false;
        openAppById("readme");
    }, 1100);
});

onBeforeUnmount(() => {
    window.clearInterval(clockTimer);
    window.clearTimeout(bootTimer);
});
</script>

<style scoped>
.workspace-desktop {
    background: radial-gradient(circle at 72% 38%, rgba(67, 91, 147, 0.2), transparent 31%), #090c12;
}

.workspace-parrot .workspace-desktop {
    background: radial-gradient(circle at 70% 42%, rgba(25, 132, 122, 0.2), transparent 30%), #07100f;
}

.workspace-grid {
    position: absolute;
    inset: 0;
    opacity: 0.12;
    background-image: linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 3.5rem 3.5rem;
    mask-image: linear-gradient(to bottom right, black, transparent 72%);
}

.workspace-orb {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    filter: blur(0.1px);
}

.workspace-orb-one { right: 9%; top: 15%; width: min(45vw, 38rem); aspect-ratio: 1; }
.workspace-orb-two { right: 23%; top: 32%; width: min(27vw, 22rem); aspect-ratio: 1; }
.workspace-parrot .workspace-orb { border-color: rgba(74, 222, 128, 0.12); }

.workspace-button {
    display: inline-flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    border-radius: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #edf1f7;
    padding: 0.48rem 0.7rem;
    color: #090b0f;
    font-size: 0.7rem;
    font-weight: 500;
    transition: background-color 180ms ease, border-color 180ms ease;
}

.workspace-button:hover { background: #fff; }
.workspace-button-muted { background: rgba(255, 255, 255, 0.04); color: rgba(255, 255, 255, 0.7); }
.workspace-button-muted:hover { background: rgba(255, 255, 255, 0.09); }

.terminal-caret { animation: caret 1s steps(1) infinite; }
.boot-progress { animation: boot 1.05s cubic-bezier(0.2, 0.75, 0.2, 1) forwards; }
.boot-fade-leave-active, .modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 220ms ease; }
.boot-fade-leave-to, .modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@keyframes caret { 50% { opacity: 0; } }
@keyframes boot { from { width: 0; } to { width: 100%; } }

@media (max-width: 767px) {
    .workspace-window {
        inset: 0.75rem 0.75rem 4.75rem !important;
        width: auto !important;
        min-height: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .terminal-caret, .boot-progress { animation: none; }
    .boot-progress { width: 100%; }
}
</style>
