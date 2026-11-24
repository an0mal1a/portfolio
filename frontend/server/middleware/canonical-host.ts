// One host: www answers with a permanent redirect to the apex.
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })
  if (host === 'www.impablo.dev') return sendRedirect(event, `https://impablo.dev${event.path}`, 301)
})
