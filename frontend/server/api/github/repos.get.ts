export default defineEventHandler(async () => toReposPayload(await getRepos()))
