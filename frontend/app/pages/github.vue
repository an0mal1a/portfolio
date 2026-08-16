<template>
    <div class="github-page min-h-screen bg-background-secondary pt-24 text-ink sm:pt-28">
        <!-- <div class="border-y border-line bg-backgroun-secondary/90 px-4 backdrop-blur sm:px-6">
            <div class="mx-auto flex max-w-[80rem] items-center gap-3 py-3 text-sm">
                <span class="grid size-7 place-items-center rounded-full bg-ink text-background"><GitFork :size="15" /></span>
                <span class="font-medium text-ink">Código</span>
                <span class="hidden text-muted sm:inline">/ perfil público y repositorios</span>
                <span class="ml-auto rounded-full border border-line px-2.5 py-1 text-xs text-muted">Actualizado desde GitHub</span>
            </div>
        </div> -->

        <!-- 
            - instlar iconify devicon local
            - no usar el provider como nomreb, usarlo como icono
            - mejorar header de pestañas
         -->

        <main class="mx-auto grid max-w-[80rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
            <aside v-if="profileStatus !== 'pending' || profile.username" class="lg:sticky lg:top-28 lg:self-start" data-reveal>
                <div class="flex items-start gap-4 lg:block">
                    <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.name || profile.username || 'Perfil de GitHub'" class="size-20 rounded-full border-2 border-line bg-background-secondary object-cover sm:size-24 lg:size-full" />
                    <div v-else class="flex size-20 items-center justify-center rounded-full border-2 border-line bg-surface text-xl font-medium text-white sm:size-24 lg:size-full lg:aspect-square lg:text-4xl">{{ initials(profile.name || profile.username || 'GH') }}</div>
                    <div class="flex justify-between gap-4 items-end">
                        <div class="min-w-0 pt-1 lg:pt-4">
                            <h1 class="m-0 truncate text-2xl font-semibold tracking-[-0.03em] text-ink">{{ profile.name || 'Name' }}</h1>
                            <p class="m-0 text-xl font-light text-muted">{{ profile.username || 'Username' }}</p>
                        </div>
                        <div class="mt-5 space-y-3">
                            <button type="button" class="group gap-2 flex w-full text-xs items-center rounded-sm border border-line pl-3 px-4 py-1 transition-color duration-200 ease-in-out active:scale-95 hover:text-white" @click="openSyncModal">
                                <DatabaseBackup :size="14" />
                                Sync Github
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-5 grid gap-2 border-y border-line py-3 text-sm text-ink">
                    <!-- Follows -->
                    <div class="flex items-center gap-2">
                        <Users :size="16" class="shrink-0" />

                        <span>
                            <strong>{{ (profile.followers ?? 0).toLocaleString() }}</strong>
                            <span class="text-muted"> seguidores</span>
                        </span>

                        <span class="text-muted">·</span>

                        <span>
                            <strong>{{ (profile.following ?? 0).toLocaleString() }}</strong>
                            <span class="text-muted"> siguiendo</span>
                        </span>
                    </div>

                    <!-- Contribs -->
                    <div class="flex items-center gap-2">
                        <BookMarked :size="16" class="shrink-0" />

                        <span>
                            <strong>{{ totalContributions.toLocaleString() }}</strong>
                            <span class="text-muted"> contribuciones</span>
                        </span>

                        <span class="text-muted">·</span>

                        <span>
                            <strong>{{ repositories.length }}</strong>
                            <span class="text-muted"> repositorios</span>
                        </span>
                    </div>

                    <!-- Langs -->
                    <div class="flex items-start gap-2">
                        <Languages :size="16" class="mt-0.5 shrink-0" />

                        <div class="min-w-0">
                            <div>
                                <strong>{{ languages.length }}</strong>
                                <span class="text-muted"> lenguajes principales</span>
                            </div>

                            <ul class="mt-1.5 border-t border-line pt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                <li
                                    v-for="lang in languages"
                                    :key="lang"
                                    class="flex items-center gap-1.5 text-xs text-ink"
                                >
                                    <i
                                        v-if="getLanguageIcon(lang)"
                                        :class="[getLanguageIcon(lang), 'text-sm']"
                                    />

                                    <Code2
                                        v-else
                                        :size="14"
                                        class="text-muted"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mt-2 py-4">
                    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-muted">Enlaces</p>

                    <div v-if="profileLinks.length" class="space-y-1">
                        <a
                            v-for="link in profileLinks"
                            :key="`${link.provider}-${link.url}`"
                            :href="link.url"
                            target="_blank"
                            rel="noreferrer"
                            class="group flex min-w-0 items-start gap-2 px-2 py-0.5 text-sm text-ink hover:text-signal transition-colors"
                        >
                            <Globe
                                v-if="link.provider === 'Website' || link.provider === 'Web' || link.provider === 'Blog'"
                                :size="13"
                                class="mt-[4px] shrink-0"
                            />

                            <Link
                                v-else
                                :size="13"
                                class="mt-[4px] shrink-0"
                            />

                            <span class="min-w-0 text-xs break-all leading-5">
                                {{ link.url }}
                            </span>
                        </a>
                    </div>

                    <p v-else class="m-0 text-sm text-muted">
                        Sin enlaces públicos.
                    </p>
                </div>
                <NuxtLink to="/system#source-code" class="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">Cómo se sincroniza <Network :size="15" /></NuxtLink>
            </aside>

            <div class="min-w-0">
                <nav ref="tabsNav" class="mb-8 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-line" role="tablist" aria-label="Secciones de perfil">
                    <button
                        id="tab-overview"
                        type="button"
                        role="tab"
                        :aria-selected="activeSection === 'overview'"
                        aria-controls="panel-overview"
                        class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm transition-colors"
                        :class="activeSection === 'overview' ? 'border-signal font-semibold text-ink' : 'border-transparent font-medium text-muted hover:text-ink'"
                        @click="switchSection('overview')"
                    >
                        <GitCommit :size="16" :class="activeSection === 'overview' ? 'text-signal' : 'text-muted'" />
                        Resumen
                    </button>
                    <button
                        id="tab-repos"
                        type="button"
                        role="tab"
                        :aria-selected="activeSection === 'repos'"
                        aria-controls="panel-repos"
                        class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm transition-colors"
                        :class="activeSection === 'repos' ? 'border-signal font-semibold text-ink' : 'border-transparent font-medium text-muted hover:text-ink'"
                        @click="switchSection('repos')"
                    >
                        <GitFork :size="16" :class="activeSection === 'repos' ? 'text-signal' : 'text-muted'" />
                        Repositorios
                        <span
                            class="rounded-full px-1.5 py-px text-[11px] transition-colors"
                            :class="activeSection === 'repos' ? 'bg-signal/15 text-signal' : 'bg-surface-raised text-ink'"
                        >
                            {{ repositories.length }}
                        </span>
                    </button>
                </nav>

                <Transition name="panel" mode="out-in">
                    <div v-if="activeSection === 'overview'" id="panel-overview" key="overview" role="tabpanel" aria-labelledby="tab-overview">
                        <div class="markdown-body p-6 rounded-md shadow-md my-5" v-html="renderedBio" />

                        <section
                            v-if="profile.contributions?.length"
                            class="mb-8 rounded-md border border-line bg-background-secondary p-4 sm:p-5"
                        >
                            <div class="mb-2">
                                <h2 class="m-0 text-xs font-semibold">{{ totalContributions.toLocaleString() }} contribuciones en el último año</h2>
                            </div>

                            <div class="overflow-x-auto pb-2">
                                <div class="min-w-[844px]">
                                    <div class="relative mb-2 h-4 text-[10px] text-muted">
                                        <span
                                            v-for="month in contributionMonths"
                                            :key="`${month.label}-${month.offset}`"
                                            :style="{ left: `${month.offset * 16}px` }"
                                            class="absolute whitespace-nowrap"
                                        >
                                            {{ month.label }}
                                        </span>
                                    </div>

                                    <div class="flex gap-1 relative" @mouseleave="hideContributionTooltip">
                                        <div
                                            v-for="(week, weekIndex) in contributionWeeks"
                                            :key="`week-${weekIndex}`"
                                            class="flex flex-col gap-1"
                                        >
                                            <span
                                                v-for="day in week"
                                                :key="`${day.date}-${weekIndex}`"
                                                class="size-3 rounded-[2px] bg-background-secondary outline outline-1 outline-transparent transition"
                                                :style="{ backgroundColor: contributionColor(day.level) }"
                                                @mouseenter="showContributionTooltip(day, $event)"
                                            />
                                        </div>
                                    </div>

                                    <!-- Tooltip -->
                                    <Teleport to="body">
                                        <Transition name="tooltip">
                                            <div
                                                v-if="hoveredDay"
                                                class="fixed z-[100] -translate-x-1/2 rounded-md border border-line bg-surface px-3 py-2 text-xs shadow-lg pointer-events-none whitespace-nowrap"
                                                :style="{
                                                    left: `${hoveredDay.x}px`,
                                                    top: `${hoveredDay.y}px`,
                                                }"
                                            >
                                                <div class="font-medium text-ink">{{ hoveredDay.commits }} {{ hoveredDay.commits === 1 ? 'commit' : 'commits' }}</div>
                                                <div class="mt-0.5 text-[10px] text-muted">{{ contributionLevelLabel(hoveredDay.level) }} · {{ formatContributionDate(hoveredDay.date) }}</div>
                                            </div>
                                        </Transition>
                                    </Teleport>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div v-else id="panel-repos" key="repos" role="tabpanel" aria-labelledby="tab-repos">
                        <div
                            class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                        >
                            <div class="flex items-baseline gap-3">
                                <h2
                                    id="repositories-title"
                                    class="m-0 text-xl font-semibold text-ink"
                                >
                                    Repositorios
                                </h2>
                                <span class="text-xs text-muted">
                                    {{
                                        filteredRepositories.length
                                            .toString()
                                            .padStart(2, "0")
                                    }}
                                    visibles
                                </span>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <div
                                    class="flex max-w-full gap-1 overflow-visible rounded-sm border border-line bg-surface p-1"
                                    aria-label="Ordenar repositorios"
                                >
                                    <CustomSelect
                                        v-model="sorting"
                                        class="w-24"
                                        :options="{
                                                push: {
                                                    label: 'Push',
                                                    icon: GitCommit
                                                },
                                                star: {
                                                    label: 'Stars',
                                                    icon: Star
                                                },
                                                fork: {
                                                    label: 'Forks',
                                                    icon: GitFork
                                                },
                                            }"
                                    />
                                </div>

                                <div
                                    v-if="languages.length > 1"
                                    class="flex max-w-full gap-1 overflow-x-auto rounded-sm border border-line bg-surface p-1"
                                    aria-label="Filtrar repositorios por lenguaje"
                                >
                                    <button
                                        type="button"
                                        class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                                        :class="
                                            activeLanguage === 'Todos'
                                                ? 'bg-ink text-background'
                                                : 'text-muted hover:bg-surface-raised hover:text-ink'
                                        "
                                        @click="activeLanguage = 'Todos'"
                                    >
                                        Todos
                                        <span class="ml-1 opacity-55">{{ repositories.length }}</span>
                                    </button>
                                    <button
                                        v-for="language in languages"
                                        :key="language"
                                        type="button"
                                        class="shrink-0 rounded-sm px-2 py-1 text-xs transition-colors"
                                        :class="
                                            activeLanguage === language
                                                ? 'bg-ink text-background'
                                                : 'text-muted hover:bg-surface-raised hover:text-ink'
                                        "
                                        @click="activeLanguage = language"
                                    >
                                        {{ language }}
                                        <span class="ml-1 opacity-55">{{ countByLanguage(language) }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="error"
                            class="mb-3 flex flex-col gap-3 rounded-sm border border-signal/30 bg-surface px-3 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
                            role="status"
                        >
                            <span class="flex items-center gap-2">
                                <CircleOff :size="16" class="shrink-0 text-signal" />
                                GitHub no está respondiendo. Puedes volver a intentarlo sin
                                recargar la página.
                            </span>
                            <button
                                type="button"
                                class="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-3 py-2 font-medium text-background"
                                @click="handleRefresh()"
                            >
                                Reintentar
                                <RefreshCw :size="16" />
                            </button>
                        </div>

                        <div
                            v-if="status === 'pending' && !repositories.length"
                            class="grid gap-2 md:grid-cols-2"
                            aria-live="polite"
                        >
                            <div
                                v-for="index in 4"
                                :key="index"
                                class="min-h-64 animate-pulse rounded-sm border border-line bg-surface"
                            >
                                <span class="sr-only">Cargando repositorio</span>
                            </div>
                        </div>

                        <section
                            v-else-if="filteredRepositories.length"
                            class="grid gap-4 md:grid-cols-2"
                            aria-labelledby="repositories-title"
                        >
                            <RepositoryCard
                                v-for="repository in filteredRepositories"
                                :key="repository.id"
                                :repository="repository"
                            />
                        </section>

                        <div
                            v-else-if="!error"
                            class="grid min-h-72 place-items-center rounded-sm border border-line bg-surface p-8 text-center"
                        >
                            <div>
                                <CircleOff :size="20" class="mx-auto text-signal" />
                                <p
                                    class="mx-auto mt-4 mb-0 max-w-md text-sm leading-6 text-muted"
                                >
                                    No hay repositorios públicos para este filtro.
                                </p>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </main>

        <Teleport to="body">
            <Transition name="sync-modal">
                <div v-if="isSyncModalOpen" class="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="sync-title" @keydown.esc="closeSyncModal">
                    <button class="absolute inset-0 cursor-default bg-background/85 backdrop-blur-sm" aria-label="Cerrar sincronización" @click="closeSyncModal" />

                    <section class="relative w-full max-w-xl overflow-hidden rounded-sm border border-line bg-surface shadow-[0_30px_100px_rgba(0,0,0,.42)]">
                        <header class="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-5">
                            <div class="flex items-center gap-3">
                                <span class="grid size-8 place-items-center rounded-sm border border-line bg-background-secondary text-muted"><RefreshCw :size="15" /></span>
                                <div>
                                    <p class="m-0 text-[10px] uppercase tracking-[0.12em] text-muted">Datos públicos</p>
                                    <h2 id="sync-title" class="m-0 mt-0.5 text-base font-medium tracking-[-0.025em] text-ink">Sincronizar GitHub</h2>
                                </div>
                            </div>
                            <button type="button" class="grid size-8 place-items-center rounded-sm border border-transparent text-muted transition-colors hover:border-line hover:bg-surface-raised hover:text-ink" aria-label="Cerrar" @click="closeSyncModal"><X :size="16" /></button>
                        </header>

                        <div class="p-4 sm:p-5">
                            <template v-if="!syncRun">
                                <p class="m-0 max-w-md text-xs leading-5 text-muted">Elige los datos que quieres actualizar. La tarea seguirá en el worker aunque cierres este panel.</p>
                                <div class="mt-5 grid gap-2 sm:grid-cols-2">
                                    <button v-for="option in syncOptions" :key="option.type" type="button" :disabled="isStarting" class="group rounded-sm border border-line bg-background-secondary p-4 text-left transition-colors hover:bg-surface-raised disabled:cursor-wait disabled:opacity-60" @click="startPublicSync(option.type)">
                                        <span class="flex items-center justify-between">
                                            <span class="grid size-8 place-items-center rounded-sm border border-line bg-surface text-muted transition-colors group-hover:text-ink"><component :is="option.icon" :size="16" /></span>
                                            <LoaderCircle v-if="isStarting && pendingTask === option.type" :size="16" class="animate-spin text-muted" />
                                            <ArrowUpRight v-else :size="15" class="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                                        </span>
                                        <span class="mt-8 block text-sm font-medium text-ink">{{ option.title }}</span>
                                        <span class="mt-1 block text-xs leading-5 text-muted">{{ option.description }}</span>
                                    </button>
                                </div>
                                <p v-if="syncError" class="mt-4 border-l-2 border-signal bg-signal/10 px-3 py-2.5 text-xs leading-5 text-ink">{{ syncError }}</p>
                            </template>

                            <template v-else>
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex min-w-0 items-center gap-3">
                                        <span class="grid size-9 place-items-center rounded-sm border border-line bg-background-secondary" :class="syncRun.status === 'failed' ? 'text-signal' : 'text-ink'">
                                            <CheckCircle2 v-if="syncRun.status === 'completed'" :size="17" />
                                            <CircleAlert v-else-if="syncRun.status === 'failed'" :size="17" />
                                            <LoaderCircle v-else :size="17" class="animate-spin" />
                                        </span>
                                        <div class="min-w-0">
                                            <p class="m-0 text-sm font-medium text-ink">{{ syncRun.job_type === 'profile' ? 'Perfil de GitHub' : 'Repositorios de GitHub' }}</p>
                                            <p class="m-0 mt-0.5 truncate text-xs text-muted">{{ syncRun.message || 'Preparando la sincronización…' }}</p>
                                        </div>
                                    </div>
                                    <span class="shrink-0 border border-line px-2 py-1 text-[10px] uppercase tracking-[0.08em]" :class="syncRun.status === 'failed' ? 'text-signal' : 'text-muted'">{{ syncStatusLabel }}</span>
                                </div>

                                <div class="mt-6 border-y border-line py-3">
                                    <div class="mb-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-muted"><span>Progreso</span><span class="font-mono text-ink">{{ syncRun.progress }}%</span></div>
                                    <div class="h-1 overflow-hidden bg-line"><div class="h-full bg-ink transition-all duration-500" :style="{ width: `${syncRun.progress}%` }" /></div>
                                </div>

                                <div class="mt-4 border border-line bg-background-secondary p-3 font-mono text-xs leading-5">
                                    <div class="flex items-center gap-2 text-muted"><Terminal :size="13" /><span>worker / output</span><span class="ml-auto size-1.5 rounded-full" :class="syncRun.status === 'running' ? 'animate-pulse bg-ink' : 'bg-line-strong'" /></div>
                                    <p class="m-0 mt-2 break-words text-ink">{{ syncRun.error || syncRun.message || 'Esperando al worker…' }}</p>
                                </div>

                                <div v-if="syncRun.status === 'completed' && syncRun.result" class="mt-4 grid grid-cols-2 gap-px bg-line text-xs">
                                    <span v-for="(value, key) in syncRun.result" :key="key" class="bg-surface px-3 py-2 text-muted"><b class="mr-1 font-medium text-ink">{{ value }}</b>{{ formatResultKey(String(key)) }}</span>
                                </div>

                                <div class="mt-5 flex justify-end gap-2">
                                    <button type="button" class="border border-line px-3 py-2 text-xs text-muted transition-colors hover:bg-surface-raised hover:text-ink" @click="resetSync">Elegir otra tarea</button>
                                    <button type="button" class="bg-ink px-3 py-2 text-xs font-medium text-background transition-opacity hover:opacity-85" @click="closeSyncModal">Cerrar</button>
                                </div>
                            </template>
                        </div>
                    </section>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.sync-modal-enter-active,
.sync-modal-leave-active {
    transition: opacity 180ms ease;
}

.sync-modal-enter-active section,
.sync-modal-leave-active section {
    transition: transform 180ms ease, opacity 180ms ease;
}

.sync-modal-enter-from,
.sync-modal-leave-to {
    opacity: 0;
}

.sync-modal-enter-from section,
.sync-modal-leave-to section {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}

.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 150ms ease, transform 150ms ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: translate(-50%, 4px);
}

