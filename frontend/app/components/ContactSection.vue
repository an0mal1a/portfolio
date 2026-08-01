<template>
    <section
        id="contact"
        class="px-4 py-20 sm:px-6 sm:py-28"
        aria-labelledby="contact-title"
    >
        <div
            class="mx-auto grid max-w-[92rem] gap-14 border-t border-line pt-14 lg:grid-cols-[0.8fr_1.2fr]"
            data-reveal
        >
            <header>
                <p class="mb-4 flex items-center gap-2 text-xs text-muted">
                    <MessageSquare :size="16" />
                    Contacto
                </p>
                <h2
                    id="contact-title"
                    class="m-0 max-w-[12ch] font-display text-[clamp(4.5rem,8vw,8rem)] leading-[0.80] tracking-[-0.02em]"
                >
                    Resolvamos un problema difícil.
                </h2>
                <p class="mt-6 max-w-sm text-sm leading-6 text-muted">
                    El contexto vale más que un pitch. Cuéntame qué estás
                    construyendo y dónde empieza a doler el sistema.
                </p>
            </header>

            <form
                class="grid gap-2 sm:grid-cols-2"
                @submit.prevent="submitForm"
            >
                <label
                    class="rounded-sm border border-line bg-surface p-3 transition-colors focus-within:border-line-strong focus-within:bg-surface-raised"
                >
                    <span class="mb-2 block text-xs text-muted">Nombre</span>
                    <input
                        v-model.trim="form.name"
                        name="name"
                        autocomplete="name"
                        required
                        placeholder="Pablo"
                        class="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-white/20"
                    />
                </label>
                <label
                    class="rounded-sm border border-line bg-surface p-3 transition-colors focus-within:border-line-strong focus-within:bg-surface-raised"
                >
                    <span class="mb-2 block text-xs text-muted">Correo</span>
                    <input
                        v-model.trim="form.email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        placeholder="tu@empresa.com"
                        class="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-white/20"
                    />
                </label>
                <label
                    class="rounded-sm border border-line bg-surface p-3 transition-colors focus-within:border-line-strong focus-within:bg-surface-raised sm:col-span-2"
                >
                    <span class="mb-2 block text-xs text-muted">Asunto</span>
                    <input
                        v-model.trim="form.subject"
                        name="subject"
                        required
                        placeholder="Una API, un producto, un rescate..."
                        class="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-white/20"
                    />
                </label>
                <label
                    class="rounded-sm border border-line bg-surface p-3 transition-colors focus-within:border-line-strong focus-within:bg-surface-raised sm:col-span-2"
                >
                    <span class="mb-2 block text-xs text-muted">Detalles</span>
                    <textarea
                        v-model.trim="form.message"
                        name="message"
                        required
                        rows="5"
                        placeholder="Restricciones, ambición y plazos."
                        class="w-full resize-y border-0 bg-transparent p-0 text-sm leading-6 outline-none placeholder:text-white/20"
                    />
                </label>
                <button
                    type="submit"
                    :disabled="sending"
                    class="flex items-center justify-between rounded-sm bg-ink px-3 py-2.5 text-xs font-medium text-background transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-50 sm:col-span-2"
                >
                    <span>{{ sending ? "Enviando…" : "Enviar contexto" }}</span>
                    <LoaderCircle
                        v-if="sending"
                        :size="16"
                        class="animate-spin"
                    />
                    <Send v-else :size="16" />
                </button>
                <p
                    v-if="feedback"
                    class="m-0 flex items-center gap-2 rounded-sm border px-3 py-2 text-xs sm:col-span-2"
                    :class="
                        feedbackError
                            ? 'border-signal/25 bg-signal/10 text-red-300'
                            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    "
                    aria-live="polite"
                >
                    <CircleAlert v-if="feedbackError" :size="16" />
                    <CircleCheck v-else :size="16" />
                    {{ feedback }}
                </p>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    CircleAlert,
    CircleCheck,
    LoaderCircle,
    MessageSquare,
    Send,
} from "@lucide/vue";

const props = defineProps<{
    sendContact: (payload: {
        name: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
    }) => Promise<{ status: string; error?: string }>;
}>();

const form = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
});
const sending = ref(false);
const feedback = ref("");
const feedbackError = ref(false);

const submitForm = async () => {
    sending.value = true;
    feedback.value = "";
    feedbackError.value = false;

    try {
        const response = await props.sendContact({ ...form });
        if (response.status !== "ok")
            throw new Error(response.error || "unknown_error");
        feedback.value = "Mensaje recibido. Te responderé lo antes posible.";
        Object.assign(form, {
            name: "",
            email: "",
            subject: "",
            message: "",
            phone: "",
        });
    } catch {
        feedbackError.value = true;
        feedback.value = "No se ha podido enviar. Inténtalo de nuevo.";
    } finally {
        sending.value = false;
    }
};
</script>
