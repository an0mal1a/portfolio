/**
 * Base URLs for the two calls the browser makes straight to the backends (contact
 * form, public sync). In dev they go through the dev server (nitro.devProxy in
 * nuxt.config.ts): the Python API's CORS allowlist only knows localhost:3001, and
 * that port is taken whenever the Docker frontend is up.
 */
export function useBackendBase() {
  const { public: { apiBase, pythonApiBase } } = useRuntimeConfig()
  return import.meta.dev
    ? { apiBase: '/_backend/rust', pythonApiBase: '/_backend/python' }
    : { apiBase, pythonApiBase }
}