.panel-enter-active,
.panel-leave-active {
    transition: opacity 160ms ease, transform 160ms ease;
}

.panel-enter-from,
.panel-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

.markdown-body {
    color: var(--color-ink);
    border: solid var(--color-line) 1px; 
    font-size: 0.95rem;
    line-height: 1.7;
}

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(blockquote),
.markdown-body :deep(pre),
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    margin: 0 0 0.8rem;
    list-style-type: disc;

}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    color: var(--color-ink);
    font-weight: 600;
    border-bottom: solid var(--color-line) 1px;
}

.markdown-body :deep(h1) {
    font-size: 2em;
}

.markdown-body :deep(h2) {
    font-size: 1.5em;
}

.markdown-body :deep(h3) {
    font-size: .75em;
}

.markdown-body :deep(h4) {
    font-size: .5em;
}

.markdown-body :deep(h5) {
    font-size: .25em;
}

.markdown-body :deep(h6)  {
    font-size: .15em;
}

.markdown-body :deep(hr) {
    background-color: var(--color-line);
    color: transparent;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    height: .15rem; 
}

.markdown-body :deep(a) {
    color: var(--color-signal);
    text-decoration: underline;
    text-underline-offset: 0.15em; 
}

.markdown-body :deep(p[align="center"] > a) {
  display: inline-block;
}

