import { defineSitemapEventHandler } from '#sitemap/server'

// Case studies come from the API, so their URLs are added at runtime with
// alternates for both locales.
export default defineSitemapEventHandler(async () => {
  const projects = await getProjects().catch(() => [])
  return projects.map(p => ({
    loc: `/proyectos/${p.slug}`,
    lastmod: p.updated_at,
    _i18nTransform: true,
  }))
})
