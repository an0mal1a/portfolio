/**
 * Projects shown in the home gallery, each with a real screen recording in
 * /public/media. Copy is the owner's (taglines match the case studies); `slug`
 * links the case study when one exists, `url` the live site when it is public.
 */
type Locale = 'es' | 'en'

export interface ClientLogo { src: string, width: number, height: number }

/** Client marks in one ink tone (public/logos, transparent). Shown next to the client's work. */
export const LOGO_BY_SLUG: Record<string, ClientLogo> = {
  'postproducciones-web': { src: '/logos/post-producciones.webp', width: 531, height: 192 },
  'tierradeibiza-web': { src: '/logos/tierras-de-ibiza.webp', width: 192, height: 192 },
  'lacasadesusana-web': { src: '/logos/la-casa-de-susana.webp', width: 117, height: 192 },
}

export interface ShowcaseItem {
  id: string
  name: string
  media: string
  slug?: string
  url?: string
  logo?: ClientLogo
  meta: string
  tagline: string
}

const items: (Omit<ShowcaseItem, 'meta' | 'tagline'> & { meta: Record<Locale, string>, tagline: Record<Locale, string> })[] = [
  {
    id: 'post',
    name: 'Post Producciones',
    media: 'post',
    slug: 'postproducciones-web',
    url: 'https://www.postproducciones.com',
    meta: { es: 'Web · 2026 · Ibiza', en: 'Website · 2026 · Ibiza' },
    tagline: {
      es: 'Web de una productora de Ibiza que abre como una película y separa dos caminos: las marcas que buscan producción y los actores que buscan su videobook.',
      en: 'Website for an Ibiza production company that opens like a film and gives brands and actors each their own path.',
    },
  },
  {
    id: 'tierras',
    name: 'Tierras de Ibiza',
    media: 'tierras',
    slug: 'tierradeibiza-web',
    url: 'https://www.tierrasdeibiza.com',
    meta: { es: 'Web · 2026 · Conectada con Vestta', en: 'Website · 2026 · Connected to Vestta' },
    tagline: {
      es: 'Escaparate inmobiliario conectado con Vestta para descubrir propiedades en Ibiza y convertir consultas en oportunidades.',
      en: 'Property showcase connected to Vestta to discover homes in Ibiza and turn enquiries into opportunities.',
    },
  },
  {
    // Unpublished (shared/unpublished.ts): a case study, but no url until it is live.
    id: 'susana',
    name: 'La Casa de Susana',
    media: 'susana',
    slug: 'lacasadesusana-web',
    meta: { es: 'Web · 2026 · Conectada con Vestta · Pendiente de publicar', en: 'Website · 2026 · Connected to Vestta · Not yet published' },
    tagline: {
      es: 'Web de una inmobiliaria boutique de Ibiza: el catálogo llega en directo desde Vestta y cada formulario crea el contacto en el CRM.',
      en: 'Website for a boutique Ibiza estate agency: the catalogue comes live from Vestta and every form creates the contact in the CRM.',
    },
  },
  {
    id: 'brisa',
    name: 'Brisa Operations',
    media: 'brisa',
    slug: 'brisa-saas',
    url: 'https://brisaops.com',
    meta: { es: 'Software · Equipos en campo', en: 'Software · Field teams' },
    tagline: {
      es: 'Plataforma de operaciones para equipos de trabajo en campo, desde la planificación hasta el reporting.',
      en: 'Operations platform for field teams, from planning to reporting.',
    },
  },
]

export function getShowcase(locale: string): ShowcaseItem[] {
  const l: Locale = locale === 'en' ? 'en' : 'es'
  return items.map(i => ({ ...i, logo: i.slug ? logoForSlug(i.slug) : undefined, meta: i.meta[l], tagline: i.tagline[l] }))
}

/** Case studies that have a real screen recording in /public/media. */
const MEDIA_BY_SLUG: Record<string, string> = {
  'vestta': 'vestta-tour',
  'postproducciones-web': 'post',
  'tierradeibiza-web': 'tierras',
  'lacasadesusana-web': 'susana',
  'vestta-web': 'vestta-web',
  'brisa-saas': 'brisa',
}

export function mediaForSlug(slug: string): string | undefined {
  return MEDIA_BY_SLUG[slug]
}

export function logoForSlug(slug: string): ClientLogo | undefined {
  return LOGO_BY_SLUG[slug]
}