.markdown-body :deep(p[align="center"] > a img) {
  display: inline-block;
}

.markdown-body :deep(p[align="center"] > img) {
  display: inline-block;
}

.markdown-body :deep(code) {
    background: rgba(244, 244, 245, 0.1);
    color: var(--color-ink); 
    border-radius: 0.25rem;
    padding: 0.1rem 0.35rem;
    font-size: 0.88em;
}

.markdown-body :deep(pre) {
    background: var(--color-background-secondary);
    border: 1px solid var(--color-line);
    border-radius: 0.5rem;
    padding: 0.9rem 1rem;
    overflow-x: auto;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    padding-left: 1.25rem;
}

.markdown-body :deep(ul) {
    margin-left: .5rem;
}

.markdown-body :deep(strong) {
    color: var(--color-ink);
    font-weight: 600;
}

.markdown-body :deep(blockquote) {
    border-left: 2px solid var(--color-line);
    color: var(--color-muted);
    padding-left: 0.8rem;
}

.markdown-body :deep(table) {
    display: block;
    width: max-content;
    max-width: 100%;
    overflow-x: auto;

    border-spacing: 0;
    border-collapse: collapse;

    margin: 0 0 1rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--color-line);
}

.markdown-body :deep(th) {
    color: var(--color-ink);
    font-weight: 600; 
}

