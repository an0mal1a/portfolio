<template>
    <div id="top" class="min-h-screen bg-background pt-14">
        <div
            class="sticky top-14 z-30 border-b border-line bg-background/90 backdrop-blur-xl"
        >
            <div
                class="mx-auto flex h-12 max-w-[92rem] items-center justify-between px-4 sm:px-6"
            >
                <div class="flex min-w-0 items-center gap-2 text-xs text-muted">
                    <Boxes :size="16" />
                    <span class="hidden sm:inline">Plataforma</span>
                    <ChevronRight :size="16" class="hidden sm:block" />
                    <span class="truncate text-ink"
                        >Documentación del sistema</span
                    >
                </div>
                <div class="relative w-48 sm:w-64">
                    <label
                        class="flex items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1.5 text-xs text-muted transition-colors focus-within:border-line-strong"
                    >
                        <Search :size="16" class="shrink-0" />
                        <input
                            ref="searchInput"
                            v-model.trim="searchQuery"
                            type="search"
                            placeholder="Buscar documentación"
                            class="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-ink outline-none placeholder:text-muted"
                            @keydown.esc="searchQuery = ''"
                        />
                        <span
                            class="hidden items-center gap-1 rounded-sm border border-line px-1.5 py-0.5 text-[10px] sm:flex"
                            ><Command :size="12" />K</span
                        >
                    </label>
                    <div
                        v-if="searchQuery"
                        class="absolute top-full right-0 mt-1 w-full rounded-sm border border-line bg-surface p-1 shadow-2xl"
                    >
                        <a
                            v-for="item in searchResults"
                            :key="item.id"
                            :href="`#${item.id}`"
                            class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-muted hover:bg-surface-raised hover:text-ink"
                            @click="searchQuery = ''"
                        >
                            <component :is="item.icon" :size="16" />
                            {{ item.label }}
                        </a>
                        <p
                            v-if="!searchResults.length"
                            class="m-0 px-2 py-2 text-xs text-muted"
                        >
                            Sin resultados
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="mx-auto grid min-w-0 max-w-[92rem] lg:grid-cols-[14rem_minmax(0,1fr)]"
        >
            <aside
                class="min-w-0 border-b border-line bg-background-secondary p-2 lg:sticky lg:top-26 lg:h-[calc(100vh-6.5rem)] lg:border-r lg:border-b-0"
            >
                <div
                    class="mb-3 rounded-sm border border-line bg-surface p-2.5"
                >
                    <div class="flex items-center justify-between">
                        <span
                            class="flex items-center gap-2 text-xs font-medium"
                            ><Box :size="16" />impablo.dev</span
                        >
                        <span class="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div
                        class="mt-3 grid grid-cols-2 gap-1 text-[10px] text-muted"
                    >
                        <span>Producción</span>
                        <span class="text-right">v2.1.0</span>
                    </div>
                </div>

                <div
                    v-for="group in navigation"
                    :key="group.label"
                    class="mb-4"
                >
                    <p
                        class="px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-muted"
                    >
                        {{ group.label }}
                    </p>
                    <nav
                        class="flex w-full max-w-full gap-1 overflow-x-auto lg:block lg:space-y-0.5"
                        :aria-label="group.label"
                    >
                        <a
                            v-for="item in group.items"
                            :key="item.id"
                            :href="`#${item.id}`"
                            class="flex shrink-0 items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-muted transition-colors hover:bg-surface hover:text-ink lg:w-full"
                            :class="
                                activeSection === item.id
                                    ? '!bg-surface-raised !text-ink'
                                    : ''
                            "
                        >
                            <component :is="item.icon" :size="16" />
                            {{ item.label }}
                        </a>
                    </nav>
                </div>

                <div
                    class="mt-auto hidden border-t border-line px-2 pt-3 text-xs leading-5 text-muted lg:block"
                >
                    <div class="mb-1 flex items-center gap-2 text-ink">
                        <RefreshCw :size="16" />Documentación viva
                    </div>
                    Se actualiza junto al producto y describe el repositorio
                    real.
                </div>
            </aside>

            <main class="min-w-0 px-4 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-16">
                <div class="mx-auto max-w-5xl">
                    <article
                        id="overview"
                        data-doc-section
                        class="scroll-mt-32 pb-16"
                        data-reveal
                    >
                        <div
                            class="flex flex-wrap items-center gap-2 text-xs text-muted"
                        >
                            <span
                                class="flex items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1"
                                ><Radio
                                    :size="16"
                                    class="text-emerald-400"
                                />Producción operativa</span
                            >
                            <span
                                class="rounded-sm border border-line px-2 py-1"
                                >Actualizado hoy</span
                            >
                            <span
                                class="rounded-sm border border-line px-2 py-1"
                                >4 servicios</span
                            >
                        </div>

                        <h1
                            class="mt-7 mb-0 text-balance font-display text-[clamp(4.6rem,9vw,9rem)] leading-[0.72] tracking-[-0.03em]"
                        >
                            Un producto que puedes abrir por dentro.
                        </h1>
                        <p
                            class="mt-7 max-w-2xl text-base leading-7 text-muted"
                        >
                            Este portfolio es la interfaz pública de un pequeño
                            sistema distribuido. Nuxt renderiza la experiencia,
                            Rust expone los datos, Python ejecuta procesos
                            internos y PostgreSQL mantiene las relaciones.
                        </p>

                        <div class="mt-10 grid gap-2 sm:grid-cols-3">
                            <div
                                v-for="metric in metrics"
                                :key="metric.label"
                                class="rounded-sm border border-line bg-surface p-3"
                            >
                                <div
                                    class="flex items-center justify-between text-muted"
                                >
                                    <component
                                        :is="metric.icon"
                                        :size="16"
                                    /><span class="text-[10px]">{{
                                        metric.change
                                    }}</span>
                                </div>
                                <strong
                                    class="mt-7 block text-2xl font-medium tracking-[-0.04em]"
                                    >{{ metric.value }}</strong
                                >
                                <span class="mt-1 block text-xs text-muted">{{
                                    metric.label
                                }}</span>
                            </div>
                        </div>

                        <section
                            class="mt-3 overflow-hidden rounded-sm border border-line bg-background-secondary"
                        >
                            <div
                                class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted"
                            >
                                <span class="flex items-center gap-2"
                                    ><Workflow :size="16" />Mapa de
                                    arquitectura</span
                                ><span>Petición pública</span>
                            </div>
                            <div
                                class="grid gap-px bg-line p-px md:grid-cols-4"
                            >
                                <div
                                    v-for="(node, index) in architecture"
                                    :key="node.name"
                                    class="relative bg-surface p-3"
                                >
                                    <component
                                        :is="node.icon"
                                        :size="16"
                                        class="mb-8 text-muted"
                                    />
                                    <strong class="block text-sm font-medium">{{
                                        node.name
                                    }}</strong>
                                    <span
                                        class="mt-1 block text-xs text-muted"
                                        >{{ node.detail }}</span
                                    >
                                    <ArrowRight
                                        v-if="index < architecture.length - 1"
                                        :size="16"
                                        class="absolute top-1/2 -right-2.5 z-10 hidden rounded-full bg-background text-signal md:block"
                                    />
                                </div>
                            </div>
                        </section>
                    </article>

                    <article
                        id="frontend"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Aplicación / 01"
                            title="Frontend"
                            description="Una interfaz renderizada en servidor, tipada y construida con una capa visual Tailwind-first."
                        />
                        <div class="mt-9 grid gap-2 sm:grid-cols-2">
                            <DocCard
                                number="01"
                                title="Nuxt 4"
                                text="Rutas por archivos, SSR, metadatos SEO y composables para mantener las páginas predecibles."
                            />
                            <DocCard
                                number="02"
                                title="Vue 3"
                                text="Componentes reactivos pequeños para filtros, formularios, hora local y movimiento."
                            />
                            <DocCard
                                number="03"
                                title="Tailwind 4"
                                text="Layout, color, tipografía y responsive viven en utilidades. El CSS manual queda limitado a efectos globales."
                            />
                            <DocCard
                                number="04"
                                title="Contratos tipados"
                                text="Proyectos, repositorios, clientes y colaboradores comparten un único modelo de datos."
                            />
                            <DocCard
                                number="05"
                                title="Carga por recurso"
                                text="Cada vista solicita solo los endpoints que necesita. Un fallo parcial conserva el resto del contenido disponible."
                            />
                            <DocCard
                                number="06"
                                title="Recuperación SSR"
                                text="Tras una recarga, Nuxt hidrata el estado del servidor y reintenta en cliente únicamente los recursos que fallaron."
                            />
                        </div>
                        <CodeBlock
                            filename="app/composables/usePortfolio.ts"
                            :lines="frontendCode"
                        />
                    </article>

                    <article
                        id="public-api"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Aplicación / 02"
                            title="API pública"
                            description="El servicio Rust es el borde de lectura del sistema y el único backend expuesto al navegador."
                        />
                        <div class="mt-7 flex flex-wrap items-center gap-2">
                            <a
                                href="https://rust-api.impablo.dev/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                            >
                                Abrir documentación Swagger
                                <ArrowUpRight :size="16" />
                            </a>
                            <span class="rounded-sm border border-line bg-surface px-2 py-1 text-xs text-muted"
                                >7 rutas públicas</span
                            >
                        </div>
                        <div
                            class="mt-5 overflow-hidden rounded-sm border border-line bg-surface"
                        >
                            <div
                                class="grid grid-cols-[4rem_1fr] gap-3 border-b border-line px-3 py-2 text-xs text-muted sm:grid-cols-[4rem_11rem_1fr]"
                            >
                                <span>Método</span><span>Ruta</span
                                ><span class="hidden sm:block"
                                    >Descripción</span
                                >
                            </div>
                            <div
                                v-for="endpoint in endpoints"
                                :key="endpoint.path"
                                class="grid grid-cols-[4rem_1fr] gap-3 border-b border-line px-3 py-2.5 last:border-b-0 sm:grid-cols-[4rem_11rem_1fr] sm:items-center"
                            >
                                <span
                                    class="w-fit rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-300"
                                    >{{ endpoint.method }}</span
                                >
                                <code class="font-mono text-xs">{{
                                    endpoint.path
                                }}</code>
                                <span
                                    class="col-start-2 text-xs leading-5 text-muted sm:col-auto"
                                    >{{ endpoint.detail }}</span
                                >
                            </div>
                        </div>
                        <Callout title="Dos identidades de base de datos"
                            >La API abre pools separados para lectura y
                            escritura. Las consultas públicas quedan aisladas
                            del envío de contacto.</Callout
                        >
                        <Callout title="Fallos aislados"
                            >Proyectos, repositorios y clientes tienen claves de
                            caché y estados independientes. Una respuesta
                            fallida ya no invalida las otras dos.</Callout
                        >
                    </article>

                    <article
                        id="worker"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Aplicación / 03"
                            title="Python / Procesos internos"
                            description="Python/FastAPI trabaja detrás del producto: arranca los jobs, sincroniza GitHub y mantiene actualizado el grafo de repositorios sin entrar en la ruta de lectura del navegador."
                        />
                        <div class="mt-7 flex flex-wrap items-center gap-2">
                            <a
                                href="https://python-api.impablo.dev/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-raised"
                            >
                                Ver documentación de jobs
                                <ArrowUpRight :size="16" />
                            </a>
                            <span class="rounded-sm border border-line px-2 py-1 text-xs text-muted"
                                >/jobs · /jobs/status</span
                            >
                        </div>
                        <div class="mt-9 grid gap-2 sm:grid-cols-2">
                            <article
                                v-for="(step, index) in workerSteps"
                                :key="step.title"
                                class="flex gap-3 rounded-sm border border-line bg-surface p-3"
                            >
                                <span
                                    class="grid size-7 shrink-0 place-items-center rounded-sm border border-line bg-background font-mono text-xs text-muted"
                                    >{{ index + 1 }}</span
                                >
                                <div class="min-w-0">
                                    <strong class="block text-sm font-medium">{{ step.title }}</strong>
                                    <p class="mt-1 mb-0 text-xs leading-5 text-muted">{{ step.text }}</p>
                                    <code class="mt-3 block w-fit rounded-sm border border-line bg-background px-1.5 py-1 font-mono text-[10px] text-muted">{{ step.signal }}</code>
                                </div>
                            </article>
                        </div>
                        <div class="mt-2 grid gap-2 lg:grid-cols-[1.15fr_.85fr]">
                            <div class="overflow-hidden rounded-sm border border-line bg-surface">
                                <div class="flex h-10 items-center justify-between border-b border-line px-3 text-xs text-muted">
                                    <span class="flex items-center gap-2"><RefreshCw :size="16" />Ciclo del worker</span>
                                    <span>independiente de la petición</span>
                                </div>
                                <div class="grid gap-px bg-line p-px sm:grid-cols-2">
                                    <div v-for="stage in workerStages" :key="stage.title" class="bg-surface p-3">
                                        <strong class="block text-sm font-medium">{{ stage.title }}</strong>
                                        <p class="mt-1 mb-0 text-xs leading-5 text-muted">{{ stage.text }}</p>
                                    </div>
                                </div>
                            </div>
                            <Callout title="Por qué no lo hace Rust">
                                La API pública necesita respuestas pequeñas y predecibles. La sincronización, en cambio, tiene credenciales, llamadas externas y trabajo que puede tardar. Separarlo permite que un fallo de GitHub no bloquee la navegación.
                            </Callout>
                        </div>
                        <CodeBlock
                            filename="crons/tasks/github_sync.py"
                            :lines="workerCode"
                        />
                    </article>

                    <article
                        id="database"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Datos / 01"
                            title="PostgreSQL"
                            description="Los dominios se mantienen separados mientras las claves foráneas preservan las relaciones que aparecen en la interfaz."
                        />
                        <div class="mt-9 grid gap-2 sm:grid-cols-3">
                            <DocCard
                                number="P"
                                title="portfolio"
                                text="Proyectos y clientes con visibilidad, estado, fechas y enlaces externos."
                            />
                            <DocCard
                                number="G"
                                title="github"
                                text="Metadatos, lenguajes y colaboradores de repositorios de GitHub."
                            />
                            <DocCard
                                number="C"
                                title="contact"
                                text="Solicitudes de contacto escritas mediante una ruta y un rol restringidos."
                            />
                        </div>
                    </article>

                    <article
                        id="docker"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Operaciones / 01"
                            title="Docker"
                            description="Cuatro imágenes especializadas forman una unidad desplegable sin mezclar responsabilidades de ejecución."
                        />
                        <div
                            class="mt-9 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2"
                        >
                            <div
                                v-for="service in services"
                                :key="service.name"
                                class="bg-surface p-3"
                            >
                                <div
                                    class="mb-8 flex items-center justify-between"
                                >
                                    <component
                                        :is="service.icon"
                                        :size="16"
                                        class="text-muted"
                                    /><span
                                        class="flex items-center gap-2 text-xs text-muted"
                                        ><i
                                            class="size-1.5 rounded-full bg-emerald-500"
                                        />Puerto {{ service.port }}</span
                                    >
                                </div>
                                <strong class="block text-sm font-medium">{{
                                    service.name
                                }}</strong>
                                <span class="mt-1 block text-xs text-muted">{{
                                    service.image
                                }}</span>
                            </div>
                        </div>
                        <CodeBlock
                            filename="docker-compose.yml"
                            :lines="dockerCode"
                            collapsible
                            :preview-lines="15"
                        />
                    </article>

                    <article
                        id="request-flow"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Operaciones / 02"
                            title="Ciclo de petición"
                            description="El navegador recibe datos relacionados sin conocer las credenciales, los procesos internos ni el modelo relacional."
                        />
                        <div
                            class="mt-9 overflow-hidden rounded-sm border border-line bg-surface"
                        >
                            <div
                                v-for="(flow, index) in requestFlow"
                                :key="flow.title"
                                class="grid gap-3 border-b border-line p-3 last:border-b-0 sm:grid-cols-[2rem_12rem_1fr] sm:items-start"
                            >
                                <span
                                    class="grid size-7 place-items-center rounded-sm border border-line bg-background text-xs text-muted"
                                    >{{ index + 1 }}</span
                                >
                                <strong class="pt-1 text-sm font-medium">{{
                                    flow.title
                                }}</strong>
                                <p
                                    class="m-0 pt-1 text-xs leading-5 text-muted"
                                >
                                    {{ flow.text }}
                                </p>
                            </div>
                        </div>
                    </article>

                    <article
                        id="security"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Operaciones / 03"
                            title="Límites y seguridad"
                            description="La superficie pública es pequeña: orígenes restringidos, métodos limitados, roles distintos y escrituras protegidas."
                        />
                        <div class="mt-9 flex flex-wrap gap-2">
                            <span
                                v-for="item in safeguards"
                                :key="item"
                                class="flex items-center gap-2 rounded-sm border border-line bg-surface px-2 py-1 text-xs text-muted"
                                ><ShieldCheck :size="16" />{{ item }}</span
                            >
                        </div>
                        <Callout title="Protección de contacto"
                            >Las peticiones generales tienen un límite de 120
                            por minuto y la ruta de contacto uno independiente
                            de 3 por minuto.
                        </Callout>
                    </article>

                    <article
                        id="decisions"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Apéndice"
                            title="Por qué está construido así"
                            description="La arquitectura es más explícita de lo que un portfolio necesita. Ese es el objetivo: el sitio demuestra los principios de ingeniería que describe."
                        />
                        <NuxtLink
                            to="/projects"
                            class="mt-8 inline-flex items-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                        >
                            Ver proyectos
                            <ArrowUpRight :size="16" />
                        </NuxtLink>
                    </article>

                    <article
                        id="source-code"
                        data-doc-section
                        class="scroll-mt-32 border-t border-line py-16"
                        data-reveal
                    >
                        <DocHeading
                            eyebrow="Código / 01"
                            title="Source code"
                            description="La implementación completa de esta web es pública. El repositorio portfolio contiene el frontend, las APIs, los esquemas y la composición Docker que describe esta documentación."
                        />

                        <div
                            v-if="repositoryStatus === 'pending'"
                            class="mt-9 min-h-72 animate-pulse rounded-sm border border-line bg-surface"
                            aria-live="polite"
                        >
                            <span class="sr-only"
                                >Cargando repositorio portfolio</span
                            >
                        </div>

                        <article
                            v-else-if="portfolioRepository"
                            class="soft-noise relative mt-9 overflow-hidden rounded-sm border border-line bg-surface"
                        >
                            <div
                                class="flex h-11 items-center justify-between border-b border-line px-3 text-xs text-muted"
                            >
                                <span class="flex items-center gap-2">
                                    <GitFork :size="16" />
                                    {{ portfolioRepository.owner }} /
                                    {{ repositoryName(portfolioRepository) }}
                                </span>
                                <span class="flex items-center gap-2">
                                    <i
                                        class="size-1.5 rounded-full bg-signal"
                                    />
                                    {{ portfolioRepository.visibility }}
                                </span>
                            </div>

                            <div class="relative p-4 sm:p-6 lg:p-8">
                                <div
                                    class="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:4rem_4rem]"
                                />
                                <div class="relative">
                                    <Brackets :size="20" class="text-signal" />
                                    <h3
                                        class="mt-10 mb-0 font-display text-[clamp(4.5rem,9vw,9rem)] leading-[0.72] tracking-[-0.03em]"
                                    >
                                        [
                                        {{
                                            repositoryName(portfolioRepository)
                                        }}
                                        ]
                                    </h3>
                                    <p
                                        class="mt-6 mb-0 max-w-2xl text-sm leading-6 text-muted"
                                    >
                                        {{
                                            portfolioRepository.description ||
                                            "Código fuente y documentación técnica de impablo.dev."
                                        }}
                                    </p>

                                    <div
                                        class="mt-10 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div
                                            class="flex flex-wrap items-center gap-2"
                                        >
                                            <span
                                                v-if="
                                                    portfolioRepository.primary_language
                                                "
                                                class="flex items-center gap-2 rounded-sm border border-line bg-background/70 px-2 py-1 text-xs text-muted"
                                            >
                                                <i
                                                    class="size-1.5 rounded-full bg-signal"
                                                />
                                                {{
                                                    portfolioRepository.primary_language
                                                }}
                                            </span>
                                            <ContributorStack
                                                v-if="
                                                    portfolioRepository
                                                        .contributors?.length
                                                "
                                                :contributors="
                                                    portfolioRepository.contributors
                                                "
                                                :limit="6"
                                            />
                                            <span class="text-xs text-muted">
                                                {{
                                                    contributorCount(
                                                        portfolioRepository,
                                                    )
                                                }}
                                            </span>
                                        </div>

                                        <a
                                            v-if="
                                                portfolioRepository.repository_url
                                            "
                                            :href="
                                                portfolioRepository.repository_url
                                            "
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
                                        >
                                            Abrir en GitHub
                                            <ArrowUpRight :size="16" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <div
                            v-else-if="repositoryError"
                            class="mt-9 rounded-sm border border-line bg-surface p-6 text-sm text-muted"
                        >
                            <p class="m-0">
                                No se ha podido consultar el repositorio
                                <code class="font-mono text-ink">portfolio</code
                                >.
                            </p>
                            <button
                                type="button"
                                class="mt-5 rounded-sm bg-ink px-3 py-2 text-xs font-medium text-background"
                                @click="refreshRepositories()"
                            >
                                Reintentar conexión
                            </button>
                        </div>

                        <div
                            v-else
                            class="mt-9 rounded-sm border border-line bg-surface p-6 text-sm text-muted"
                        >
                            El repositorio
                            <code class="font-mono text-ink">portfolio</code> no
                            aparece en la respuesta pública.
                        </div>
                    </article>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Activity,
    AppWindow,
    ArrowRight,
    ArrowUpRight,
    Box,
    Boxes,
    Brackets,
    Braces,
    ChevronRight,
    Clock3,
    Command,
    Container,
    Cpu,
    Database,
    Gauge,
    GitFork,
    Network,
    Radio,
    RefreshCw,
    Route,
    Search,
    Server,
    ShieldCheck,
    Workflow,
} from "@lucide/vue";
import type { Repository } from "~/types/portfolio";

