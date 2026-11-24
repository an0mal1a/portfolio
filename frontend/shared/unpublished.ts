/**
 * Work that is built but not public yet. Shown without a link until it goes
 * live; the client record's `website` may point to a site that is not the
 * owner's work (La Casa de Susana's current domain is someone else's).
 */
export const UNPUBLISHED_CLIENTS: readonly string[] = ['La Casa de Susana']

export function isUnpublishedClient(name: string | null | undefined): boolean {
  return !!name && UNPUBLISHED_CLIENTS.includes(name)
}
