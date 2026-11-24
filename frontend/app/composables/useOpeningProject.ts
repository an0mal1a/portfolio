/**
 * Slug of the project being opened. Its screen carries `view-transition-name:
 * project-screen` on both pages, so the browser grows one into the other.
 */
export const useOpeningProject = () => useState<string | null>('opening-project', () => null)