const navigation = [
    {
        label: "Inicio",
        items: [{ id: "overview", label: "Vista general", icon: Activity }],
    },
    {
        label: "Aplicación",
        items: [
            { id: "frontend", label: "Frontend", icon: Braces },
            { id: "public-api", label: "API pública", icon: Server },
            { id: "worker", label: "Procesos internos", icon: Cpu },
            { id: "database", label: "PostgreSQL", icon: Database },
        ],
    },
    {
        label: "Operaciones",
        items: [
            { id: "docker", label: "Docker", icon: Container },
            { id: "request-flow", label: "Ciclo de petición", icon: Route },
            { id: "security", label: "Seguridad", icon: ShieldCheck },
            { id: "decisions", label: "Decisiones", icon: Workflow },
        ],
    },
    {
        label: "Código fuente",
        items: [{ id: "source-code", label: "Este portfolio", icon: Brackets }],
    },
];

const {
    repositories,
    status: repositoryStatus,
    error: repositoryError,
    refresh: refreshRepositories,
} = useRepositories();
const activeSection = ref("overview");
const searchInput = ref<HTMLInputElement>();
const searchQuery = ref("");
let observer: IntersectionObserver | undefined;

const flatNavigation = navigation.flatMap((group) => group.items);
const searchResults = computed(() =>
    flatNavigation.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
);

