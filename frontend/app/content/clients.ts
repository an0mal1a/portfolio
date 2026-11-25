import { LOGO_BY_SLUG, type ClientLogo } from './showcase'

/**
 * Clients with recorded work get a stage on About: their logo over a still of the
 * site, which lights up and plays on hover. Keyed by the client's name in the
 * database; everyone else is a row.
 */
export const CLIENT_STAGES: Readonly<Record<string, { logo: ClientLogo, media: string }>> = {
  'Post Producciones': { logo: LOGO_BY_SLUG['postproducciones-web']!, media: 'post' },
  'Tierras de Ibiza': { logo: LOGO_BY_SLUG['tierradeibiza-web']!, media: 'tierras' },
  'La Casa de Susana': { logo: LOGO_BY_SLUG['lacasadesusana-web']!, media: 'susana' },
}

export const HIDDEN_CLIENT_NAMES: ReadonlySet<string> = new Set([
  'Limpiezas Alcober',
  'Alcober Services',
])

/** Marks for the rows below the stages. */
export const ROW_LOGOS: Readonly<Record<string, ClientLogo>> = {}
