import type { ProjectSummary } from '#shared/types/api'

const year = (p: ProjectSummary) => (p.completed_at ?? p.started_at ?? p.created_at ?? '').slice(0, 4)

/** Featured first, then projects with imagery, then most recent. */
export function sortProjects(list: ProjectSummary[]) {
  return [...list].sort((a, b) =>
    Number(b.is_featured) - Number(a.is_featured)
    || Number(!!b.image) - Number(!!a.image)
    || (b.completed_at ?? b.started_at ?? '').localeCompare(a.completed_at ?? a.started_at ?? ''))
}

export const projectYear = year