const repositoryName = (repository: Repository) =>
    repository.display_name ||
    repository.full_name?.split("/").pop() ||
    "repository";

const portfolioRepository = computed(() =>
    repositories.value.find(
        (repository) =>
            repositoryName(repository).trim().toLowerCase() === "portfolio",
    ),
);

const contributorCount = (repository: Repository) => {
    const total = repository.contributors?.length || 0;
    return total === 1 ? "1 colaborador" : `${total} colaboradores`;
};

const metrics = [
    {
        icon: Gauge,
        value: "< 100 ms",
        label: "respuesta objetivo de API",
        change: "p95",
    },
    {
        icon: Activity,
        value: "99,9 %",
        label: "disponibilidad objetivo",
        change: "30 días",
    },
    {
        icon: Clock3,
        value: "24/7",
        label: "procesos automatizados",
        change: "activo",
    },
];

const architecture = [
    { icon: AppWindow, name: "Navegador", detail: "Nuxt SSR + hidratación" },
    { icon: Server, name: "API Rust", detail: "Axum · puerto 8000" },
    { icon: Network, name: "Capa de datos", detail: "Pools reader / writer" },
    { icon: Database, name: "PostgreSQL", detail: "Dominios separados" },
];

const endpoints = [
    {
        method: "GET",
        path: "/projects",
        detail: "Proyectos publicados y metadatos de cada caso.",
    },
    {
        method: "GET",
        path: "/projects/{slug}",
        detail: "Detalle de un proyecto publicado por su slug.",
    },
    {
        method: "GET",
        path: "/repositories",
        detail: "Repositorios públicos con lenguajes y colaboradores.",
    },
    {
        method: "GET",
        path: "/repositories/{slug}",
        detail: "Detalle de un repositorio público por su slug.",
    },
    {
        method: "GET",
        path: "/clients",
        detail: "Relaciones de cliente vinculadas al trabajo.",
    },
    {
        method: "POST",
        path: "/contact",
        detail: "Envío de contacto limitado mediante el pool de escritura.",
    },
    {
        method: "GET",
        path: "/",
        detail: "Health check raíz para monitores y comprobaciones manuales.",
    },
];

