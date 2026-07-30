import { createError, getMethod, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path') ?? ''
  const method = getMethod(event)
  const apiBase = String(config.apiBase).replace(/\/$/, '')
  const target = `${apiBase}/${path.replace(/^\//, '')}/`

  try {
    return await $fetch(target, {
      method,
      body: method === 'GET' || method === 'HEAD' ? undefined : await readBody(event),
    })
  }
  catch (error: any) {
    throw createError({
      statusCode: error?.statusCode ?? 502,
      statusMessage: 'Portfolio API is unavailable',
      data: error?.data,
    })
  }
})