.markdown-body :deep(td) {
    color: var(--color-ink);
}

.markdown-body :deep(tr) { 
    border-top: 1px solid #21262d;
}

.markdown-body :deep(tr:nth-child(2n)) {
    background-color: var(--color-background-secondary);
}
</style>

<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import {
    ArrowUpRight,
    BookMarked,
    CheckCircle2,
    CircleAlert,
    CircleOff,
    Code2,
    GitCommit,
    GitFork,
    Globe,
    Languages,
    Link,
    LoaderCircle,
    Network,
    RefreshCw,
    Star,
    Terminal,
    Users,
    UserRound,
    X, 
    DatabaseBackup, 
} from "@lucide/vue";
import type { GitHubProfile, Repository } from "~/types/portfolio";

const languageIcons = {
    C: 'devicon-c-plain',
    'C++': 'devicon-cplusplus-plain',
    'C#': 'devicon-csharp-plain',
    Python: 'devicon-python-plain',
    JavaScript: 'devicon-javascript-plain',
    TypeScript: 'devicon-typescript-plain',
    Java: 'devicon-java-plain',
    Go: 'devicon-go-original-wordmark',
    Rust: 'devicon-rust-original',
    PHP: 'devicon-php-plain',
    Ruby: 'devicon-ruby-plain',
    Swift: 'devicon-swift-plain',
    Kotlin: 'devicon-kotlin-plain',
}

