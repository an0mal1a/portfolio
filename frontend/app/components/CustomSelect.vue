<template>
    <div class="relative" ref="dropdownRef">
        <button
            ref="triggerRef"
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1 text-left text-xs text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-haspopup="listbox"
            :aria-expanded="showDropdown"
            @click.stop="toggleDropdown"
            @keydown.down.prevent="openDropdown"
            @keydown.enter.prevent="toggleDropdown"
            @keydown.space.prevent="toggleDropdown"
            @keydown.esc="closeDropdown"
        >
            <span class="min-w-0 truncate">
                {{ selectedValue.label }}
            </span>

            <svg
                class="size-3 shrink-0 text-muted transition-transform duration-200"
                :class="{ 'rotate-180': showDropdown }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="showDropdown"
                class="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-sm border border-line bg-surface shadow-[0_12px_32px_rgba(0,0,0,.35)]"
                @click.stop
            >
                <div role="listbox" :aria-label="label">
                    <button
                        v-for="(op, key) in options"
                        :key="key"
                        type="button"
                        role="option"
                        :aria-selected="key === modelValue"
                        class="flex w-full items-center gap-2 border-b border-line px-2 py-1.5 text-left text-xs text-muted transition-colors last:border-b-0 hover:bg-surface-raised hover:text-ink focus-visible:bg-surface-raised focus-visible:text-ink focus-visible:outline-none"
                        :class="{ 'bg-surface-raised text-ink': key === modelValue }"
                        @click="selectOption(key)"
                        @keydown.esc="closeDropdown"
                    >
                        <component
                            :is="op.icon"
                            v-if="op.icon"
                            class="size-3.5 text-muted"
                        />
                        <span>{{ op.label }}</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: String, required: true },
    options: { type: Object, required: true },
    label: { type: String, default: 'Ordenar repositorios' },
})

const emit = defineEmits(['update:modelValue'])

const showDropdown = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)
const selectedValue = computed(() => {
    return props.options[props.modelValue] ?? { label: '', icon: null }
})

function selectOption(key) {
    emit('update:modelValue', key)
    showDropdown.value = false
}

function openDropdown() {
    showDropdown.value = true
}

function closeDropdown() {
    showDropdown.value = false
}

function toggleDropdown() {
    showDropdown.value = !showDropdown.value
}

function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleClickOutside)
})
</script>
