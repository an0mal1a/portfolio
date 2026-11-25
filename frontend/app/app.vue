<script setup lang="ts">
import { PROFILES } from '~/content/profiles'

const { t } = useI18n()
const head = useLocaleHead({ seo: true })
const { public: { siteUrl, umamiScriptUrl, umamiWebsiteId } } = useRuntimeConfig()

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: head.value.link ?? [],
  meta: head.value.meta ?? [],
  titleTemplate: (title?: string) => (title ? `${title} · Pablo Diez` : 'Pablo Diez'),
}))

// Umami. It only counts visits to the live domain, and an anchor is not a new page.
if (umamiScriptUrl && umamiWebsiteId) {
  useHead({
    script: [{
      'key': 'umami',
      'src': umamiScriptUrl,
      'defer': true,
      'fetchpriority': 'low',
      'data-website-id': umamiWebsiteId,
      'data-domains': new URL(siteUrl).hostname,
      'data-exclude-hash': 'true',
    }],
  })
}

useSchemaOrg([
  definePerson({
    'name': 'Pablo Diez',
    'url': siteUrl,
    'image': `${siteUrl}/images/pablo-color.jpg`,
    'jobTitle': t('schema.jobTitle'),
    'sameAs': PROFILES.map(p => p.url),
    'knowsAbout': ['Web design', 'Web development', 'Custom software', 'CRM', 'AI automation', 'Offensive security', 'Nuxt', 'Vue', 'Rust', 'Python', 'PostgreSQL'],
    'address': { '@type': 'PostalAddress', 'addressLocality': 'Ibiza', 'addressRegion': 'Illes Balears', 'addressCountry': 'ES' },
  }),
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#business`,
    'name': t('schema.businessName'),
    'description': t('seo.home.description'),
    'url': siteUrl,
    'image': `${siteUrl}${ogCard('es')}`,
    'logo': `${siteUrl}/icon-512.png?v=5`,
    'founder': { '@id': `${siteUrl}/#identity` },
    'address': { '@type': 'PostalAddress', 'addressLocality': 'Ibiza', 'addressRegion': 'Illes Balears', 'addressCountry': 'ES' },
    'areaServed': [{ '@type': 'Place', 'name': 'Ibiza' }, { '@type': 'Country', 'name': 'España' }],
    'knowsLanguage': ['es', 'en'],
  }),
  defineWebSite({ name: 'Pablo Diez', inLanguage: ['es-ES', 'en'] }),
  defineWebPage(),
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