const { repositories, status, error, refresh } = useRepositories();
const {
    profile: githubProfile,
    status: profileStatus,
    error: profileError,
    refresh: refreshProfile,
} = useGithubProfile();
const activeLanguage = ref("Todos");
const sorting = ref("push");
const activeSection = ref<"overview" | "repos">("overview");
const tabsNav = ref<HTMLElement | null>(null);
type PublicTaskType = "profile" | "repo_sync";
type PublicJobRun = {
    id: string;
    job_type: PublicTaskType;
    status: "pending" | "running" | "completed" | "failed";
    progress: number;
    message?: string | null;
    result?: Record<string, string | number | boolean> | null;
    error?: string | null;
};

const config = useRuntimeConfig();
const pythonApiBase = String(config.public.pythonApiBase || "").replace(/\/$/, "");
const isSyncModalOpen = ref(false);
const isStarting = ref(false);
const pendingTask = ref<PublicTaskType | null>(null);
const syncRun = ref<PublicJobRun | null>(null);
const syncError = ref("");
let syncEvents: EventSource | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

type HoveredDay = {
    date: string;
    level: string;
    commits: number;
    x: number;
    y: number;
};

const hoveredDay = ref<HoveredDay | null>(null);

const syncOptions = [
    {
        type: "profile" as const,
        title: "Perfil",
        description: "Avatar, bio, enlaces y contribuciones.",
        icon: UserRound,
    },
    {
        type: "repo_sync" as const,
        title: "Repositorios",
        description: "Repos, lenguajes, topics y colaboradores.",
        icon: GitFork,
    },
];