const workerSteps = [
    {
        title: "Arranque controlado",
        text: "El lifespan de FastAPI levanta APScheduler una sola vez y deja preparado el job diario, con zona horaria de Madrid.",
        signal: "lifespan → scheduler",
    },
    {
        title: "Lectura de GitHub",
        text: "El cliente recorre los repositorios de la cuenta y obtiene metadatos, lenguajes, temas y colaboradores.",
        signal: "GitHubClient.process_repositories()",
    },
    {
        title: "Escritura acotada",
        text: "Cada entidad se actualiza con el rol de sincronización. Si falta una pieza, ese repositorio se omite sin tumbar el resto del ciclo.",
        signal: "sync_writer · fail soft",
    },
    {
        title: "Relaciones resueltas",
        text: "Repositorios, cuentas y proyectos quedan relacionados en PostgreSQL para que Rust pueda leerlos sin repetir trabajo.",
        signal: "accounts → repositories → projects",
    },
];

const workerStages = [
    {
        title: "Al iniciar",
        text: "Se programa una primera ejecución breve después del arranque para no esperar al primer ciclo nocturno.",
    },
    {
        title: "Cada noche",
        text: "El job vuelve a ejecutarse a las 00:00 y refresca solo la fuente que cambia: GitHub.",
    },
    {
        title: "Si falta configuración",
        text: "Sin token o con credenciales inválidas, el proceso se detiene y deja la API pública intacta.",
    },
    {
        title: "Al apagar",
        text: "El lifespan cierra el scheduler para no dejar tareas colgando ni duplicar ejecuciones.",
    },
];

