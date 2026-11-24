// Runs the GitHub syncs as the owner, without the public daily limits.
//
//   npm run sync               profile and repositories, in production
//   npm run sync -- repos      only the repositories (or: profile)
//   npm run sync -- --local    against the local Docker stack
//
// Authorised with JOB_TOKEN, the same value the Python worker runs with: it is read from
// backends/.env, or from frontend/.env when production uses a different one.
import process from 'node:process'

const JOBS = { profile: 'profile', repos: 'repo_sync' }
const TIMEOUT_MS = 5 * 60_000

const args = process.argv.slice(2)
const local = args.includes('--local')
const names = args.filter(a => a !== '--local')
const unknown = names.filter(n => !JOBS[n])
if (unknown.length) fail(`Unknown job: ${unknown.join(', ')}. Use: profile, repos`)

const worker = local ? 'http://localhost:4041' : 'https://python-api.impablo.dev'
const site = local ? 'http://localhost:3001' : 'https://impablo.dev'
const token = process.env.JOB_TOKEN?.trim()
if (!token) fail('JOB_TOKEN is missing (backends/.env or frontend/.env)')

function fail(message) {
  console.error(message)
  process.exit(1)
}

async function json(url, init) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(30_000) })
  if (res.status === 401) fail('The worker rejected JOB_TOKEN: it is not the one this server runs with.')
  if (!res.ok) throw new Error(`${url} answered ${res.status}`)
  return res.status === 204 ? null : res.json()
}

const lastId = async () => Math.max(0, ...(await json(`${worker}/jobs`)).jobs.map(j => j.id))

async function run(name) {
  const before = await lastId()
  await json(`${worker}/jobs/${JOBS[name]}/run`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  console.log(`${name}: started`)
  for (const end = Date.now() + TIMEOUT_MS; Date.now() < end;) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const { jobs } = await json(`${worker}/jobs`)
    const job = jobs.filter(j => j.id > before).sort((a, b) => a.id - b.id)[0]
    if (!job || job.status === 'in_progress') continue
    if (job.status === 'failed') fail(`${name}: failed. ${job.error ?? ''}`)
    console.log(`${name}: done in ${(job.duration_ms / 1000).toFixed(1)} s`)
    return
  }
  fail(`${name}: still running after ${TIMEOUT_MS / 60_000} minutes`)
}

try {
  for (const name of names.length ? names : Object.keys(JOBS)) await run(name)
}
catch (error) {
  fail(error.cause?.code ? `${error.message} (${error.cause.code})` : error.message)
}

// The site keeps its own copy of the GitHub data: ask for the new one.
try {
  await json(`${site}/api/github/refresh`, { method: 'POST' })
  const { totals } = await json(`${site}/api/github/repos`)
  console.log(`${new URL(site).host} now shows ${totals.repos} repositories`)
}
catch {
  console.log(`Synced, but ${site} did not refresh: it will show the new data within 10 minutes.`)
}