const syncStatusLabel = computed(() => {
    const labels: Record<PublicJobRun["status"], string> = {
        pending: "En cola",
        running: "En curso",
        completed: "Completado",
        failed: "Fallido",
    };
    return syncRun.value ? labels[syncRun.value.status] : "";
});

const isTerminalRun = (run?: PublicJobRun | null) =>
    run?.status === "completed" || run?.status === "failed";

const stopRunUpdates = () => {
    syncEvents?.close();
    syncEvents = null;
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
};

const applyRunUpdate = (run: PublicJobRun) => {
    syncRun.value = run;
    if (isTerminalRun(run)) {
        stopRunUpdates();
        if (run.status === "completed") handleRefresh();
    }
};

const fetchRun = async () => {
    if (!syncRun.value || !pythonApiBase) return;
    const run = await $fetch<PublicJobRun>(
        `${pythonApiBase}/public/jobs/${syncRun.value.id}`,
    );
    applyRunUpdate(run);
};

const startPolling = () => {
    if (pollTimer || isTerminalRun(syncRun.value)) return;
    void fetchRun().catch(() => undefined);
    pollTimer = setInterval(() => void fetchRun().catch(() => undefined), 1500);
};

const subscribeToRun = () => {
    if (!import.meta.client || !syncRun.value || !pythonApiBase) return;
    stopRunUpdates();
    syncEvents = new EventSource(`${pythonApiBase}/public/jobs/${syncRun.value.id}/events`);
    syncEvents.addEventListener("progress", (event) => {
        try {
            applyRunUpdate(JSON.parse((event as MessageEvent).data) as PublicJobRun);
        } catch {
            startPolling();
        }
    });
    syncEvents.onerror = () => {
        syncEvents?.close();
        syncEvents = null;
        startPolling();
    };
};

