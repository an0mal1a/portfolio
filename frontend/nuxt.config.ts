import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],

    runtimeConfig: {
        public: {
            apiBase: "",
            umamiScriptUrl: process.env.PUBLIC_UMAMI_SCRIPT_URL || "",
            umamiWebsiteId: process.env.PUBLIC_UMAMI_WEBSITE_ID || "",
        },
    },

    app: {
        head: {
            htmlAttrs: { lang: "es" },
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                { name: "theme-color", content: "#080809" },
            ],
            link: [{ rel: "icon", href: "/favicon.ico" }],
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
