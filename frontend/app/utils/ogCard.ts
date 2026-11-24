// Link-preview cards, rendered by `npm run og`. Social networks cache them by URL:
// bump the version whenever they are rendered again.
const OG_VERSION = 1

export const ogCard = (locale: string) => `/og/stage-${locale === 'en' ? 'en' : 'es'}.jpg?v=${OG_VERSION}`
