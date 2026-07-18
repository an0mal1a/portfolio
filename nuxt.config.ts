// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';


export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	css: ['~/assets/css/main.css'],

    app: {
        head:{
            title: 'Portfolio',
            meta: [
                { name: 'description', content: 'Portfolio de Pablo Diez' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap' },

            ]
        }
    },

    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: ['.ngrok-free.app'],
        },
    },
})
