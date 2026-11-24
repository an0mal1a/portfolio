/** Locale-aware formatting helpers bound to the active i18n locale. */
export function useFormat() {
  const { locale } = useI18n()
  const tag = computed(() => (locale.value === 'en' ? 'en-GB' : 'es-ES'))

  const number = (n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(tag.value, opts).format(n)
  const date = (iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
    iso ? new Intl.DateTimeFormat(tag.value, { timeZone: 'Europe/Madrid', ...opts }).format(new Date(iso)) : ''
  const monthYear = (iso: string | null | undefined) => date(iso, { month: 'short', year: 'numeric' })

  function relative(iso: string | null | undefined, now = Date.now()) {
    if (!iso) return ''
    const diff = (new Date(iso).getTime() - now) / 1000
    const rtf = new Intl.RelativeTimeFormat(tag.value, { numeric: 'auto' })
    const abs = Math.abs(diff)
    if (abs < 60) return rtf.format(Math.round(diff), 'second')
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
    if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day')
    return rtf.format(Math.round(diff / (86400 * 30)), 'month')
  }

  function duration(seconds: number) {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (d > 0) return locale.value === 'en' ? `${d}d ${h}h` : `${d} d ${h} h`
    if (h > 0) return `${h} h ${m} min`
    return `${m} min`
  }

  return { tag, number, date, monthYear, relative, duration }
}
