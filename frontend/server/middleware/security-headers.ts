import { SECURITY_HEADERS } from '#shared/security-headers'

// Security headers on every response. The home page's security sheet lists the same
// set (shared/security-headers.ts) and re-checks it from the visitor's own browser,
// so what it shows is what was served.
const headers = Object.fromEntries(SECURITY_HEADERS)

export default defineEventHandler((event) => {
  setResponseHeaders(event, headers)
})
