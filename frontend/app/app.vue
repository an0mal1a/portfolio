<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const umamiScriptUrl = runtimeConfig.public.umamiScriptUrl;
const umamiWebsiteId = runtimeConfig.public.umamiWebsiteId;

if (umamiScriptUrl && umamiWebsiteId) {
    useHead({
        script: [
            {
                src: umamiScriptUrl,
                defer: true,
                "data-website-id": umamiWebsiteId,
            },
        ],
    });
}
</script>