const services = [
    {
        icon: AppWindow,
        name: "frontend",
        image: "node:24-alpine · Nuxt Nitro",
        port: "3000",
    },
    {
        icon: Server,
        name: "rust-api",
        image: "rust:1.96 · Axum",
        port: "8000",
    },
    {
        icon: Cpu,
        name: "python-api",
        image: "python:3.11 · FastAPI",
    },
    {
        icon: Database,
        name: "db",
        image: "postgres:18 · volumen persistente",
        port: "5432",
    },
];

const requestFlow = [
    {
        title: "Nuxt solicita los datos",
        text: "Cada vista activa los recursos que necesita. Las páginas de proyectos relacionan tres respuestas; GitHub y Source code solo consultan repositorios.",
    },
    {
        title: "Rust aplica los límites",
        text: "Axum valida CORS y rate limiting antes de consultar mediante el pool lector.",
    },
    {
        title: "El frontend relaciona",
        text: "Los registros de repositorio y cliente se asocian a cada proyecto antes del render.",
    },
    {
        title: "El worker actualiza",
        text: "Los procesos programados refrescan los metadatos sin intervenir en la petición pública.",
    },
];

const safeguards = [
    "CORS por allowlist",
    "Solo GET y POST",
    "Rol api_reader",
    "Rol sync_writer",
    "120 peticiones/min",
    "3 contactos/min",
    "Filtrado de datos privados",
    "No-SQLi",
    "No-XSS",
    "No-CSRF",
];

