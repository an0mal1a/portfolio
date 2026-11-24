interface PageSeo {
  title: string
  description: string
  /** Absolute or root-relative image; defaults to the locale's brand card. */
  image?: string
  type?: 'website' | 'article' | 'profile'
  /** Home and landings carry their full title without the " · Pablo Diez" suffix. */
  titleTemplate?: false
  noindex?: boolean
}

export function usePageSeo(o: PageSeo) {
  const { locale } = useI18n()
  const { public: { siteUrl } } = useRuntimeConfig()
  const abs = (u: string) => (u.startsWith('http') ? u : `${siteUrl}${u}`)
  const image = abs(o.image ?? `/og/og-${locale.value}.png?v=2`)

  useSeoMeta({
    title: o.title,
    description: o.description,
    ogTitle: o.title,
    ogDescription: o.description,
    ogType: o.type ?? 'website',
    ogSiteName: 'Pablo Diez',
    ogImage: image,
    ogImageWidth: o.image ? undefined : 1200,
    ogImageHeight: o.image ? undefined : 630,
    ogImageAlt: o.title,
    ogLocale: locale.value === 'en' ? 'en_GB' : 'es_ES',
    twitterCard: 'summary_large_image',
    robots: o.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
  })
  if (o.titleTemplate === false) useHead({ titleTemplate: null })
}
