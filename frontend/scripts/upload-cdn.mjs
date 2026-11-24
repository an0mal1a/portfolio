// Uploads the heavy static folders of public/ to Bunny Storage (S3 API), which the
// pull zone serves at https://cdn.impablo.dev under the same paths.
//
//   npm run cdn            upload what is missing
//   npm run cdn -- --list  only compare, change nothing
//
// A file that exists with other content is never replaced: edges and browsers keep the
// old one for a month, so give the new file a new name (or pass --replace and purge).
// Credentials come from frontend/.env: BUNNY_CDN_HOST (S3 endpoint), BUNNY_STORAGE_ZONE,
// BUNNY_STORAGE_KEY, BUNNY_STORAGE_SECRET and, optionally, BUNNY_STORAGE_REGION.
import { createHash, createHmac } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { extname, join } from 'node:path'
import process from 'node:process'

const FOLDERS = ['media', 'covers', 'logos', 'certificates']
const TYPES = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml' }

const env = (k) => {
  const v = process.env[k]
  if (!v) throw new Error(`${k} is missing in frontend/.env`)
  return v
}
const endpoint = new URL(env('BUNNY_CDN_HOST'))
const bucket = env('BUNNY_STORAGE_ZONE')
const region = process.env.BUNNY_STORAGE_REGION || endpoint.hostname.split('-')[0]
const accessKey = env('BUNNY_STORAGE_KEY')
const secret = env('BUNNY_STORAGE_SECRET')

const sha = data => createHash('sha256').update(data).digest('hex')
const hmac = (key, data) => createHmac('sha256', key).update(data).digest()
const enc = s => encodeURIComponent(s).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)

/** One SigV4-signed request. */
function s3(method, key, { query = {}, body = '', headers = {} } = {}) {
  const now = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')
  const day = now.slice(0, 8)
  const path = `/${enc(bucket)}/${key.split('/').map(enc).join('/')}`
  const qs = Object.keys(query).sort().map(k => `${enc(k)}=${enc(query[k])}`).join('&')
  const payload = sha(body)
  const signed = { ...headers, 'host': endpoint.host, 'x-amz-content-sha256': payload, 'x-amz-date': now }
  const names = Object.keys(signed).sort()
  const canonical = [method, path, qs, ...names.map(n => `${n}:${signed[n]}`), '', names.join(';'), payload].join('\n')
  const scope = `${day}/${region}/s3/aws4_request`
  const k = ['s3', 'aws4_request'].reduce(hmac, hmac(hmac(`AWS4${secret}`, day), region))
  const signature = createHmac('sha256', k).update(['AWS4-HMAC-SHA256', now, scope, sha(canonical)].join('\n')).digest('hex')
  const { host: _, ...sent } = signed
  return fetch(`${endpoint.origin}${path}${qs ? `?${qs}` : ''}`, {
    method,
    headers: { ...sent, authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${names.join(';')}, Signature=${signature}` },
    body: method === 'PUT' ? body : undefined,
  })
}

async function remoteFiles() {
  const files = new Map()
  let token
  do {
    const res = await s3('GET', '', { query: { 'list-type': '2', 'max-keys': '1000', ...(token && { 'continuation-token': token }) } })
    const xml = await res.text()
    if (!res.ok) throw new Error(`List failed: ${res.status} ${/<Message>(.*?)<\/Message>/s.exec(xml)?.[1] ?? xml.slice(0, 200)}`)
    for (const [, c] of xml.matchAll(/<Contents>(.*?)<\/Contents>/gs)) {
      files.set(/<Key>(.*?)<\/Key>/s.exec(c)[1], Number(/<Size>(\d+)<\/Size>/.exec(c)?.[1]))
    }
    token = /<NextContinuationToken>(.*?)<\/NextContinuationToken>/s.exec(xml)?.[1]
  } while (token)
  return files
}

const listOnly = process.argv.includes('--list')
const replace = process.argv.includes('--replace')
const remote = await remoteFiles()
console.log(`${remote.size} files in ${bucket}`)

let failed = 0
for (const folder of FOLDERS) {
  for (const name of (await readdir(join('public', folder))).sort()) {
    const type = TYPES[extname(name)]
    if (!type) continue
    const key = `${folder}/${name}`
    const body = await readFile(join('public', key))
    const there = remote.has(key)
    if (there && remote.get(key) === body.length) continue
    if (there && !replace) {
      console.log(`differs   ${key}: rename it, or use --replace and purge the pull zone`)
      failed++
      continue
    }
    if (listOnly) {
      console.log(`missing   ${key} (${Math.round(body.length / 1024)} KB)`)
      continue
    }
    const res = await s3('PUT', key, { body, headers: { 'cache-control': 'public, max-age=2592000', 'content-type': type } })
    if (!res.ok) failed++
    console.log(`${res.ok ? 'uploaded ' : `FAILED ${res.status}`} ${key} (${Math.round(body.length / 1024)} KB)`)
  }
}
if (failed) process.exitCode = 1
