/**
 * Security headers sent with every response (server/middleware/security-headers.ts)
 * and listed, in this order, by the home page's security sheet. One source, so the
 * two can never drift apart.
 * CSP is limited to directives that hold without nonces (Nuxt inlines its boot
 * script); script-src hardening would need nonce support first.
 */
export const SECURITY_HEADERS = [
  ['strict-transport-security', 'max-age=31536000'],
  ['x-content-type-options', 'nosniff'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
  ['permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'],
  ['cross-origin-opener-policy', 'same-origin'],
  ['x-frame-options', 'DENY'],
  ['content-security-policy', 'frame-ancestors \'none\'; base-uri \'self\'; object-src \'none\'; form-action \'self\''],
] as const

export type SecurityHeaderName = typeof SECURITY_HEADERS[number][0]
