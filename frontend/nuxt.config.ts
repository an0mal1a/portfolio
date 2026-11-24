import tailwindcss from '@tailwindcss/vite'

const SITE_URL = 'https://impablo.dev'

// Bump after `npm run icons`: browsers keep favicons for a long time.
const ICON_VERSION = 2

const poll = process.env.WATCH_POLLING === '1'

// Same values the runtime config reads; needed here for the dev-only proxy.
const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'https://rust-api.impablo.dev'
const PYTHON_API_BASE = process.env.NUXT_PUBLIC_PYTHON_API_BASE || 'https://python-api.impablo.dev'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { include: ['lenis', '@lucide/vue'] },
    // Opt-in polling (WATCH_POLLING=1) for checkouts on an NTFS mount under WSL,
    // where inotify does not fire. Off by default: it slows dev SSR to a crawl.
    server: { watch: poll ? { usePolling: true, interval: 400 } : {} },
  },

  watchers: {
    chokidar: poll ? { usePolling: true, interval: 400 } : {},
  },

  runtimeConfig: {
    // Server-only base URL for Rust API reads (NUXT_API_INTERNAL_BASE). Empty means
    // "use public.apiBase". Inside docker compose it points at the service name
    // (http://rust-api:8000), because localhost there is the frontend container.
    apiInternalBase: '',
    public: {
      // Browser-facing endpoints (contact form, public GitHub sync jobs).
      apiBase: 'https://rust-api.impablo.dev',
      pythonApiBase: 'https://python-api.impablo.dev',
      siteUrl: SITE_URL,
    },
  },

  site: {
    url: SITE_URL,
    name: 'Pablo Diez',
    defaultLocale: 'es',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0C0B0A' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', href: `/favicon.ico?v=${ICON_VERSION}`, sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg?v=${ICON_VERSION}` },
        { rel: 'apple-touch-icon', href: `/apple-touch-icon.png?v=${ICON_VERSION}` },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/gantari-latin.woff2', crossorigin: '' },
        // Project screenshots are resized at Cloudinary's edge (app/utils/cloudinary.ts).
        { rel: 'preconnect', href: 'https://res.cloudinary.com' },
      ],
    },
  },

  i18n: {
    baseUrl: SITE_URL,
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'web-design': { es: '/diseno-web-ibiza', en: '/web-design-ibiza' },
      'custom-software': { es: '/desarrollo-software-a-medida', en: '/custom-software-development' },
      'ai-automation': { es: '/automatizacion-ia', en: '/ai-automation' },
      'projects/index': { es: '/proyectos', en: '/work' },
      'projects/[slug]': { es: '/proyectos/[slug]', en: '/work/[slug]' },
      'lab': { es: '/laboratorio', en: '/lab' },
      'about': { es: '/sobre-mi', en: '/about' },
      'contact': { es: '/contacto', en: '/contact' },
      'privacy': { es: '/privacidad', en: '/privacy' },
    },
  },

  image: {
    quality: 72,
    format: ['avif', 'webp'],
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1600 },
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com'],
  },

  robots: {
    groups: [{ userAgent: '*', allow: '/' }],
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Pablo Diez',
      url: SITE_URL,
    },
  },

  // HTML is rendered on the server and cached briefly in production; data has its own cache.
  $production: {
    routeRules: {
      '/**': { swr: 300 },
      '/api/status': { swr: false, cache: false },
      // The route cache stores binary bodies as "{}": never put IPX images through it.
      '/_ipx/**': { swr: false, cache: false },
    },
  },

  routeRules: {
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/brand/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/logos/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/covers/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/media/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/plates/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
  },

  nitro: {
    compressPublicAssets: true,
    // Dev only: browser calls to the backends, on whatever port dev runs (useBackendBase).
    devProxy: {
      '/_backend/rust': { target: API_BASE, changeOrigin: true },
      '/_backend/python': { target: PYTHON_API_BASE, changeOrigin: true },
    },
  },

  experimental: {
    viewTransition: true,
  },

  typescript: {
    strict: true,
  },
})
