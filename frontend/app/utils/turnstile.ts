const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export interface TurnstileOptions {
  'sitekey': string
  'action'?: string
  'theme'?: 'auto' | 'light' | 'dark'
  'language'?: string
  'size'?: 'normal' | 'flexible' | 'compact'
  'appearance'?: 'always' | 'execute' | 'interaction-only'
  'callback'?: (token: string) => void
  'expired-callback'?: () => void
  /** Returning true tells Turnstile the error is handled (no console noise). */
  'error-callback'?: (code: string) => boolean
  'before-interactive-callback'?: () => void
  'after-interactive-callback'?: () => void
}

export interface Turnstile {
  render: (el: HTMLElement, options: TurnstileOptions) => string | undefined
  reset: (id: string) => void
  remove: (id: string) => void
}

let loading: Promise<Turnstile> | null = null

/** Loads Cloudflare's script once, on demand. A failed load can be tried again. */
export function loadTurnstile(): Promise<Turnstile> {
  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    const fail = () => {
      loading = null
      script.remove()
      reject(new Error('turnstile_script'))
    }
    script.onerror = fail
    script.onload = () => {
      const { turnstile } = window as Window & { turnstile?: Turnstile }
      if (turnstile) resolve(turnstile)
      else fail()
    }
    document.head.append(script)
  })
  return loading
}
