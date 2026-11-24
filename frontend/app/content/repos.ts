/**
 * Offensive-security experiments (spyware, RATs, crackers) stay on GitHub but off a
 * site that sells to businesses (PRODUCT.md: no hacker theatre). Profile and pages
 * repositories carry no code worth listing. Remove a name to show that repository.
 */
const HIDDEN_REPOS: ReadonlySet<string> = new Set([
  'DarkSpecter', 'evilShadow', 'evilHunter', 'FakeMiner', 'Keyniffer', 'ruspy', 'BruTest',
  'an0mal1a', 'an0mal1a.github.io',
  // Unpublished client work (shared/unpublished.ts).
  'lacasadesusana-web',
])

export const isListedRepo = (name: string) => !HIDDEN_REPOS.has(name)
