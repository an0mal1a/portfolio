/**
 * Custom event in Umami (the script tag is in app.vue). Does nothing when the script
 * is off (dev) or blocked. Never pass anything a visitor typed.
 */
export function trackEvent(name: string, data?: Record<string, string | number>) {
  if (import.meta.server) return
  const { umami } = window as Window & { umami?: { track: (name: string, data?: Record<string, unknown>) => void } }
  umami?.track(name, data)
}
