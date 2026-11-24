// Called by the Lab when a public sync finishes.
export default defineEventHandler((event) => {
  expireGithubData()
  return sendNoContent(event)
})