const frontendCode = [
    "const repositories = useAsyncData(",
    "    'portfolio-repositories',",
    "    () => $fetch('/repositories'),",
    ")",
    "",
    "// Cada recurso conserva su propio estado y error.",
    "// La hidratación reintenta solo las peticiones fallidas.",
    "retryAfterHydration(repositories.error, repositories.refresh)",
];

const workerCode = [
    "async def sync_github():",
    "    repositories = client.process_repositories()",
    "    for repository in repositories:",
    "        owner_id = db.upsert_account(repository.owner)",
    "        repo_id = db.upsert_repository(repository, owner_id)",
    "        db.sync_languages(repo_id, repository.languages)",
    "        db.sync_topics(repo_id, repository.topics)",
    "        db.sync_contributors(repo_id, repository.contributors)",
    "",
    "# Rust solo lee el resultado ya relacionado.",
];

const dockerCode = [
    "services:",
    "  rust-api: ",
    "    build:",
    "      context: ./backends/rust-api",
    "    env_file: ",
    "      - ./backends/.env",
    "    ports: ",
    '      - "8082:8000"  ',
    "    depends_on:",
    "      - db",
    "    restart: unless-stopped",

    "  python-api:",
    "    build:",
    "      context: ./backends/python-api ",
    "    environment:",
    '        PYTHONUNBUFFERED: "1"',
    "    depends_on:",
    "      - db",
    "    restart: unless-stopped",

    "  db:",
    "    build:",
    "      context: ./backends/postgres",
    "    volumes:",
    "      - db-data:/var/lib/postgresql",
    "    healthcheck:",
    "      test:",
    "          [",
    '             "CMD-SHELL"',
    '              "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"',
    "          ]",
    "      interval: 5s",
    "      timeout: 5s",
    "      retries: 20  ",
    "      start_period: 15s",
    "    restart: unless-stopped",
    "",
    "  frontend:",
    "    build:",
    "      context: ./frontend  ",
    "    environment:",
    "      NUXT_PUBLIC_API_BASE: https://rust-api.impablo.dev",
    "    ports:",
    '      - "3000:3000"',
    "    volumes:",
    "      - ./frontend:/code/frontend",
    "      - frontend-node-modules:/code/frontend/node_modules",
    "    depends_on:",
    "      - rust-api ",
    "      - python-api ",
    "    restart: unless-stopped",
    "",
    "volumes: ",
    "  db-data:",
    "  rust-target:",
    "  frontend-node-modules:",
];

const handleShortcut = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.value?.focus();
    }
};

useReveal();

onMounted(() => {
    window.addEventListener("keydown", handleShortcut);
    observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible?.target.id) activeSection.value = visible.target.id;
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.6] },
    );

    document
        .querySelectorAll("[data-doc-section]")
        .forEach((section) => observer?.observe(section));
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleShortcut);
    observer?.disconnect();
});

useSeoMeta({
    title: "Sistema — Pablo Diez",
    description:
        "Documentación viva del frontend, las APIs, GitHub, los datos y la arquitectura Docker de impablo.dev.",
    ogType: "article",
});
</script>