const startPublicSync = async (taskType: PublicTaskType) => {
    if (!pythonApiBase) {
        syncError.value = "La URL pública del worker Python no está configurada.";
        return;
    }

    isStarting.value = true;
    pendingTask.value = taskType;
    syncError.value = "";

    try {
        const created = await $fetch<{
            run_id: string;
            job_type: PublicTaskType;
            status: PublicJobRun["status"];
        }>(`${pythonApiBase}/public/jobs/${taskType}/run`, { method: "POST" });
        syncRun.value = {
            id: created.run_id,
            job_type: created.job_type,
            status: created.status,
            progress: 0,
            message: "La tarea ha entrado en la cola.",
        };
        subscribeToRun();
    } catch (error: any) {
        const code = error?.data?.detail?.code;
        syncError.value = code === "job_already_running"
            ? "Ya hay una sincronización de este tipo en curso. Vuelve a intentarlo cuando termine."
            : code === "visitor_daily_limit"
                ? "Ya has ejecutado esta sincronización hoy."
                : code === "public_daily_limit"
                    ? "Se ha alcanzado el límite diario de sincronizaciones públicas."
                    : "No se ha podido iniciar la sincronización. Inténtalo de nuevo en unos segundos.";
    } finally {
        isStarting.value = false;
        pendingTask.value = null;
    }
};

const resetSync = () => {
    stopRunUpdates();
    syncRun.value = null;
    syncError.value = "";
};

const openSyncModal = () => {
    resetSync();
    isSyncModalOpen.value = true;
};

const closeSyncModal = () => {
    resetSync();
    isSyncModalOpen.value = false;
};

const formatResultKey = (key: string) => key.replaceAll("_", " ");

onBeforeUnmount(stopRunUpdates);

const profile = computed<GitHubProfile>(() => githubProfile.value ?? {});

const initials = (value: string) =>
    value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "GH";

const profileBio = computed(
    () =>
        profile.value.bio ||
        profile.value.description ||
        "Sin bio pública disponible en GitHub por el momento.",
);

const renderedBio = computed(() => {
    const markdown = profileBio.value.trim();
    if (!markdown) return "";

    const html = marked.parse(markdown, {
        gfm: true,
        breaks: true,
    });

    return DOMPurify.sanitize(String(html), {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["style"],
    });
});

const profileLinks = computed(() => {
    const links = [...(profile.value.links ?? [])]
        .filter((link) => link?.url)
        .map((link) => ({
            provider: link.provider || "Link",
            url: link.url,
        }));

    if (profile.value.blog?.trim()) {
        links.unshift({
            provider: "Blog",
            url: profile.value.blog,
        });
    }

    return links;
});

const totalContributions = computed(
    () =>
        profile.value.contributions?.reduce(
            (total, item) => total + (item.commits || 0),
            0,
        ) ?? 0,
);

const contributionColor = (level?: string | null) => {
    const map: Record<string, string> = {
        NONE: "var(--color-surface)",
        FIRST_QUARTILE: "color-mix(in srgb, var(--color-signal) 25%, var(--color-background))",
        SECOND_QUARTILE: "color-mix(in srgb, var(--color-signal) 45%, var(--color-background))",
        THIRD_QUARTILE: "color-mix(in srgb, var(--color-signal) 70%, var(--color-background))",
        FOURTH_QUARTILE: "var(--color-signal)",
    };

    return map[(level || "NONE").toUpperCase()] || map.NONE;
};

const contributionLevelLabel = (level?: string | null) => {
    const normalizedLevel = (level || "NONE").toUpperCase();

    const labels: Record<string, string> = {
        NONE: "Sin actividad",
        FIRST_QUARTILE: "Actividad baja",
        SECOND_QUARTILE: "Actividad media",
        THIRD_QUARTILE: "Actividad alta",
        FOURTH_QUARTILE: "Actividad muy alta",
    };

    return labels[normalizedLevel] || level;
};

