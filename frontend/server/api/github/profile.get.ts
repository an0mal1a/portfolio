export default defineEventHandler(async () => toGitHubProfile(await getProfile()))