const contributionWeeks = computed(() => {
    const contributionMap = new Map<string, { level: string; commits: number }>();

    for (const item of profile.value.contributions ?? []) {
        if (!item.date) continue;

        const date = new Date(item.date);
        if (Number.isNaN(date.getTime())) continue;

        const iso = date.toISOString().slice(0, 10);
        contributionMap.set(iso, {
            level: item.contrib_level || "None",
            commits: Number(item.commits || 0),
        });
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    // GitHub coloca domingo en la primera fila; completamos la semana inicial.
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);

    const weeks: Array<Array<{ date: string; level: string; commits: number }>> = [];

    for (let week = 0; week < 53; week += 1) {
        const days: Array<{ date: string; level: string; commits: number }> = [];

        for (let day = 0; day < 7; day += 1) {
            const current = new Date(start);
            current.setDate(start.getDate() + (week * 7) + day);
            const iso = current.toISOString().slice(0, 10);
            const entry = contributionMap.get(iso) ?? { level: "None", commits: 0 };

            days.push({
                date: iso,
                level: entry.level,
                commits: entry.commits,
            });
        }

        weeks.push(days);
    }

    return weeks;
});

const getLanguageIcon = (lang: string) =>
    languageIcons[lang as keyof typeof languageIcons] ?? null;

const contributionMonths = computed(() => {
    const labels: Array<{ label: string; offset: number }> = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);

    let previousMonth = -1;
    for (let week = 0; week < 53; week += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + (week * 7));

        const month = date.getMonth();
        if (month !== previousMonth) {
            labels.push({
                label: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date),
                offset: week,
            });
            previousMonth = month;
        }
    }

    return labels;
});

const showContributionTooltip = (
    day: { date: string; level: string; commits: number },
    event: MouseEvent,
) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    hoveredDay.value = {
        date: day.date,
        level: day.level,
        commits: day.commits,
        x: Math.min(Math.max(rect.left + (rect.width / 2), 112), window.innerWidth - 112),
        y: Math.max(rect.top - 52, 8),
    };
};

const hideContributionTooltip = () => {
    hoveredDay.value = null;
};

const switchSection = (section: "overview" | "repos") => {
    activeSection.value = section;
    tabsNav.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

watch(activeSection, hideContributionTooltip);

const formatContributionDate = (value?: string | null) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("es-ES", {
        month: "short",
        day: "numeric",
    }).format(date);
};

const repositoryName = (repository: Repository) =>
    repository.display_name ||
    repository.full_name?.split("/").pop() ||
    "repository";

const languages = computed(() =>
    [
        ...new Set(
            repositories.value
                .map((repository) => repository.primary_language)
                .filter((language): language is string => Boolean(language)),
        ),
    ].sort(),
);

const orderedRepositories = computed(() =>
    [...repositories.value].sort((a, b) => {
        const aIsPortfolio = repositoryName(a).toLowerCase() === "portfolio";
        const bIsPortfolio = repositoryName(b).toLowerCase() === "portfolio";

        if (aIsPortfolio !== bIsPortfolio) return aIsPortfolio ? -1 : 1;

        if (sorting.value === "star") {
            return (b.stars_count || 0) - (a.stars_count || 0);
        }

        if (sorting.value === "fork") {
            return (b.forks_count || 0) - (a.forks_count || 0);
        }

        const aDate = new Date(
            a.github_pushed_at || a.github_updated_at || a.synced_at || 0,
        ).getTime();
        const bDate = new Date(
            b.github_pushed_at || b.github_updated_at || b.synced_at || 0,
        ).getTime();
        return bDate - aDate;
    }),
);

const filteredRepositories = computed(() =>
    activeLanguage.value === "Todos"
        ? orderedRepositories.value
        : orderedRepositories.value.filter(
              (repository) =>
                  repository.primary_language === activeLanguage.value,
          ),
);

const countByLanguage = (language: string) =>
    repositories.value.filter(
        (repository) => repository.primary_language === language,
    ).length;

const handleRefresh = () => {
    void refresh();
    void refreshProfile();
};

useReveal();

useSeoMeta({
    title: "GitHub · Pablo Diez",
    description:
        "Repositorios públicos, tecnologías y colaboradores de los proyectos de Pablo Diez.",
    ogTitle: "GitHub · Pablo Diez",
    ogDescription:
        "Código público, arquitectura y experimentos sincronizados directamente desde GitHub.",
    ogType: "website",
});
</script>

